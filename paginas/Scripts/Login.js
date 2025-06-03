async function Ingresar() {
    let BaseURL = "http://inmobiliaria2025full.runasp.net/";
    let URL = BaseURL + "api/Login/Ingresar";
    const login = new Login($("#txtUsuario").val(), $("#txtClave").val());
    const Respuesta = await EjecutarComandoServicioRpta("POST", URL, login);

    if (Respuesta === undefined) {
        document.cookie = "token=0;path=/";
        $("#dvMensaje").removeClass("alert alert-success").addClass("alert alert-danger");
        return;
    }

    const r = Respuesta[0];
    if (!r.Autenticado) {
        document.cookie = "token=0;path=/";
        $("#dvMensaje").removeClass("alert alert-success").addClass("alert alert-danger").html(r.Mensaje);
        return;
    }

    // Guardar token y datos del usuario en cookies
    const extdays = 5;
    const d = new Date();
    d.setTime(d.getTime() + (extdays * 24 * 60 * 60 * 1000));
    const expires = ";expires=" + d.toUTCString();

    document.cookie = "token=" + r.Token + expires + ";path=/";
    document.cookie = "Perfil=" + r.Perfil + expires + ";path=/";
    document.cookie = "Usuario=" + r.Usuario + expires + ";path=/";

    $("#dvMensaje").removeClass("alert alert-danger").addClass("alert alert-success").html(r.Mensaje);

    // Redirigir según perfil
    if (r.Perfil === "ADMIN") {
        window.location.assign("dashboardAdmin.html");
    } else if (r.Perfil === "USUARIO") {
        window.location.assign("dashboardPublic.html");
    } else {
        console.warn("Perfil no reconocido. No se redireccionará.");
    }
}

class Login {
    constructor(Usuario, Clave) {
        this.Usuario = Usuario;
        this.Clave = Clave;
    }
}
