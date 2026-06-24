document.addEventListener('DOMContentLoaded', () => {
    let productosGlobales = [];
    let carrito = JSON.parse(localStorage.getItem('carrito-levelup')) || [];

    // --- DETECCIÓN DE ENTORNO PARA RUTAS ---
    const esGitHubPages = window.location.hostname.includes('github.io');
    const baseRaiz = esGitHubPages ? `${window.location.origin}/tienda-levelup-gamer/` : `${window.location.origin}/`;
    const rutaJson = `${baseRaiz}data.json`;
    
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
        if (!grid) return;

        grid.innerHTML = lista.map((p, index) => `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm bg-dark border-secondary">
                    <img class="card-img-top" src="${p.imagen}" alt="Imagen de ${p.nombre}" 
                         style="height: 200px; object-fit: contain; background-color: #111; cursor: pointer;"
                         onclick="abrirCarrusel('${p.codigo}')" title="Haz clic para ver más grande"/>
                    
                    <div class="card-body d-flex flex-column text-white">
                        <span class="badge bg-secondary border border-secondary mb-2 align-self-start">${p.categoria}</span>
                        <h5 class="card-title fw-bold">${p.nombre}</h5>
                        <p class="card-text text-muted small flex-grow-1">${p.descripcion || ''}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary">
                            <span class="card-price fw-bold text-warning fs-5">$${p.precio.toLocaleString('es-CL')}</span>
                            <button class="btn btn-primary btn-sm fw-bold" onclick="agregarAlCarrito('${p.codigo}')">Añadir</button>
                        </div>
                    </div>
                </div>    
            </div>
        `).join("");
    }

    // 2. MÉTODOS DEL CARRITO DE COMPRAS
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
        alert(`¡${producto.nombre} añadido al carrito!`);
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
        const contadorMenu = document.getElementById('cart-count'); 
        const subtotalElemento = document.getElementById('carrito-subtotal');
        const totalElemento = document.getElementById('carrito-total');

        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        if (contadorMenu) {
            contadorMenu.textContent = totalItems;
        }

        if (!carritoItemsContenedor) return; 

        if (carrito.length === 0) {
            carritoItemsContenedor.innerHTML = `<p class="text-secondary text-center my-4 fs-5">El carrito está vacío.</p>`;
            if (subtotalElemento) subtotalElemento.innerText = "$0";
            if (totalElemento) totalElemento.innerText = "$0";
            return;
        }

        carritoItemsContenedor.innerHTML = carrito.map(item => `
            <div class="d-flex align-items-center justify-content-between mb-3 bg-dark p-3 rounded border border-secondary text-white">
                <div style="max-width: 60%;">
                    <h5 class="mb-0 fw-bold text-truncate">${item.nombre}</h5>
                    <small class="text-warning fs-6">$${item.precio.toLocaleString('es-CL')}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <input type="number" class="form-control text-center bg-secondary text-white border-0" 
                           value="${item.cantidad}" style="width: 70px;" 
                           onchange="modificarCantidad('${item.codigo}', this.value)" min="1">
                    <button class="btn btn-danger" onclick="eliminarDelCarrito('${item.codigo}')">X</button>
                </div>
            </div>
        `).join("");

        if (subtotalElemento) subtotalElemento.innerText = `$${subtotal.toLocaleString('es-CL')}`;
        if (totalElemento) totalElemento.innerText = `$${subtotal.toLocaleString('es-CL')}`;
    }
  // 3. MOTOR DEL CARRUSEL (MODAL BOOTSTRAP) - VERSIÓN RESPONSIVA
    window.abrirCarrusel = (codigo) => {
        const carouselInner = document.getElementById('modal-carousel-inner');
        if (!carouselInner) return;

        carouselInner.innerHTML = productosGlobales.map(p => `
            <div class="carousel-item ${p.codigo === codigo ? 'active' : ''}">
                <img src="${p.imagen}" class="d-block w-100 rounded" alt="Imagen de ${p.nombre}" style="height: 400px; object-fit: contain; background-color: #000;">
                
                <div class="carousel-caption bg-dark bg-opacity-75 rounded p-2 border border-secondary" style="bottom: 0; left: 0; right: 0;">
                    <h5 class="text-warning fw-bold mb-1">${p.nombre}</h5>
                    <p class="mb-0 text-white small">${p.descripcion || ''}</p>
                </div>
            </div>
        `).join("");

        // Invocamos el modal de Bootstrap y lo mostramos
        const modalElement = document.getElementById('productModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    };
    // =============================================================
    // SISTEMA DE RESEÑAS TEMPORALES (SESSION STORAGE)
    // =============================================================
    const formResena = document.getElementById('form-resena');
    const listaResenas = document.getElementById('lista-resenas');

    if (formResena && listaResenas) {
        const blogActual = window.location.pathname.split('/').pop() || 'blog';
        const claveStorage = `reseñas_${blogActual}`;

        const agregarReseñaAlHTML = (autor, estrellas, texto) => {
            const div = document.createElement('div');
            div.className = "card bg-dark text-white border-info mb-4 p-3 shadow-sm"; 
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-info">${autor}</span>
                    <span class="text-warning">${estrellas}</span>
                </div>
                <p class="mb-0 text-secondary">${texto}</p>
            `;
            listaResenas.appendChild(div);
        };

        // Cargar las reseñas previas al iniciar la página
        const reseñasGuardadas = JSON.parse(sessionStorage.getItem(claveStorage)) || [];
        reseñasGuardadas.forEach(res => {
            agregarReseñaAlHTML(res.autor, res.estrellas, res.texto);
        });

        // Evento al enviar el formulario
        formResena.addEventListener('submit', (e) => {
            e.preventDefault(); // ESTO ES VITAL: Detiene la recarga automática de la página
            
            const inputNombre = document.getElementById('nombre-resena');
            const inputEstrellas = document.getElementById('estrellas-resena');
            const inputTexto = document.getElementById('texto-resena');

            // Protección en caso de que falte un ID en el HTML
            if (!inputNombre || !inputEstrellas || !inputTexto) {
                alert("Error técnico: No se encontraron las cajas de texto en el HTML.");
                return;
            }

            const nombreAutor = inputNombre.value.trim();
            const cantidadEstrellas = Number(inputEstrellas.value);
            const textoComentario = inputTexto.value.trim();
            const estrellasDibujadas = '⭐'.repeat(cantidadEstrellas);

            const nuevaReseña = { autor: nombreAutor, estrellas: estrellasDibujadas, texto: textoComentario };

            // Guardar en el almacenamiento temporal
            reseñasGuardadas.push(nuevaReseña);
            sessionStorage.setItem(claveStorage, JSON.stringify(reseñasGuardadas));

            // Dibujar en pantalla
            agregarReseñaAlHTML(nuevaReseña.autor, nuevaReseña.estrellas, nuevaReseña.texto);
            
            formResena.reset();
            alert('¡Gracias por tu reseña! Ha sido publicada temporalmente.');
        });
    }
});