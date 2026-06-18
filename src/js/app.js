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

    // --- SELECTORES DINÁMICOS DE UBICACIÓN (REGIONES Y COMUNAS) PARA LA TIENDA PRINCIPAL ---
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

// =============================================================
// SIMULACIÓN DE INICIO DE SESIÓN Y REGISTRO
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Simulación y Validación para el Inicio de Sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const emailInput = loginForm.querySelector('input[type="email"]').value.trim().toLowerCase();
            const passwordInput = loginForm.querySelector('input[type="password"]').value;
            
            if (emailInput.length > 100) {
                alert("Error: El correo no puede superar los 100 caracteres.");
                return;
            }

            const dominiosValidos = ['@inacap.cl', '@inacapmail.cl', '@gmail.com'];
            const correoValido = dominiosValidos.some(dominio => emailInput.endsWith(dominio));
            
            if (!correoValido) {
                alert("Acceso denegado: El correo solo puede ser @inacap.cl, @inacapmail.cl o @gmail.com");
                return; 
            }

            if (passwordInput.length < 4 || passwordInput.length > 10) {
                alert("Error: La contraseña debe tener entre 4 y 10 caracteres.");
                return;
            }
            
            const contenedorCard = loginForm.parentElement;
            contenedorCard.innerHTML = `
                <div class="text-center py-5">
                    <h2 class="text-success fw-bold display-4 mb-4" style="font-family: var(--font-header);">¡Bienvenido Gamer!</h2>
                    <p class="fs-4 text-light mb-4">Inicio de sesión exitoso. Preparando tu arsenal...</p>
                    <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        });
    }

    // 2. Simulación y Validación para el Registro
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const runInput = document.getElementById('reg-run').value.trim().toUpperCase();
            const fechaNacimientoInput = registroForm.querySelector('input[type="date"]').value;
            
            if (runInput.length < 7 || runInput.length > 9) {
                alert("Error: El RUN debe tener un mínimo de 7 y un máximo de 9 caracteres.");
                return;
            }

            const formatoRunValido = /^[0-9]{6,8}[0-9K]$/.test(runInput);
            
            if (!formatoRunValido) {
                alert("Error: El RUN debe ingresarse estrictamente sin puntos ni guion (Ej: 19011022K).");
                return;
            }

            if (!fechaNacimientoInput) {
                alert("Error: Debes ingresar tu fecha de nacimiento.");
                return;
            }

            const fechaNacimiento = new Date(fechaNacimientoInput);
            const fechaActual = new Date();
            
            let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
            const diferenciaMeses = fechaActual.getMonth() - fechaNacimiento.getMonth();
            
            if (diferenciaMeses < 0 || (diferenciaMeses === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }

            if (edad < 18) {
                alert("Acceso denegado: El sistema de registro es exclusivamente para usuarios mayores de 18 años.");
                return;
            }
            
            const contenedorCard = registroForm.parentElement;
            contenedorCard.innerHTML = `
                <div class="text-center py-5">
                    <h2 class="text-warning fw-bold display-4 mb-4" style="font-family: var(--font-header);">¡Gracias por registrarte!</h2>
                    <p class="fs-4 text-light">Tu cuenta ha sido creada con éxito. Ya eres parte oficial de Level-Up Gamer.</p>
                    <button class="btn btn-outline-warning btn-lg mt-4 px-5 fw-bold" onclick="window.location.reload()">ACEPTAR Y VOLVER</button>
                </div>
            `;
        });
    }

    // 3. Simulación y Validación para el Formulario de Contacto
    const contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
        contactoForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nombreInput = contactoForm.querySelectorAll('input[type="text"]')[0].value.trim();
            const emailInput = contactoForm.querySelector('input[type="email"]').value.trim().toLowerCase();
            const comentarioInput = contactoForm.querySelector('textarea').value.trim();
            
            if (nombreInput.length > 100) {
                alert("Error: El nombre no puede superar los 100 caracteres.");
                return;
            }

            if (emailInput.length > 100) {
                alert("Error: El correo no puede superar los 100 caracteres.");
                return;
            }

            const dominiosValidosContacto = ['@inacap.cl', '@profesor.inacap.cl', '@gmail.com'];
            const correoValido = dominiosValidosContacto.some(dominio => emailInput.endsWith(dominio));
            
            if (!correoValido) {
                alert("Error: Para contacto solo se admiten correos @inacap.cl, @profesor.inacap.cl o @gmail.com");
                return; 
            }

            if (comentarioInput.length > 500) {
                alert("Error: El comentario no puede superar los 500 caracteres.");
                return;
            }
            
            const contenedorCard = contactoForm.parentElement;
            contenedorCard.innerHTML = `
                <div class="text-center py-5">
                    <h2 class="text-primary fw-bold display-4 mb-4" style="font-family: var(--font-header);">¡Mensaje Enviado!</h2>
                    <p class="fs-4 text-light">Hemos recibido tus comentarios. Nuestro equipo de soporte te contactará a la brevedad.</p>
                    <button class="btn btn-outline-primary btn-lg mt-4 px-5 fw-bold" onclick="window.location.reload()">ENVIAR OTRO MENSAJE</button>
                </div>
            `;
        });
    }

    // =============================================================
    // LÓGICA DE REGIONES Y COMUNAS (SELECTS ANIDADOS FORMULARIO HTML ESTÁTICO)
    // =============================================================
    const datosUbicacion = {
        "Región Metropolitana de Santiago": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Providencia"],
        "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
        "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"],
        "Región de La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica"],
        "Región de Ñuble": ["Chillán", "San Carlos", "Bulnes"]
    };

    // Lógica para la vista de Registro de la Tienda
    const regRegion = document.getElementById('reg-region');
    const regComuna = document.getElementById('reg-comuna');

    if (regRegion && regComuna) {
        Object.keys(datosUbicacion).forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regRegion.appendChild(option);
        });

        regRegion.addEventListener('change', (e) => {
            const regionSeleccionada = e.target.value;
            regComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
            
            if (regionSeleccionada) {
                regComuna.disabled = false;
                datosUbicacion[regionSeleccionada].forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    regComuna.appendChild(option);
                });
            } else {
                regComuna.disabled = true;
            }
        });
    }

    // Lógica para la vista de Nuevo/Editar Usuario (Administrador)
    const adminRegion = document.getElementById('admin-region');
    const adminComuna = document.getElementById('admin-comuna');

    if (adminRegion && adminComuna) {
        Object.keys(datosUbicacion).forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            adminRegion.appendChild(option);
        });

        adminRegion.addEventListener('change', (e) => {
            const regionSeleccionada = e.target.value;
            adminComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
            
            if (regionSeleccionada) {
                adminComuna.disabled = false;
                datosUbicacion[regionSeleccionada].forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    adminComuna.appendChild(option);
                });
            } else {
                adminComuna.disabled = true;
            }
        });
    }

    // =============================================================
    // LÓGICA DE VALIDACIÓN PARA PRODUCTOS (ADMINISTRADOR)
    // =============================================================
    const formNuevoProducto = document.getElementById('formNuevoProducto');
    
    if (formNuevoProducto) {
        formNuevoProducto.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputsNumber = formNuevoProducto.querySelectorAll('input[type="number"]');
            
            const precioValor = parseFloat(inputsNumber[0].value);
            const stockValor = parseFloat(inputsNumber[1].value);

            if (precioValor < 0) {
                alert("Error: El precio no puede ser negativo. El valor mínimo es 0 (producto FREE).");
                return;
            }

            if (stockValor < 0 || !Number.isInteger(stockValor)) {
                alert("Error: El stock debe ser un número entero positivo (sin decimales).");
                return;
            }

            alert("¡Éxito! El producto cumple con todas las reglas y ha sido guardado en el inventario.");
            formNuevoProducto.reset();
        });
    }
});