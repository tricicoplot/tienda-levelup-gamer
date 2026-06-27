// ─────────────────────────────────────────────────────────────
// formulario.js — Validación Estructurada de Formularios
// ─────────────────────────────────────────────────────────────

function noVacio(valor) { return valor !== undefined && valor !== null && valor.trim() !== ''; }
function limiteCaracteres(valor, max) { return noVacio(valor) && valor.trim().length <= max; }
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
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) { edad--; }
    return edad >= edadMinima;
}

function validarRutChile(rut) {
    if (!noVacio(rut)) return false;
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

const reglasLogin = [
    { id: 'loginEmail', validar: (v) => rangoCaracteres(v, 1, 100) && /^[^\s@]+@(inacap\.cl|inacapmail\.cl|gmail\.com)$/i.test(v.trim()), mensaje: 'Correo requerido y debe ser @inacap.cl, @inacapmail.cl o @gmail.com.' },
    { id: 'loginPassword', validar: (v) => rangoCaracteres(v, 4, 10), mensaje: 'Contraseña requerida (4-10 caracteres).' }
];

const reglasContacto = [
    { id: 'contactoNombre', validar: (v) => rangoCaracteres(v, 1, 100), mensaje: 'Nombre completo requerido (máx. 100).' },
    { id: 'contactoEmail', validar: (v) => rangoCaracteres(v, 1, 100) && /^[^\s@]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/i.test(v.trim()), mensaje: 'Correo inválido.' },
    { id: 'contactoComentario', validar: (v) => rangoCaracteres(v, 1, 500), mensaje: 'Comentario requerido (máx. 500).' }
];

const reglasRegistro = [
    { id: 'regRun', validar: (v) => validarRutChile(v), mensaje: 'RUN inválido (Ej: 19011022K).' },
    { id: 'regNombre', validar: (v) => rangoCaracteres(v, 1, 50), mensaje: 'Nombre requerido (máx. 50).' },
    { id: 'regApellidos', validar: (v) => rangoCaracteres(v, 1, 100), mensaje: 'Apellidos requeridos (máx. 100).' },
    { id: 'regEmail', validar: (v) => rangoCaracteres(v, 1, 100) && /^[^\s@]+@(inacap\.cl|inacapmail\.cl|gmail\.com)$/i.test(v.trim()), mensaje: 'Correo debe ser @inacap.cl, @inacapmail.cl o @gmail.com.' },
    { id: 'regFechaNacimiento', validar: (v) => verificarEdadMinima(v, 18), mensaje: 'Debes ser mayor de 18 años.' },
    { id: 'select-region', validar: (v) => noVacio(v), mensaje: 'Selecciona una región.' },
    { id: 'select-comuna', validar: (v) => noVacio(v), mensaje: 'Selecciona una comuna.' },
    { id: 'regDireccion', validar: (v) => rangoCaracteres(v, 1, 300), mensaje: 'Dirección requerida.' }
];

function marcarError(campo, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    const feedback = campo.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) { feedback.textContent = mensaje; }
}

function marcarOk(campo) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
}

function procesarValidacionCampo(regla) {
    const campo = document.getElementById(regla.id);
    if (!campo) return true;
    const esValido = regla.validar(campo.value);
    esValido ? marcarOk(campo) : marcarError(campo, regla.mensaje);
    return esValido;
}

document.addEventListener('DOMContentLoaded', () => {

    const datosRegiones = {
        "RM": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"],
        "V": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
        "VIII": ["Concepción", "Talcahuano", "San Pedro de la Paz"]
    };

    const selRegion = document.getElementById('select-region');
    const selComuna = document.getElementById('select-comuna');

    if (selRegion && selComuna) {
        selRegion.addEventListener('change', (e) => {
            const region = e.target.value;
            selComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
            if (region && datosRegiones[region]) {
                datosRegiones[region].forEach(com => { selComuna.innerHTML += `<option value="${com.toLowerCase()}">${com}</option>`; });
                selComuna.disabled = false;
            } else {
                selComuna.disabled = true;
            }
        });
    }

    const formRegistro = document.getElementById('registroForm');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const resultados = reglasRegistro.map(procesarValidacionCampo);
            const todoOk = resultados.every(r => r === true);
            
            if (todoOk) {
                const codDescuento = document.getElementById('regCodigoDescuento').value.toUpperCase();
                const codReferido = document.getElementById('regReferido').value.trim();
    
                let msj = "¡Registro de usuario procesado con éxito!";
    
                if (codDescuento === 'DUOC20') {
                    msj += "\n- ¡Cupón DUOC20 aplicado! Obtienes 20% de descuento vitalicio.";
                }
    
                if (codReferido !== '') {
                    localStorage.setItem('user-points', 500);
                    localStorage.setItem('user-level', 'Novato');
                    msj += `\n- ¡Código de referido detectado! Has ganado 500 Puntos LevelUp.`;
                }
    
                alert(msj);
                formRegistro.reset();
                selComuna.disabled = true;
                reglasRegistro.forEach(r => {
                    const el = document.getElementById(r.id);
                    if (el) el.classList.remove('is-valid', 'is-invalid');
                });
            }
        });
    }

    const formContacto = document.getElementById('contactoForm');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            const resultados = reglasContacto.map(procesarValidacionCampo);
            const todoOk = resultados.every(r => r === true);
            
            if (todoOk) {
                alert("¡Mensaje enviado correctamente!");
                formContacto.reset();
                reglasContacto.forEach(r => {
                    const el = document.getElementById(r.id);
                    if (el) el.classList.remove('is-valid', 'is-invalid');
                });
            }
        });
    }

    const formLogin = document.getElementById('loginForm');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const resultados = reglasLogin.map(procesarValidacionCampo);
            const todoOk = resultados.every(r => r === true);
            
            if (todoOk) {
                alert("¡Inicio de sesión exitoso!");
                formLogin.reset();
                reglasLogin.forEach(r => {
                    const el = document.getElementById(r.id);
                    if (el) el.classList.remove('is-valid', 'is-invalid');
                });
            }
        });
    }
});