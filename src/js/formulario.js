// ─────────────────────────────────────────────────────────────
// formulario.js — Validación de formularios (Login y Contacto)
// ─────────────────────────────────────────────────────────────

function noVacio(valor) { return valor.trim() !== ''; }
function limiteCaracteres(valor, max) { return valor.trim().length > 0 && valor.trim().length <= max; }
function passwordValido(valor) {
    const len = valor.trim().length;
    return len >= 4 && len <= 10;
}

function emailLoginValido(valor) {
    const regex = /^[^\s@]+@(inacap\.cl|inacapmail\.cl|gmail\.com)$/i;
    return regex.test(valor.trim()) && valor.trim().length <= 100;
}

function emailContactoValido(valor) {
    if (valor.trim() === '') return true; 
    const regex = /^[^\s@]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/i;
    return regex.test(valor.trim()) && valor.trim().length <= 100;
}

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

function validarCampo(regla) {
    const campo = document.getElementById(regla.id);
    const ok = regla.validar(campo.value, regla.param);
    ok ? marcarOk(campo) : marcarError(campo, regla.mensaje);
    return ok;
}

const formLogin = document.getElementById("loginForm");
const exitoLogin = document.getElementById("loginExito");
const reglasLogin = [
    { id: 'loginEmail', validar: emailLoginValido, mensaje: 'Correo requerido (@inacap.cl, @inacapmail.cl, @gmail.com)' },
    { id: 'loginPassword', validar: passwordValido, mensaje: 'La contraseña debe tener entre 4 y 10 caracteres' }
];

if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();
        const resultados = reglasLogin.map(validarCampo);
        const todoOk = resultados.every(r => r === true);
        if (todoOk) {
            exitoLogin.classList.remove('d-none');
            formLogin.reset();
            reglasLogin.forEach(r => document.getElementById(r.id).classList.remove('is-valid'));
            setTimeout(() => exitoLogin.classList.add('d-none'), 4000);
        }
    });
}

const formContacto = document.getElementById("contactoForm");
const exitoContacto = document.getElementById("contactoExito");
const reglasContacto = [
    { id: 'contactoNombre', validar: (val) => limiteCaracteres(val, 100), mensaje: 'Ingresa un nombre (Máx 100 caracteres)' },
    { id: 'contactoEmail', validar: emailContactoValido, mensaje: 'Correo inválido (@inacap.cl, @profesor.inacap.cl, @gmail.com)' },
    { id: 'contactoMensaje', validar: (val) => limiteCaracteres(val, 500), mensaje: 'El mensaje es requerido (Máx 500 caracteres)' }
];

if (formContacto) {
    formContacto.addEventListener('submit', function(event) {
        event.preventDefault();
        const resultados = reglasContacto.map(validarCampo);
        const todoOk = resultados.every(r => r === true);
        if (todoOk) {
            exitoContacto.classList.remove('d-none');
            formContacto.reset();
            reglasContacto.forEach(r => document.getElementById(r.id).classList.remove('is-valid'));
            setTimeout(() => exitoContacto.classList.add('d-none'), 4000);
        }
    });
}