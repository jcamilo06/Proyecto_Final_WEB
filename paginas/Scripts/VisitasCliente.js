var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");

    const ID_CLIENTE = ObtenerCookie("IdCliente");
    if (!ID_CLIENTE) {
        $("#dvMensaje").html("No se pudo identificar el cliente.")
            .addClass("alert alert-danger").show();
        return;
    }

    $("#txtid_cliente").val(ID_CLIENTE).prop("readonly", true);
    LlenarTablaVisitas(ID_CLIENTE);
});

function LlenarTablaVisitas(ID_CLIENTE) {
    let URL = BaseURL + "api/visitas/ConsultarTodos";

    $.get(URL, function (data) {
        if (!Array.isArray(data)) {
            $("#dvMensaje").html("No se pudieron cargar las visitas.")
                .addClass("alert-danger").show();
            return;
        }

        // ✅ Filtrar correctamente usando CLIENTE.ID_CLIENTE
        const visitasFiltradas = data.filter(v => v.CLIENTE?.ID_CLIENTE == ID_CLIENTE);

        const tabla = $("#tblVisitas");
        tabla.DataTable({
            data: visitasFiltradas,
            destroy: true,
            columns: [
                { data: "ID_VISITA" },
                { data: null, render: v => v.PROPIEDAD?.TITULO || "-" },
                { data: null, render: v => v.CLIENTE?.NOMBRES || "-" },
                { data: null, render: v => v.EMPLEADO?.NOMBRES || "-" },
                { data: null, render: v => v.TIPO_VISITA?.DESCRIPCION || "-" },
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
    }).fail(() => {
        $("#dvMensaje").html("Error al cargar las visitas.")
            .addClass("alert-danger").show();
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

    const url = BaseURL + "api/visitas/" + accion;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visita)
        });
        const mensaje = await res.text();
        $("#dvMensaje").html(mensaje).addClass("alert-info").show();

        const ID_CLIENTE = ObtenerCookie("IdCliente");
        LlenarTablaVisitas(ID_CLIENTE);
    } catch (error) {
        $("#dvMensaje").html("Error: " + error).addClass("alert-danger").show();
    }
}

async function Consultar() {
    const id = $("#txtid_visita").val();
    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de visita válido.")
            .addClass("alert-warning").show();
        return;
    }

    const url = BaseURL + "api/visitas/Consultar?id=" + id;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            $("#dvMensaje").html("No se encontró la visita.")
                .addClass("alert-warning").show();
            return;
        }

        const visita = await res.json();

        if (!visita || !visita.ID_VISITA) {
            $("#dvMensaje").html("No se encontró la visita.")
                .addClass("alert-warning").show();
            return;
        }

        $("#txtid_visita").val(visita.ID_VISITA);
        $("#txtid_propiedad").val(visita.PROPIEDAD?.ID_PROPIEDAD || "");
        $("#txtid_cliente").val(visita.CLIENTE?.ID_CLIENTE || "").prop("readonly", true);
        $("#txtid_empleado").val(visita.EMPLEADO?.ID_EMPLEADO || "");
        $("#txtid_tipo_visita").val(visita.TIPO_VISITA?.ID_TIPO_VISITA || "");
        $("#txtcomentarios").val(visita.COMENTARIOS || "");

        if (visita.FECHA_HORA) {
            const fecha = visita.FECHA_HORA.split("T");
            $("#txtfecha_hora").val(`${fecha[0]}T${fecha[1].substring(0, 5)}`);
        } else {
            $("#txtfecha_hora").val("");
        }

        $("#dvMensaje").html("Consulta exitosa.")
            .addClass("alert-success").show();
    } catch (error) {
        $("#dvMensaje").html("Error al consultar la visita: " + error)
            .addClass("alert-danger").show();
    }
}

async function Eliminar() {
    const id = $("#txtid_visita").val();
    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de visita válido.")
            .addClass("alert-warning").show();
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
        $("#dvMensaje").html(mensaje)
            .addClass("alert-success").show();

        const ID_CLIENTE = ObtenerCookie("IdCliente");
        LlenarTablaVisitas(ID_CLIENTE);
    } catch (error) {
        $("#dvMensaje").html("Error al eliminar la visita: " + error)
            .addClass("alert-danger").show();
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

function ObtenerCookie(nombre) {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${nombre}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
    return null;
}


class Login {
    constructor(Usuario, Clave) {
        this.Usuario = Usuario;
        this.Clave = Clave;
    }
}
