// ─────────────────────────────────────────────────────────────
// app.js — Controlador central de productos, filtros y carrito
// ─────────────────────────────────────────────────────────────

const grid = document.getElementById("grid-productos");
const sinResultados = document.getElementById("sin-resultados");
const botonesFiltro = document.querySelectorAll("#filtros button");
const cartCount = document.getElementById("cart-count");

let carrito = JSON.parse(localStorage.getItem("carrito-levelup")) || [];
actualizarContadorCarrito();

function crearCard(producto) {
    return `
        <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm">
                <img class="card-img-top" src="${producto.imagen}" alt="${producto.nombre}"/>
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-dark border border-secondary mb-2 align-self-start">${producto.categoria}</span>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${producto.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="card-price">$${producto.precio.toLocaleString('es-CL')} CLP</span>
                        <button class="btn btn-neon btn-sm" onclick="agregarAlCarrito('${producto.codigo}')">Añadir</button>
                    </div>
                </div>
            </div>    
        </div>
    `;
}

function renderizar(lista) {
    if (lista.length === 0) {
        grid.innerHTML = "";
        sinResultados.classList.remove("d-none");
        return;
    }
    sinResultados.classList.add("d-none");
    grid.innerHTML = lista.map(crearCard).join("");
}

window.agregarAlCarrito = function(codigo) {
    carrito.push(codigo);
    localStorage.setItem("carrito-levelup", JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert("Producto añadido al carrito correctamente.");
};

function actualizarContadorCarrito() {
    if (cartCount) {
        cartCount.textContent = carrito.length;
    }
}

let todosLosProductos = [];

fetch('data.json')
    .then(respuesta => {
        if (!respuesta.ok) throw new Error("No se pudo cargar data.json");
        return respuesta.json();
    })
    .then(productos => {
        todosLosProductos = productos;
        renderizar(todosLosProductos);
    })
    .catch(error => console.error("Error al cargar productos:", error));

// Corrección de los filtros para evitar que los estilos fallen
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", (e) => {
        
        botonesFiltro.forEach(b => {
            b.classList.remove("active");
            if (b.classList.contains("btn-neon")) {
                b.classList.replace("btn-neon", "btn-outline-neon");
            }
        });
        
        const btnSeleccionado = e.target;
        btnSeleccionado.classList.add("active");
        
        if (btnSeleccionado.classList.contains("btn-outline-neon")) {
            btnSeleccionado.classList.replace("btn-outline-neon", "btn-neon");
        }

        const categoria = btnSeleccionado.getAttribute("data-categoria");
        
        if (categoria === "todos") {
            renderizar(todosLosProductos);
        } else {
            const filtrados = todosLosProductos.filter(prod => prod.categoria === categoria);
            renderizar(filtrados);
        }
    });
});