document.addEventListener('DOMContentLoaded', () => {
    let productosGlobales = [];

    // Detectamos si estamos dentro de una subcarpeta (como src/components/)
    // Si la URL contiene "components", debemos subir dos niveles (../../) para hallar el JSON
    const rutaJson = window.location.pathname.includes('components') ? '../../data.json' : 'data.json';

    fetch(rutaJson)
        .then(r => {
            if (!r.ok) throw new Error("No se pudo encontrar el archivo JSON en la ruta: " + rutaJson);
            return r.json();
        })
        .then(data => {
            productosGlobales = data;
            const grid = document.getElementById('grid-productos');
            
            // Si el contenedor existe (estamos en el index.html pública), renderiza las tarjetas
            if (grid) {
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
            }
            
            // Aquí puedes añadir la lógica para listar o rellenar la tabla del administrador
            const tablaAdmin = document.getElementById('tabla-productos-admin'); // Si usas una tabla en admin.html
            if (tablaAdmin) {
                // Lógica para pintar tus productos en el mantenedor administrativo
            }
        })
        .catch(err => console.error("Error cargando productos:", err));

    // ... (El resto de tus funciones como abrirCarruselEnProducto permanecen exactamente igual)
});