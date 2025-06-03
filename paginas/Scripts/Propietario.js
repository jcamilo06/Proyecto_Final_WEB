var BaseURL = "http://inmobiliaria.runasp.net/";
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaPropietarios();
});

function LlenarTablaPropietarios() {
    let URL = BaseURL + "api/Propietarios/ConsultarTodos";
    LlenarTablaXServiciosAuth(URL, "#tblPropietarios");
}
async function EjecutarComando(Metodo, Funcion) {
    let URL = BaseURL + "api/Propietarios/" + Funcion;
    //Se construye el objeto consignacion
    const propietario = new Propietario($("#txtid_persona").val(), $("#txtidentificacion").val(), $("#txtnombres").val(), $("#txtapellidos").val(),
        $("#txttelefono").val(), $("#txtemail").val(), $("#txtdireccion").val());
    //Invoca el comando para ejecutar
    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, propietario);
    LlenarTablaPropietarios();
}
async function Consultar() {
    let identificacion = $("#txtidentificacion").val();
    let URL = BaseURL + "/api/Propietarios/ConsultarXDocumento?identificacion=" + identificacion;
    const propietario = await ConsultarServicioAuth(URL);
    if (propietario != null) {

        $("#txtid_persona").val(propietario.id_persona);
        $("#txtidentificacion").val(propietario.identificacion);
        $("#txtnombres").val(propietario.nombres);
        $("#txtapellidos").val(propietario.apellidos);
        $("#txttelefono").val(propietario.telefono);
        $("#txtemail").val(propietario.email);
        $("#txtdireccion").val(propietario.direccion);
        
       
    }
    else {
        $("#dvMensaje").html("El propietario no está en la base de datos");
        $("#txtid_persona").val("");
        $("#txtidentificacion").val("");
        $("#txtnombres").val("");
        $("#txtapellidos").val("");
        $("#txttelefono").val("");
        $("#txtemail").val("");
        $("#txtdireccion").val("");
        
    }
}
class Propietario {
    constructor(id_persona, identificacion, nombres, apellidos, telefono, email, direccion) {
        this.id_persona = id_persona;
        this.identificacion = identificacion;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
       

    }
}