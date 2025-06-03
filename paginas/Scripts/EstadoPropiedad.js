var BaseURL = "http://inmobiliaria.runasp.net/";

$(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaEstados();
});

function LlenarTablaEstados() {
    const URL = BaseURL + "api/estadoPropiedades/ConsultarTodos";
    $.get(URL, function (data) {
        $("#tblEstados").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_estado_propiedad" },
                { data: "descripcion" },
                {
                    data: "id_estado_propiedad",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarEstadoPorId(${data})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
}

async function EjecutarComandoEstado(metodo, accion) {
    const estado = {
        id_estado_propiedad: parseInt($("#txtid_estado_propiedad").val()),
        descripcion: $("#txtdescripcion_estado").val()
    };

    const url = BaseURL + "api/estadoPropiedades/" + accion;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(estado)
        });

        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaEstados();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function ConsultarEstado() {
    const id = $("#txtid_estado_propiedad").val();
    if (!id) return alert("Ingrese un ID para consultar.");

    const url = BaseURL + "api/estadoPropiedades/ConsultarXId?id=" + id;

    try {
        const res = await fetch(url);
        if (res.ok) {
            const estado = await res.json();
            $("#txtdescripcion_estado").val(estado.descripcion);
        } else {
            alert("Estado de propiedad no encontrado.");
        }
    } catch (error) {
        alert("Error al consultar: " + error);
    }
}

async function EliminarEstadoDesdeFormulario() {
    const id = $("#txtid_estado_propiedad").val();
    if (!id) return alert("Ingrese el ID a eliminar.");
    if (!confirm("¿Estás seguro de eliminar este estado de propiedad?")) return;

    const url = BaseURL + "api/estadoPropiedades/EliminarXId?id=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaEstados();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

async function EliminarEstadoPorId(id) {
    if (!confirm("¿Estás seguro de eliminar este estado de propiedad?")) return;

    const url = BaseURL + "api/estadoPropiedades/EliminarXId?id=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaEstados();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}
