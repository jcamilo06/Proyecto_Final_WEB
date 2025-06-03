var BaseURL = "http://inmobiliaria.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaVisitas();
});

function LlenarTablaVisitas() {
    let URL = BaseURL + "api/Visitas/ConsultarTodos";
    $.get(URL, function (data) {
        $("#tblVisitas").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_visita" },
                { data: "id_propiedad" },
                { data: "id_cliente" },
                { data: "id_empleado" },
                { data: "id_tipo_visita" },
                {
                    data: "fecha_hora",
                    render: function (data) {
                        let dt = new Date(data);
                        return dt.toLocaleString();
                    }
                },
                { data: "comentarios" },
                {
                    data: "id_visita",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarPorId(${data})">
                            <i class="fas fa-trash-alt"></i></button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
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

    const url = BaseURL + "api/Visitas/" + accion;

    const opciones = {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visita)
    };

    try {
        const res = await fetch(url, opciones);
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function Consultar() {
    const id = $("#txtid_visita").val();
    const url = BaseURL + "api/Visitas/ConsultarXId?IdVisita=" + id;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const visita = await res.json();
            $("#txtid_propiedad").val(visita.id_propiedad);
            $("#txtid_cliente").val(visita.id_cliente);
            $("#txtid_empleado").val(visita.id_empleado);
            $("#txtid_tipo_visita").val(visita.id_tipo_visita);
            $("#txtfecha_hora").val(
                visita.fecha_hora.split("T")[0] + "T" + visita.fecha_hora.split("T")[1].substring(0, 5)
            );
            $("#txtcomentarios").val(visita.comentarios);
        } else {
            alert("No se encontró la visita");
        }
    } catch (error) {
        alert("Error al consultar la visita: " + error);
    }
}

async function EliminarDesdeFormulario() {
    const id = $("#txtid_visita").val();
    if (!id) {
        alert("Por favor ingrese el ID de la visita a eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de eliminar esta visita?")) return;

    const url = BaseURL + "api/Visitas/EliminarXId?IdVisita=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        alert("Error al eliminar la visita: " + error);
    }
}

async function EliminarPorId(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta visita?")) {
        return;
    }

    const url = BaseURL + "api/Visitas/EliminarXId?IdVisita=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaVisitas();
    } catch (error) {
        alert("Error al eliminar la visita: " + error);
    }
}


class Visita {
    constructor(id_visita, id_propiedad, id_cliente, id_empleado, id_tipo_visita, fecha_hora, comentarios) {
        this.id_visita = parseInt(id_visita);
        this.id_propiedad = parseInt(id_propiedad);
        this.id_cliente = parseInt(id_cliente);
        this.id_empleado = parseInt(id_empleado);
        this.id_tipo_visita = parseInt(id_tipo_visita);
        this.fecha_hora = fecha_hora;
        this.comentarios = comentarios;
    }
}
