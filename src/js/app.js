document.addEventListener('DOMContentLoaded', () => {
    let productosGlobales = [];

    fetch('data.json')
        .then(r => r.json())
        .then(data => {
            productosGlobales = data; // Guardamos la lista completa
            const grid = document.getElementById('grid-productos');
            
            grid.innerHTML = data.map((p, index) => `
                <div class="col">
                    <div class="card h-100 bg-secondary text-white border-0 shadow">
                        <img src="${p.imagen}" class="card-img-top" alt="Imagen del producto: ${p.nombre}" style="height: 250px; object-fit: cover;">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold fs-4">${p.nombre}</h5>
                                <p class="card-text text-light">Categoría: ${p.categoria}</p>
                                <p class="card-text fw-bold text-warning fs-5">$${p.precio.toLocaleString('es-CL')}</p>
                            </div>
                            <button class="btn btn-primary w-100 mt-3" onclick="abrirCarruselEnProducto(${index})">Ver Detalle</button>
                        </div>
                    </div>
                </div>
            `).join("");
        })
        .catch(err => console.error("Error cargando productos:", err));

    // Función global para armar el carrusel con todos los productos e ir al seleccionado
    window.abrirCarruselEnProducto = (indexSeleccionado) => {
        const carouselInner = document.getElementById('modal-carousel-inner');
        
        // Creamos una diapositiva por cada producto de la lista
        carouselInner.innerHTML = productosGlobales.map((p, i) => `
            <div class="carousel-item ${i === indexSeleccionado ? 'active' : ''}">
                <div class="text-center p-3">
                    <img src="${p.imagen}" class="img-fluid rounded mb-4" alt="${p.nombre}" style="max-height: 350px; object-fit: contain;">
                    <h3 class="fw-bold text-white">${p.nombre}</h3>
                    <p class="text-info fs-5">Categoría: ${p.categoria}</p>
                    <p class="display-6 fw-bold text-warning">$${p.precio.toLocaleString('es-CL')}</p>
                    <p class="text-secondary small">Código: ${p.codigo}</p>
                </div>
            </div>
        `).join("");

        // Inicializamos y abrimos el Modal de Bootstrap
        const miModal = new bootstrap.Modal(document.getElementById('productModal'));
        miModal.show();
    };
});