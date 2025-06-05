var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaConsignaciones();
});

function LlenarTablaConsignaciones() {
    let URL = BaseURL + "api/consignaciones/ConsultarTodos";

    $.get(URL, function (data) {
        $("#tblConsignaciones").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "ID_CONSIGNACION" },
                {
                    data: "FECHA_INICIO",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "";
                    }
                },
                {
                    data: "FECHA_FIN",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "Sin finalizar";
                    }
                },
                { data: "PORCENTAJE_COMISION" },
                { data: "PROPIEDAD.ID_PROPIEDAD" },
                { data: "PROPIEDAD.TITULO" },
                { data: "PROPIETARIO.ID_PROPIETARIO" },
                { data: "PROPIETARIO.NOMBRES" }
            ]
        });
    });
}

async function EjecutarComandoConsignacion(Metodo, Funcion) {
    let URL = BaseURL + "api/consignaciones/" + Funcion;
    const consignacion = {
        ID_CONSIGNACION: parseInt($("#txtid_consignacion").val()) || 0,
        FECHA_INICIO: $("#txtfecha_inicio").val(),
        FECHA_FIN: $("#txtfecha_fin").val() || null,
        PORCENTAJE_COMISION: parseFloat($("#txtporcentaje_comision").val()) || 0,
        ID_PROPIEDAD: parseInt($("#txtid_propiedad").val()) || 0,
        ID_PROPIETARIO: parseInt($("#txtid_propietario").val()) || 0
    };

    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, consignacion);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaConsignaciones();
}

async function ConsultarConsignacion() {
    let id = $("#txtid_consignacion").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de consignación válido.");
        return;
    }

    let URL = BaseURL + "api/consignaciones/Consultar?id=" + id;
    const consignacion = await ConsultarServicioAuth(URL);

    if (consignacion && typeof consignacion === 'object' && !Array.isArray(consignacion)) {
        $("#txtid_consignacion").val(consignacion.ID_CONSIGNACION);
        $("#txtfecha_inicio").val(consignacion.FECHA_INICIO ? consignacion.FECHA_INICIO.split('T')[0] : "");
        $("#txtfecha_fin").val(consignacion.FECHA_FIN ? consignacion.FECHA_FIN.split('T')[0] : "");
        $("#txtporcentaje_comision").val(consignacion.PORCENTAJE_COMISION);
        $("#txtid_propiedad").val(consignacion.PROPIEDAD?.ID_PROPIEDAD || "");
        $("#txttitulo_propiedad").val(consignacion.PROPIEDAD?.TITULO || "");
        $("#txtid_propietario").val(consignacion.PROPIETARIO?.ID_PROPIETARIO || "");
        $("#txtnombre_propietario").val(consignacion.PROPIETARIO?.NOMBRES || "");
    } else {
        $("#dvMensaje").html(typeof consignacion === 'string' ? consignacion : "La consignación no está en la base de datos");
        $("#frmConsignaciones input").val("");
    }
}

class Consignacion {
    constructor(id_consignacion, fecha_inicio, fecha_fin, porcentaje_comision, propiedad, propietario) {
        this.ID_CONSIGNACION = id_consignacion;
        this.FECHA_INICIO = fecha_inicio;
        this.FECHA_FIN = fecha_fin;
        this.PORCENTAJE_COMISION = porcentaje_comision;
        this.PROPIEDAD = propiedad;
        this.PROPIETARIO = propietario;
    }
}
