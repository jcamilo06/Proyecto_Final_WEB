var BaseURL = "http://inmobiliaria.runasp.net/";

$(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaTiposVisita();
});

function LlenarTablaTiposVisita() {
    const URL = BaseURL + "api/TipoVisita/ConsultarTodos";
    $.get(URL, function (data) {
        $("#tblTipoVisita").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_tipo_visita" },
                { data: "descripcion" },
                {
                    data: "id_tipo_visita",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarTipoVisitaPorId(${data})">
                            <i class="fas fa-trash-alt"></i>
                        </button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
}

async function EjecutarComandoTipoVisita(metodo, accion) {
    const tipoVisita = {
        id_tipo_visita: parseInt($("#txtid_tipo_visita").val()),
        descripcion: $("#txtdescripcion").val()
    };

    const url = BaseURL + "api/TipoVisita/" + accion;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tipoVisita)
        });

        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaTiposVisita();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function ConsultarTipoVisita() {
    const id = $("#txtid_tipo_visita").val();
    const url = BaseURL + "api/TipoVisita/ConsultarXId?idTipoVisita=" + id;

    try {
        const res = await fetch(url);
        if (res.ok) {
            const tipo = await res.json();
            $("#txtdescripcion").val(tipo.descripcion);
        } else {
            alert("Tipo de visita no encontrado.");
        }
    } catch (error) {
        alert("Error al consultar: " + error);
    }
}

async function EliminarTipoVisitaDesdeFormulario() {
    const id = $("#txtid_tipo_visita").val();
    if (!id) {
        alert("Ingrese el ID a eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de eliminar este tipo de visita?")) return;

    const url = BaseURL + "api/TipoVisita/EliminarXId?idTipoVisita=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaTiposVisita();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

async function EliminarTipoVisitaPorId(id) {
    if (!confirm("¿Estás seguro de eliminar este tipo de visita?")) return;

    const url = BaseURL + "api/TipoVisita/EliminarXId?idTipoVisita=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaTiposVisita();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}
