function verificarAcceso(rolPermitido) {
    const usuario = JSON.parse(localStorage.getItem("usuario-actual")) || { rol: 'Cliente' };
    if (usuario.rol !== rolPermitido && usuario.rol !== 'Administrador') {
        alert("Acceso denegado.");
        window.location.href = '../index.html';
    }
}