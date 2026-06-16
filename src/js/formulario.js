// ─────────────────────────────────────────────────────────────
// formulario.js — Validación Estructurada de Formularios
// ─────────────────────────────────────────────────────────────

// Funciones Atómicas de Validación (Reglas de Negocio)
function noVacio(valor) { 
    return valor !== undefined && valor !== null && valor.trim() !== ''; 
}

function limiteCaracteres(valor, max) { 
    return noVacio(valor) && valor.trim().length <= max; 
}

function rangoCaracteres(valor, min, max) {
    if (!noVacio(valor)) return false;
    const len = valor.trim().length;
    return len >= min && len <= max;
}

function verificarEdadMinima(fechaString, edadMinima = 18) {
    if (!noVacio(fechaString)) return false;
    const fechaNacimiento = new Date(fechaString);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad >= edadMinima;
}

function validarRutChile(rut) {
    if (!noVacio(rut)) return false;
    // Limpiar puntos y guiones, dejar solo números y la K
    const limpio = rut.replace(/[^0-9kK]/g, '');
    if (limpio.length < 7 || limpio.length > 9) return false;
    
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * parseInt(cuerpo.charAt(i));
        multiplo = (multiplo === 7) ? 2 : multiplo + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    let dvFinal = dvEsperado.toString();
    if (dvEsperado === 11) dvFinal = '0';
    if (dvEsperado === 10) dvFinal = 'K';
    
    return dv === dvFinal;
}

// --- ARREGLOS DE REGLAS BASADOS EN EL MODELO DEL PROFESOR ---

const reglasLogin = [
    {
        id: 'loginEmail',
        validar: (v) => rangoCaracteres(v, 1, 100) && /^[^\s@]+@(inacap\.cl|inacapmail\.cl|gmail\.com)$/i.test(v.trim()),
        mensaje: 'El correo es requerido (máx. 100 caracteres) y debe ser @inacap.cl, @inacapmail.cl o @gmail.com.'
    },
    {
        id: 'loginPassword',
        validar: (v) => rangoCaracteres(v, 4, 10),
        mensaje: 'La contraseña es requerida y debe contener entre 4 y 10 caracteres.'
    }
];

const reglasContacto = [
    {
        id: 'contactoNombre',
        validar: (v) => rangoCaracteres(v, 1, 100),
        mensaje: 'El nombre completo es requerido y no debe superar los 100 caracteres.'
    },
    {
        id: 'contactoEmail',
        validar: (v) => rangoCaracteres(v, 1, 100) && /^[^\s@]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/i.test(v.trim()),
        mensaje: 'El correo electrónico debe ser válido (máx. 100 caracteres) y pertenecer a @inacap.cl, @profesor.inacap.cl o @gmail.com.'
    },
    {
        id: 'contactoComentario',
        validar: (v) => rangoCaracteres(v, 1, 500),
        mensaje: 'El comentario es requerido y no debe superar los 500 caracteres.'
    }
];

const reglasRegistro = [
    {
        id: 'regRun',
        validar: (v) => validarRutChile(v),
        mensaje: 'Debe ingresar un RUN válido, sin puntos ni guion (Ej: 19011022K).'
    },
    {
        id: 'regNombre',
        validar: (v) => rangoCaracteres(v, 1, 50),
        mensaje: 'El nombre es requerido y su longitud máxima es de 50 caracteres.'
    },
    {
        id: 'regApellidos',
        validar: (v) => rangoCaracteres(v, 1, 100),
        mensaje: 'Los apellidos son requeridos y su longitud máxima es de 100 caracteres.'
    },
    {
        id: 'regEmail',
        validar: (v) => rangoCaracteres(v, 1, 100) && /^[^\s@]+@(inacap\.cl|inacapmail\.cl|gmail\.com)$/i.test(v.trim()),
        mensaje: 'El correo debe ser válido y pertenecer a @inacap.cl, @inacapmail.cl o @gmail.com.'
    },
    {
        id: 'regFechaNacimiento',
        validar: (v) => !noVacio(v) || verificarEdadMinima(v, 18), // Opcional según rúbrica, pero si se llena debe ser mayor de 18
        mensaje: 'Atención: El usuario debe ser mayor de 18 años para registrarse.'
    },
    {
        id: 'select-region',
        validar: (v) => noVacio(v),
        mensaje: 'Debe seleccionar una región de la lista.'
    },
    {
        id: 'select-comuna',
        validar: (v) => noVacio(v),
        mensaje: 'Debe seleccionar una comuna válida.'
    },
    {
        id: 'regDireccion',
        validar: (v) => rangoCaracteres(v, 1, 300),
        mensaje: 'La dirección es obligatoria y su longitud máxima es de 300 caracteres.'
    }
];

// --- MANIPULACIÓN OPERATIVA DEL HTML ---

function marcarError(campo, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    const feedback = campo.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = mensaje;
    }
}

function marcarOk(campo) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
}

function procesarValidacionCampo(regla) {
    const campo = document.getElementById(regla.id);
    if (!campo) return true; // Si el campo no existe en la vista actual, saltamos la regla de forma segura
    
    const esValido = regla.validar(campo.value);
    if (esValido) {
        marcarOk(campo);
    } else {
        marcarError(campo, regla.mensaje);
    }
    return esValido;
}

// ASIGNACIÓN DE EVENTOS DE ESCUCHA (Mapeo de Formularios del DOM)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Formulario de Inicio de Sesión
    const formLogin = document.getElementById('loginForm');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const resultados = reglasLogin.map(procesarValidacionCampo);
            const todoOk = resultados.every(r => r === true);
            
            if (todoOk) {
                // Simulación exitosa o lógica personalizada
                alert("Autenticación correcta. Redireccionando...");
                formLogin.reset();
            }
        });
    }

    // 2. Formulario de Contacto
    const formContacto = document.getElementById('contactoForm');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            const resultados = reglasContacto.map(procesarValidacionCampo);
            const todoOk = resultados.every(r => r === true);
            
            if (todoOk) {
                const alertaExito = document.getElementById('mensajeExito');
                if (alertaExito) alertaExito.classList.remove('d-none');
                formContacto.reset();
                // Limpiar clases visuales
                reglasContacto.forEach(r => document.getElementById(r.id).classList.remove('is-valid'));
            }
        });
    }

    // 3. Formulario de Registro
    const formRegistro = document.getElementById('registroForm');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const resultados = reglasRegistro.map(procesarValidacionCampo);
            const todoOk = resultados.every(r => r === true);
            
            if (todoOk) {
                const emailInput = document.getElementById('regEmail').value.toLowerCase();
                let mensajeDescuento = "";
                
                // Aplicar descuento por correo institucional según regla del caso
                if (emailInput.endsWith('@inacap.cl') || emailInput.endsWith('@inacapmail.cl')) {
                    mensajeDescuento = "\n\n¡Beneficio Gamer Detectado! Se ha asociado un 20% de descuento vitalicio a tu perfil institucional de INACAP.";
                }
                
                alert("¡Registro de usuario procesado con éxito!" + mensajeDescuento);
                formRegistro.reset();
                
                const selectComuna = document.getElementById('select-comuna');
                if (selectComuna) selectComuna.disabled = true;
                
                // Limpiar estilos de validación verde
                reglasRegistro.forEach(r => {
                    const el = document.getElementById(r.id);
                    if (el) el.classList.remove('is-valid');
                });
            }
        });
    }
});