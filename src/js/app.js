document.addEventListener('DOMContentLoaded', () => {
    let productosGlobales = [];
    let carrito = JSON.parse(localStorage.getItem('carrito-levelup')) || [];
    let regionesDatos = [];

    // --- DETECCIÓN DE ENTORNO PARA RUTAS ---
    const esGitHubPages = window.location.hostname.includes('github.io');
    const baseRaiz = esGitHubPages ? `${window.location.origin}/tienda-levelup-gamer/` : `${window.location.origin}/`;

    const rutaJson = `${baseRaiz}data.json`;
    const rutaRegionesJson = `${baseRaiz}regiones.json`;
    
    // 1. CARGA Y RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
    fetch(rutaJson)
        .then(r => {
            if (!r.ok) throw new Error("No se pudo encontrar el archivo JSON en la ruta: " + rutaJson);
            return r.json();
        })
        .then(data => {
            productosGlobales = data;
            renderizarCatalogo(productosGlobales);
            actualizarInterfazCarrito();
        })
        .catch(err => console.error("Error cargando productos:", err));

    function renderizarCatalogo(lista) {
        const grid = document.getElementById('grid-productos');
        const sinResultados = document.getElementById('sin-resultados');
        
        if (!grid) return;

        if (lista.length === 0) {
            grid.innerHTML = "";
            if (sinResultados) sinResultados.classList.remove("d-none");
            return;
        }

        if (sinResultados) sinResultados.classList.add("d-none");

        grid.innerHTML = lista.map((p, index) => `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <img class="card-img-top" src="${p.imagen}" alt="Imagen de ${p.nombre}" style="height: 200px; object-fit: cover;"/>
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-dark border border-secondary mb-2 align-self-start">${p.categoria}</span>
                        <h5 class="card-title">${p.nombre}</h5>
                        <p class="card-text text-muted small flex-grow-1">${p.descripcion || ''}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="card-price fw-bold text-warning">$${p.precio.toLocaleString('es-CL')} CLP</span>
                            <div class="d-flex gap-1">
                                <button class="btn btn-outline-light btn-sm" onclick="abrirCarruselEnProducto(${index})">Ver</button>
                                <button class="btn btn-neon btn-sm" onclick="agregarAlCarrito('${p.codigo}')">Añadir</button>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        `).join("");
    }

    // --- CONFIGURACIÓN DE FILTROS ---
    const botonesFiltro = document.querySelectorAll("#filtros button");
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonesFiltro.forEach(b => {
                b.classList.remove("active");
                b.classList.replace("btn-neon", "btn-outline-neon");
            });
            
            const btnSeleccionado = e.target;
            btnSeleccionado.classList.add("active");
            btnSeleccionado.classList.replace("btn-outline-neon", "btn-neon");

            const categoria = btnSeleccionado.getAttribute("data-categoria");
            
            if (categoria === "todos") {
                renderizarCatalogo(productosGlobales);
            } else {
                const filtrados = productosGlobales.filter(prod => prod.categoria === categoria);
                renderizarCatalogo(filtrados);
            }
        });
    });

    // --- MÉTODOS DEL CARRITO DE COMPRAS (GLOBALES) ---
    window.agregarAlCarrito = (codigo) => {
        const producto = productosGlobales.find(p => p.codigo === codigo);
        if (!producto) return;

        const existe = carrito.find(item => item.codigo === codigo);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        guardarYActualizarCarrito();
    };

    window.eliminarDelCarrito = (codigo) => {
        carrito = carrito.filter(item => item.codigo !== codigo);
        guardarYActualizarCarrito();
    };

    window.modificarCantidad = (codigo, nuevaCantidad) => {
        const item = carrito.find(item => item.codigo === codigo);
        if (!item) return;

        item.cantidad = parseInt(nuevaCantidad);

        if (item.cantidad <= 0 || isNaN(item.cantidad)) {
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
        const contadorMenu = document.getElementById('cart-count'); // Indicador del Navbar
        const subtotalElemento = document.getElementById('carrito-subtotal');
        const totalElemento = document.getElementById('carrito-total');

        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        if (contadorMenu) {
            contadorMenu.textContent = totalItems;
        }

        if (!carritoItemsContenedor) return; // Si no estamos visualizando el Offcanvas/Barra lateral del carrito, salimos

        if (carrito.length === 0) {
            carritoItemsContenedor.innerHTML = `<p class="text-secondary text-center my-3">El carrito está vacío.</p>`;
            if (subtotalElemento) subtotalElemento.innerText = "$0";
            if (totalElemento) totalElemento.innerText = "$0";
            return;
        }

        carritoItemsContenedor.innerHTML = carrito.map(item => `
            <div class="d-flex align-items-center justify-content-between mb-3 bg-black p-2 rounded border border-secondary">
                <div style="max-width: 60%;">
                    <h6 class="mb-0 fw-bold text-truncate">${item.nombre}</h6>
                    <small class="text-warning">$${item.precio.toLocaleString('es-CL')} CLP</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <input type="number" class="form-control form-control-sm text-center bg-secondary text-white border-0" 
                           value="${item.cantidad}" style="width: 60px;" 
                           onchange="modificarCantidad('${item.codigo}', this.value)">
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito('${item.codigo}')">&times;</button>
                </div>
            </div>
        `).join("");

        if (subtotalElemento) subtotalElemento.innerText = `$${subtotal.toLocaleString('es-CL')}`;
        if (totalElemento) totalElemento.innerText = `$${subtotal.toLocaleString('es-CL')}`;
    }

    // --- LÓGICA DEL DETALLE (MODAL CARRUSEL) ---
    window.abrirCarruselEnProducto = (indexSeleccionado) => {
        const carouselInner = document.getElementById('modal-carousel-inner');
        if (!carouselInner) return;
        
        carouselInner.innerHTML = productosGlobales.map((p, i) => `
            <div class="carousel-item ${i === indexSeleccionado ? 'active' : ''}">
                <div class="text-center p-3">
                    <img src="${p.imagen}" class="img-fluid rounded mb-4" alt="${p.nombre}" style="max-height: 250px; object-fit: contain;">
                    <h3 class="fw-bold text-white">${p.nombre}</h3>
                    <p class="text-info fs-6 mb-1">Categoría: ${p.categoria}</p>
                    <p class="text-muted small px-3">${p.descripcion || 'Sin descripción disponible.'}</p>
                    <p class="fw-bold text-warning fs-4 mb-2">$${p.precio.toLocaleString('es-CL')} CLP</p>
                    <button class="btn btn-neon btn-md mt-2 px-4" onclick="agregarAlCarrito('${p.codigo}')">Añadir al Carrito</button>
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

    // --- SELECTORES DINÁMICOS DE UBICACIÓN (REGIONES Y COMUNAS) ---
    const selectRegion = document.getElementById('select-region');
    const selectComuna = document.getElementById('select-comuna');

    if (selectRegion && selectComuna) {
        fetch(rutaRegionesJson)
            .then(r => {
                if (!r.ok) throw new Error("No se pudo encontrar regiones.json");
                return r.json();
            })
            .then(data => {
                regionesDatos = data;
                selectRegion.innerHTML = '<option value="" selected disabled>Seleccione Región</option>' + 
                    data.map(item => `<option value="${item.region}">${item.region}</option>`).join("");
            })
            .catch(err => console.error("Error al cargar ubicaciones regionales:", err));

        selectRegion.addEventListener('change', (e) => {
            const regionSeleccionada = e.target.value;
            const regionEncontrada = regionesDatos.find(item => item.region === regionSeleccionada);

            if (regionEncontrada) {
                selectComuna.disabled = false;
                selectComuna.innerHTML = '<option value="" selected disabled>Seleccione Comuna</option>' + 
                    regionEncontrada.comunas.map(c => `<option value="${c}">${c}</option>`).join("");
            } else {
                selectComuna.innerHTML = '<option value="" selected disabled>Seleccione Comuna</option>';
                selectComuna.disabled = true;
            }
        });
    }
});