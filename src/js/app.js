document.addEventListener("DOMContentLoaded", () => {
    fetch('data.json')
        .then(r => r.json())
        .then(data => {
            const grid = document.getElementById("grid-productos");
            if (!grid) return;
            grid.innerHTML = data.map(p => `
                <div class="col-md-3">
                    <div class="card p-3 bg-dark text-white border-secondary">
                        <h5>${p.nombre}</h5>
                        <p>$${p.precio.toLocaleString('es-CL')}</p>
                    </div>
                </div>
            `).join("");
        })
        .catch(err => console.error("Error cargando productos tienda:", err));
});