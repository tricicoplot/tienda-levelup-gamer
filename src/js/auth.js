function verificarAcceso(rolPermitido) {
    const sesion = localStorage.getItem("usuario-actual");
    if (!sesion) {
        window.location.href = 'login.html';
        return;
    }
    const usuario = JSON.parse(sesion);
    if (usuario.rol !== rolPermitido) {
        alert("Acceso denegado.");
        window.location.href = '../index.html';
    }
}