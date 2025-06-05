var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaVisitas();
});

function LlenarTablaVisitas() {
    let URL = BaseURL + "api/visitas/ConsultarTodos";
    $.get(URL, function (data) {
        if (!Array.isArray(data)) {
            $("#dvMensaje").html("No se pudieron cargar las visitas.");
            return;
        }

        const tabla = $("#tblVisitas");
        tabla.DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "ID_VISITA" },
                {
                    data: null,
                    render: v => v.PROPIEDAD?.TITULO || "-"
                },
                {
                    data: null,
                    render: v => v.CLIENTE?.NOMBRES || "-"
                },
                {
                    data: null,
                    render: v => v.EMPLEADO?.NOMBRES || "-"
                },
                {
                    data: null,
                    render: v => v.TIPO_VISITA?.DESCRIPCION || "-"
                },
                {
                    data: "FECHA_HORA",
                    render: function (data) {
                        const dt = new Date(data);
                        return dt.toLocaleString("es-CO");
                    }
                },
                { data: "COMENTARIOS" }
            ]
        });
    }).fail(() => $("#dvMensaje").html("Error al cargar las visitas.");
}

async function EjecutarComando(metodo, accion) {
    const visita = new Visita(
        $("#txtid_visita").val(),
        $("#txtid_propiedad").val(),
        $("#txtid_cliente").val(),
        $("#txtid_empleado").val(),
        $("#txtid_tipo_visita").val(),
        $("#txtfecha_hora").val(),
        $("#txtcomentarios").val()
    );

    const url = BaseURL + "api/visitas/" + accion;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visita)
        });
        const mensaje = await res.text();
        $("#dvMensaje").html(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        $("#dvMensaje").html("Error: " + error);
    }
}

async function Consultar() {
    const id = $("#txtid_visita").val();
    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de visita válido.");
        return;
    }

    const url = BaseURL + "api/visitas/Consultar?id=" + id;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            $("#dvMensaje").html("No se encontró la visita.");
            return;
        }

        const visita = await res.json();

        // Verifica si el objeto tiene contenido válido
        if (!visita || !visita.ID_VISITA) {
            $("#dvMensaje").html("No se encontró la visita.");
            return;
        }

        $("#txtid_visita").val(visita.ID_VISITA);
        $("#txtid_propiedad").val(visita.PROPIEDAD?.ID_PROPIEDAD || "");
        $("#txtid_cliente").val(visita.CLIENTE?.ID_CLIENTE || "");
        $("#txtid_empleado").val(visita.EMPLEADO?.ID_EMPLEADO || "");
        $("#txtid_tipo_visita").val(visita.TIPO_VISITA?.ID_TIPO_VISITA || "");
        $("#txtcomentarios").val(visita.COMENTARIOS || "");

        if (visita.FECHA_HORA) {
            const fecha = visita.FECHA_HORA.split("T");
            $("#txtfecha_hora").val(`${fecha[0]}T${fecha[1].substring(0, 5)}`);
        } else {
            $("#txtfecha_hora").val("");
        }

        $("#dvMensaje").html("Consulta exitosa.");
    } catch (error) {
        $("#dvMensaje").html("Error al consultar la visita: " + error);
    }
}

async function Eliminar() {
    const id = $("#txtid_visita").val();
    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de visita válido.");
        return;
    }

    const url = BaseURL + "api/visitas/Eliminar";

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ID_VISITA: parseInt(id) })
        });
        const mensaje = await res.text();
        $("#dvMensaje").html(mensaje).addClass("alert-success").show();
        LlenarTablaVisitas();
    } catch (error) {
        $("#dvMensaje").html("Error al eliminar la visita: " + error);
    }
}

class Visita {
    constructor(id_visita, id_propiedad, id_cliente, id_empleado, id_tipo_visita, fecha_hora, comentarios) {
        this.ID_VISITA = id_visita;
        this.ID_PROPIEDAD = id_propiedad;
        this.ID_CLIENTE = id_cliente;
        this.ID_EMPLEADO = id_empleado;
        this.ID_TIPO_VISITA = id_tipo_visita;
        this.FECHA_HORA = fecha_hora;
        this.COMENTARIOS = comentarios;
    }
}
