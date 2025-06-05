var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaSedes();
});

function LlenarTablaSedes() {
    let URL = BaseURL + "api/sedes/ConsultarTodos";

    $.get(URL, function (data) {
        $("#tblSedes").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "ID_SEDE" },
                { data: "NOMBRE" },
                { data: "DIRECCION" },
                { data: "TELEFONO" },
                { data: "ID_CIUDAD" }
            ]
        });
    });
}

async function EjecutarComandoSede(Metodo, Funcion) {
    let URL = BaseURL + "api/sedes/" + Funcion;
    const sede = new Sede(
        parseInt($("#txtid_sede").val()) || 0,
        $("#txtnombre").val(),
        $("#txtdireccion").val(),
        $("#txttelefono").val(),
        parseInt($("#txtid_ciudad").val()) || 0
    );

    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, sede);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaSedes();
}

async function ConsultarSede() {
    let id = $("#txtid_sede").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de sede válido.");
        return;
    }

    let URL = BaseURL + "api/sedes/Consultar?id=" + id;
    const sede = await ConsultarServicioAuth(URL);

    if (sede && typeof sede === 'object' && !Array.isArray(sede)) {
        $("#txtid_sede").val(sede.ID_SEDE);
        $("#txtnombre").val(sede.NOMBRE);
        $("#txtdireccion").val(sede.DIRECCION);
        $("#txttelefono").val(sede.TELEFONO);
        $("#txtid_ciudad").val(sede.ID_CIUDAD);
    } else {
        $("#dvMensaje").html(typeof sede === 'string' ? sede : "La sede no está en la base de datos");
        $("#frmSedes input").val("");
    }
}

class Sede {
    constructor(id_sede, nombre, direccion, telefono, id_ciudad) {
        this.ID_SEDE = id_sede;
        this.NOMBRE = nombre;
        this.DIRECCION = direccion;
        this.TELEFONO = telefono;
        this.ID_CIUDAD = id_ciudad;
    }
}
