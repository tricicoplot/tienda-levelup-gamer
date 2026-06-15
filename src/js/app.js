document.addEventListener('DOMContentLoaded', () => {
    let productosGlobales = [];
    // Inicializar el carrito desde localStorage o vacío si no hay datos
    let carrito = JSON.parse(localStorage.getItem('carrito-levelup')) || [];

    // Detectamos si estamos dentro de una subcarpeta (como src/components/)
    const rutaJson = window.location.pathname.includes('components') ? '../../data.json' : 'data.json';

    fetch(rutaJson)
        .then(r => {
            if (!r.ok) throw new Error("No se pudo encontrar el archivo JSON en la ruta: " + rutaJson);
            return r.json();
        })
        .then(data => {
            productosGlobales = data;
            const grid = document.getElementById('grid-productos');
            
            if (grid) {
                grid.innerHTML = data.map((p, index) => `
                    <div class="col">
                        <div class="card h-100 bg-secondary text-white border-0 shadow">
                            <img src="${p.imagen}" class="card-img-top" alt="Imagen del producto: ${p.nombre}" style="height: 250px; object-fit: cover;">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="card-title fw-bold fs-4">${p.nombre}</h5>
                                    <p class="card-text text-light mb-1">Categoría: ${p.categoria}</p>
                                    <p class="card-text fw-bold text-warning fs-5">$${p.precio.toLocaleString('es-CL')}</p>
                                </div>
                                <div class="d-flex gap-2 mt-3">
                                    <button class="btn btn-outline-light w-50" onclick="abrirCarruselEnProducto(${index})">Detalle</button>
                                    <button class="btn btn-primary w-50" onclick="agregarAlCarrito('${p.codigo}')">Añadir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join("");
                
                // Renderizar el carrito guardado al cargar la página
                actualizarInterfazCarrito();
            }
        })
        .catch(err => console.error("Error cargando productos:", err));

    // --- FUNCIONALIDADES DEL CARRITO (Agregar, Modificar, Eliminar) ---

    window.agregarAlCarrito = (codigo) => {
        const producto = productosGlobales.find(p => p.codigo === codigo);
        if (!producto) return;

        const existe = carrito.find(item => item.codigo === codigo);

        if (existe) {
            existe.cantidad++; // Modificar cantidad sumando si ya existe
        } else {
            carrito.push({ ...producto, cantidad: 1 }); // Agregar producto nuevo
        }

        guardarYActualizarCarrito();
    };

    window.eliminarDelCarrito = (codigo) => {
        carrito = carrito.filter(item => item.codigo !== codigo); // Eliminar producto completamente
        guardarYActualizarCarrito();
    };

    window.modificarCantidad = (codigo, nuevaCantidad) => {
        const item = carrito.find(item => item.codigo === codigo);
        if (!item) return;

        item.cantidad = parseInt(nuevaCantidad);

        // Si la cantidad baja a 0 o menos, lo removemos automáticamente
        if (item.cantidad <= 0) {
            eliminarDelCarrito(codigo);
            return;
        }

        guardarYActualizarCarrito();
    };

    function guardarYActualizarCarrito() {
        localStorage.setItem('carrito-levelup', JSON.stringify(carrito));
        actualizarInterfazCarrito();
    }

    function actualizarInterfazCarrito() {
        const carritoItemsContenedor = document.getElementById('carrito-items');
        const contador = document.getElementById('carrito-contador');
        const subtotalElemento = document.getElementById('carrito-subtotal');
        const totalElemento = document.getElementById('carrito-total');

        if (!carritoItemsContenedor) return;

        if (carrito.length === 0) {
            carritoItemsContenedor.innerHTML = `<p class="text-secondary text-center my-3">El carrito está vacío.</p>`;
            contador.innerText = "0";
            subtotalElemento.innerText = "$0";
            totalElemento.innerText = "$0";
            return;
        }

        // Mostrar el resumen detallado recorriendo los items
        carritoItemsContenedor.innerHTML = carrito.map(item => `
            <div class="d-flex align-items-center justify-content-between mb-3 bg-black p-2 rounded border border-secondary">
                <div style="max-width: 60%;">
                    <h6 class="mb-0 fw-bold text-truncate">${item.nombre}</h6>
                    <small class="text-warning">$${item.precio.toLocaleString('es-CL')}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <input type="number" class="form-control form-control-sm text-center bg-secondary text-white border-0" 
                           value="${item.cantidad}" style="width: 50px;" 
                           onchange="modificarCantidad('${item.codigo}', this.value)">
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito('${item.codigo}')">&times;</button>
                </div>
            </div>
        `).join("");

        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        contador.innerText = totalItems;
        subtotalElemento.innerText = `$${subtotal.toLocaleString('es-CL')}`;
        totalElemento.innerText = `$${subtotal.toLocaleString('es-CL')}`;
    }

    // --- LÓGICA DEL MODAL CARRUSEL GLOBAL ---
    window.abrirCarruselEnProducto = (indexSeleccionado) => {
        const carouselInner = document.getElementById('modal-carousel-inner');
        if (!carouselInner) return;
        
        carouselInner.innerHTML = productosGlobales.map((p, i) => `
            <div class="carousel-item ${i === indexSeleccionado ? 'active' : ''}">
                <div class="text-center p-3">
                    <img src="${p.imagen}" class="img-fluid rounded mb-4" alt="${p.nombre}" style="max-height: 300px; object-fit: contain;">
                    <h3 class="fw-bold text-white fs-2">${p.nombre}</h3>
                    <p class="text-info fs-5 mb-1">Categoría: ${p.categoria}</p>
                    <p class="display-6 fw-bold text-warning mb-2">$${p.precio.toLocaleString('es-CL')}</p>
                    <button class="btn btn-primary btn-md mt-2 px-4" onclick="agregarAlCarrito('${p.codigo}')">Añadir al Carrito</button>
                </div>
            </div>
        `).join("");

        const modalElement = document.getElementById('productModal');
        let miModal = bootstrap.Modal.getInstance(modalElement);
        if (!miModal) {
            miModal = new bootstrap.Modal(modalElement);
        }
        miModal.show();
    };

    // --- VALIDACIÓN DE REGISTRO DE USUARIO (Rúbrica Word) ---
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = registroForm.querySelector('input[type="email"]').value;
            const fechaNacimientoInput = registroForm.querySelector('input[type="date"]').value;
            
            const fechaNacimiento = new Date(fechaNacimientoInput);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }
            
            if (edad < 18) {
                alert("Error: Solo se permite el registro de usuarios mayores de 18 años.");
                return;
            }
            
            let mensajeDescuento = "";
            if (emailInput.toLowerCase().endsWith('@duocuc.cl') || emailInput.toLowerCase().endsWith('@profesor.duoc.cl')) {
                mensajeDescuento = "\n¡Felicidades! Se ha aplicado un 20% de descuento de por vida en tu cuenta institucional.";
            }
            
            alert("Registro exitoso." + mensajeDescuento);
            registroForm.reset();
        });
    }
});