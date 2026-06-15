// ─────────────────────────────────────────────────────────────
// formulario.js — Validación de todos los formularios
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

function mayorDe18(fechaString) {
    if (!fechaString) return false;
    const fechaNac = new Date(fechaString);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad >= 18;
}

function passwordsCoinciden(valor) {
    const pass1 = document.getElementById("regPassword").value;
    return valor.trim() !== '' && valor === pass1;
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

// EVENTOS LOGIN
const formLogin = document.getElementById("loginForm");
const exitoLogin = document.getElementById("loginExito");
const reglasLogin = [
    { id: 'loginEmail', validar: emailLoginValido, mensaje: 'Usa @inacap.cl, @inacapmail.cl o @gmail.com' },
    { id: 'loginPassword', validar: passwordValido, mensaje: 'Entre 4 y 10 caracteres.' }
];

if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();
        const resultados = reglasLogin.map(validarCampo);
        if (resultados.every(r => r === true)) {
            exitoLogin.classList.remove('d-none');
            formLogin.reset();
            reglasLogin.forEach(r => document.getElementById(r.id).classList.remove('is-valid'));
            setTimeout(() => exitoLogin.classList.add('d-none'), 4000);
        }
    });
}

// EVENTOS CONTACTO
const formContacto = document.getElementById("contactoForm");
const exitoContacto = document.getElementById("contactoExito");
const reglasContacto = [
    { id: 'contactoNombre', validar: (val) => limiteCaracteres(val, 100), mensaje: 'Máx 100 caracteres.' },
    { id: 'contactoEmail', validar: emailContactoValido, mensaje: 'Usa @inacap.cl, @profesor.inacap.cl o @gmail.com' },
    { id: 'contactoMensaje', validar: (val) => limiteCaracteres(val, 500), mensaje: 'Máx 500 caracteres.' }
];

if (formContacto) {
    formContacto.addEventListener('submit', function(event) {
        event.preventDefault();
        const resultados = reglasContacto.map(validarCampo);
        if (resultados.every(r => r === true)) {
            exitoContacto.classList.remove('d-none');
            formContacto.reset();
            reglasContacto.forEach(r => document.getElementById(r.id).classList.remove('is-valid'));
            setTimeout(() => exitoContacto.classList.add('d-none'), 4000);
        }
    });
}

// EVENTOS REGISTRO
const formRegistro = document.getElementById("registroForm");
const exitoRegistro = document.getElementById("registroExito");
const reglasRegistro = [
    { id: 'regNombre', validar: (val) => limiteCaracteres(val, 100), mensaje: 'Máx 100 caracteres.' },
    { id: 'regCorreo', validar: emailLoginValido, mensaje: 'Usa @inacap.cl, @inacapmail.cl o @gmail.com' },
    { id: 'regFechaNac', validar: mayorDe18, mensaje: 'Debes ser mayor de 18 años.' },
    { id: 'regPassword', validar: passwordValido, mensaje: 'Entre 4 y 10 caracteres.' },
    { id: 'regConfirmPassword', validar: passwordsCoinciden, mensaje: 'No coinciden.' },
    { id: 'regRegion', validar: noVacio, mensaje: 'Selecciona una región.' },
    { id: 'regComuna', validar: noVacio, mensaje: 'Selecciona una comuna.' }
];

if (formRegistro) {
    formRegistro.addEventListener('submit', function(event) {
        event.preventDefault();
        const resultados = reglasRegistro.map(validarCampo);
        if (resultados.every(r => r === true)) {
            exitoRegistro.classList.remove('d-none');
            formRegistro.reset();
            document.getElementById("regComuna").disabled = true;
            reglasRegistro.forEach(r => document.getElementById(r.id).classList.remove('is-valid'));
            setTimeout(() => exitoRegistro.classList.add('d-none'), 4000);
        }
    });
}

// Validación Módulo 11 para RUT Chileno
function validarRUT(rut) {
    rut = rut.replace(/[^0-9kK]/g, '');
    if (rut.length < 7 || rut.length > 9) return false;
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * cuerpo.charAt(i);
        multiplo = (multiplo === 7) ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvFinal = (dvEsperado === 11) ? '0' : (dvEsperado === 10) ? 'K' : dvEsperado.toString();
    return dv === dvFinal;
}

function validarRUT(rutCompleto) {
    rutCompleto = rutCompleto.replace(/[^0-9kK]/g, '');
    if (rutCompleto.length < 8) return false;
    let rut = rutCompleto.slice(0, -1);
    let dv = rutCompleto.slice(-1).toUpperCase();
    
    let suma = 0, multiplo = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut.charAt(i)) * multiplo;
        multiplo = (multiplo === 7) ? 2 : multiplo + 1;
    }
    let dvEsperado = 11 - (suma % 11);
    let dvFinal = (dvEsperado === 11) ? '0' : (dvEsperado === 10) ? 'K' : dvEsperado.toString();
    return dv === dvFinal;
}