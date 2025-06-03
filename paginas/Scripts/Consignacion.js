var BaseURL = "http://inmobiliaria.runasp.net/";
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaConsignaciones();
});

function LlenarTablaConsignaciones() {
    let URL = BaseURL + "api/Consignaciones/ConsultarTodos";
    LlenarTablaXServiciosAuth(URL, "#tblConsignaciones");
}
async function EjecutarComando(Metodo, Funcion) {
    let URL = BaseURL + "api/Consignaciones/" + Funcion;
    //Se construye el objeto consignacion
    const consignacion = new Consignacion($("#txtid_consignacion").val(), $("#txtid_propiedad").val(), $("#txtid_propietario").val(), $("#txtfecha_inicio").val(),
        $("#txtfecha_fin").val(), $("#txtporcentaje_comision").val());
    //Invoca el comando para ejecutar
    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, consignacion);
    LlenarTablaConsignaciones();
}
async function Consultar() {
    let id_consignacion = $("#txtid_consignacion").val();
    let URL = BaseURL + "/api/Consignaciones/ConsultarXId?id=" + id_consignacion;
    const consignacion = await ConsultarServicioAuth(URL);
    if (consignacion != null) {

        $("#txtid_consignacion").val(consignacion.id_consignacion);
        $("#txtid_propiedad").val(consignacion.id_propiedad);
        $("#txtid_propietario").val(consignacion.id_propietario);
        $("#txtfecha_inicio").val(consignacion.fecha_inicio.split('T')[0]);
        $("#txtfecha_fin").val(consignacion.fecha_fin.split('T')[0]);
        $("#txtporcentaje_comision").val(consignacion.porcentaje_comision);
        
       
    }
    else {
        $("#dvMensaje").html("La consignación no está en la base de datos");
        $("#txtid_consignacion").val("");
        $("#txtid_propiedad").val("");
        $("#txtid_propietario").val("");
        $("#txtfecha_inicio").val("");
        $("#txtfecha_fin").val("");
        $("#txtporcentaje_comision").val("");
        
    }
}
class Consignacion {
    constructor(id_consignacion, id_propiedad, id_propietario, fecha_inicio, fecha_fin, porcentaje_comision) {
        this.id_consignacion = id_consignacion;
        this.id_propiedad = id_propiedad;
        this.id_propietario = id_propietario;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.porcentaje_comision = porcentaje_comision;
       

    }
}