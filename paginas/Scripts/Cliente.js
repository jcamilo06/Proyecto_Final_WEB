var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaClientes();
});

function LlenarTablaClientes() {
    let URL = BaseURL + "api/clientes/ConsultarTodos";
    LlenarTablaXServiciosAuth(URL, "#tblClientes");
}

async function EjecutarComando(Metodo, Funcion) {
    let URL = BaseURL + "api/clientes/" + Funcion;
    const cliente = new Cliente(
        parseInt($("#txtid_cliente").val()) || 0,
        $("#txtidentificacion").val(),
        $("#txtnombres").val(),
        $("#txtapellidos").val(),
        $("#txttelefono").val(),
        $("#txtemail").val(),
        $("#txtdireccion").val(),
        $("#txtfecha_registro").val()
    );
    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, cliente);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaClientes();
}

async function Consultar() {
    let id = $("#txtid_cliente").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de cliente válido.");
        return;
    }

    let URL = BaseURL + "api/clientes/Consultar?id=" + id;
    const cliente = await ConsultarServicioAuth(URL);

    if (cliente && typeof cliente === 'object' && !Array.isArray(cliente)) {
        $("#txtid_empleado").val(cliente.ID_CLIENTE);
        $("#txtidentificacion").val(cliente.IDENTIFICACION);
        $("#txtnombres").val(cliente.NOMBRES);
        $("#txtapellidos").val(cliente.APELLIDOS);
        $("#txttelefono").val(cliente.TELEFONO);
        $("#txtemail").val(cliente.EMAIL);
        $("#txtdireccion").val(cliente.DIRECCION);
        $("#txtfecha_registro").val(cliente.FECHA_REGISTRO?.split('T')[0] || "");
    } else {
        $("#dvMensaje").html(typeof cliente === 'string' ? cliente : "El cliente no está en la base de datos");
        $("#frmIncapacidades input").val("");
    }
}

class cliente {
    constructor(id_cliente, identificacion, nombres, apellidos, telefono, email, direccion, fecha_registro) {
        this.ID_CLIENTE = id_cliente;
        this.IDENTIFICACION = identificacion;
        this.NOMBRES = nombres;
        this.APELLIDOS = apellidos;
        this.TELEFONO = telefono;
        this.EMAIL = email;
        this.DIRECCION = direccion;
        this.FECHA_REGISTRO = fecha_registro;
    }
}