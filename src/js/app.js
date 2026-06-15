document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = window.location.pathname.includes('admin.html');
    const url = isAdmin ? '../data.json' : 'data.json';
    
    fetch(url)
        .then(r => r.json())
        .then(data => {
            const grid = document.getElementById("grid-productos");
            if(grid) {
                grid.innerHTML = data.map(p => `
                    <div class="col">
                        <div class="card h-100 bg-dark text-white border-secondary">
                            <div class="card-body">
                                <h5 class="card-title">${p.nombre}</h5>
                                <p class="card-text text-success">$${p.precio.toLocaleString('es-CL')}</p>
                                <button class="btn btn-outline-primary">Comprar</button>
                            </div>
                        </div>
                    </div>
                `).join("");
            }
        });
});