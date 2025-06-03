var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaEmpleados();
});

function LlenarTablaEmpleados() {
    let URL = BaseURL + "api/empleados/ConsultarTodos";
    LlenarTablaXServiciosAuth(URL, "#tblEmpleados");
}

async function EjecutarComando(Metodo, Funcion) {
    let URL = BaseURL + "api/empleados/" + Funcion;
    const empleado = new Empleado(
        parseInt($("#txtid_empleado").val()) || 0,
        $("#txtidentificacion").val(),
        $("#txtnombres").val(),
        $("#txtapellidos").val(),
        $("#txttelefono").val(),
        $("#txtemail").val(),
        $("#txtdireccion").val(),
        $("#txtcargo").val(),
        $("#txtfecha_ingreso").val(),
        parseFloat($("#txtsalario").val()) || 0,
        parseInt($("#txtsede_id").val()) || 0,
        $("#txtusuario").val(),
        $("#txtclave").val()
    );
    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, empleado);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaEmpleados();
}

async function Consultar() {
    let id = $("#txtid_empleado").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de empleado válido.");
        return;
    }

    let URL = BaseURL + "api/empleados/Consultar?id=" + id;
    const empleado = await ConsultarServicioAuth(URL);

    if (empleado && typeof empleado === 'object' && !Array.isArray(empleado)) {
        $("#txtid_empleado").val(empleado.ID_EMPLEADO);
        $("#txtidentificacion").val(empleado.IDENTIFICACION);
        $("#txtnombres").val(empleado.NOMBRES);
        $("#txtapellidos").val(empleado.APELLIDOS);
        $("#txttelefono").val(empleado.TELEFONO);
        $("#txtemail").val(empleado.EMAIL);
        $("#txtdireccion").val(empleado.DIRECCION);
        $("#txtcargo").val(empleado.CARGO);
        $("#txtfecha_ingreso").val(empleado.FECHA_INGRESO?.split('T')[0] || "");
        $("#txtsalario").val(empleado.SALARIO);
        $("#txtsede_id").val(empleado.ID_SEDE);
        $("#txtusuario").val(empleado.USUARIO || "");
        $("#txtclave").val(empleado.CLAVE || "");
    } else {
        $("#dvMensaje").html(typeof empleado === 'string' ? empleado : "El empleado no está en la base de datos");
        $("#frmIncapacidades input").val("");
    }
}

class Empleado {
    constructor(id_empleado, identificacion, nombres, apellidos, telefono, email, direccion, cargo, fecha_ingreso, salario, sede_id, usuario, clave) {
        this.ID_EMPLEADO = id_empleado;
        this.IDENTIFICACION = identificacion;
        this.NOMBRES = nombres;
        this.APELLIDOS = apellidos;
        this.TELEFONO = telefono;
        this.EMAIL = email;
        this.DIRECCION = direccion;
        this.CARGO = cargo;
        this.FECHA_INGRESO = fecha_ingreso;
        this.SALARIO = salario;
        this.ID_SEDE = sede_id;
        this.USUARIO = usuario;
        this.CLAVE = clave;
    }
}