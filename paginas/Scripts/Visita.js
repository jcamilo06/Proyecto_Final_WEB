var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaVisitas();
});

function LlenarTablaVisitas() {
    let URL = BaseURL + "api/visitas/ConsultarTodos";
    $.get(URL, function (data) {
        if (!Array.isArray(data)) {
            alert("No se pudieron cargar las visitas.");
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
                { data: "COMENTARIOS" },
                {
                    data: "ID_VISITA",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarPorId(${data})">
                                    <i class="fas fa-trash-alt"></i></button>`;
                    },
                    orderable: false
                }
            ]
        });
    }).fail(() => alert("Error al cargar las visitas."));
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
        alert(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function Consultar() {
    const id = $("#txtid_visita").val();
    const url = BaseURL + "api/visitas/Consultar?id=" + id;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            alert("No se encontró la visita");
            return;
        }

        const visita = await res.json();

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
    } catch (error) {
        alert("Error al consultar la visita: " + error);
    }
}


async function EliminarDesdeFormulario() {
    const id = $("#txtid_visita").val();
    if (!id || !confirm("¿Estás seguro de eliminar esta visita?")) return;

    const url = BaseURL + "api/visitas/Eliminar"; // 🔁 CORREGIDA

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ID_VISITA: parseInt(id) })
        });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        alert("Error al eliminar la visita: " + error);
    }
}

async function EliminarPorId(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta visita?")) return;

    const url = BaseURL + "api/visitas/Eliminar"; // 🔁 CORREGIDA

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ID_VISITA: parseInt(id) })
        });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        alert("Error al eliminar la visita: " + error);
    }
}

class Visita {
    constructor(id_visita, id_propiedad, id_cliente, id_empleado, id_tipo_visita, fecha_hora, comentarios) {
        this.ID_VISITA = parseInt(id_visita);
        this.ID_PROPIEDAD = parseInt(id_propiedad);
        this.ID_CLIENTE = parseInt(id_cliente);
        this.ID_EMPLEADO = parseInt(id_empleado);
        this.ID_TIPO_VISITA = parseInt(id_tipo_visita);
        this.FECHA_HORA = fecha_hora;
        this.COMENTARIOS = comentarios;
    }
}
