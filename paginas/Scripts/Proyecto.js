var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaProyectos();
});

function LlenarTablaProyectos() {
    let URL = BaseURL + "api/proyectos/ConsultarTodos";

    $.get(URL, function (data) {
        $("#tblProyectos").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "ID_PROYECTO" },
                { data: "NOMBRE" },
                { data: "CIUDAD.ID_CIUDAD" },
                { data: "DIRECCION" },
                {
                    data: "FECHA_LANZAMIENTO",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "";
                    }
                },
                {
                    data: "FECHA_ENTREGA_ESTIMADA",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "";
                    }
                },
                { data: "DESARROLLADOR" }
            ]
        });
    });
}


async function EjecutarComandoProyecto(Metodo, Funcion) {
    let URL = BaseURL + "api/proyectos/" + Funcion;
    const proyecto = new Proyecto(
        parseInt($("#txtid_proyecto").val()) || 0,
        $("#txtnombre").val(),
        parseInt($("#txtid_ciudad").val()) || 0,
        $("#txtdireccion").val(),
        $("#txtfecha_lanzamiento").val(),
        $("#txtfecha_entrega_estimada").val(),
        $("#txtdesarrollador").val()
    );

    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, proyecto);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaProyectos();
}

async function ConsultarProyecto() {
    let id = $("#txtid_proyecto").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de proyecto válido.");
        return;
    }

    let URL = BaseURL + "api/proyectos/Consultar?id=" + id;
    const proyecto = await ConsultarServicioAuth(URL);

    if (proyecto && typeof proyecto === 'object' && !Array.isArray(proyecto)) {
        $("#txtid_proyecto").val(proyecto.ID_PROYECTO);
        $("#txtnombre").val(proyecto.NOMBRE);
        $("#txtid_ciudad").val(proyecto.CIUDAD?.ID_CIUDAD || "");
        $("#txtdireccion").val(proyecto.DIRECCION);
        $("#txtfecha_lanzamiento").val(proyecto.FECHA_LANZAMIENTO?.split('T')[0] || "");
        $("#txtfecha_entrega_estimada").val(proyecto.FECHA_ENTREGA_ESTIMADA?.split('T')[0] || "");
        $("#txtdesarrollador").val(proyecto.DESARROLLADOR);
    } else {
        $("#dvMensaje").html(typeof proyecto === 'string' ? proyecto : "El proyecto no está en la base de datos");
        $("#frmProyectos input").val("");
    }
}

class Proyecto {
    constructor(id_proyecto, nombre, id_ciudad, direccion, fecha_lanzamiento, fecha_entrega_estimada, desarrollador) {
        this.ID_PROYECTO = id_proyecto;
        this.NOMBRE = nombre;
        this.ID_CIUDAD = id_ciudad;
        this.DIRECCION = direccion;
        this.FECHA_LANZAMIENTO = fecha_lanzamiento;
        this.FECHA_ENTREGA_ESTIMADA = fecha_entrega_estimada;
        this.DESARROLLADOR = desarrollador;
    }
}
