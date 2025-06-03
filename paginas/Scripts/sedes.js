const BaseURL = "http://inmobiliaria.runasp.net/api/Sedes/";

$(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaSedes();
});

function LlenarTablaSedes() {
    $.get(BaseURL + "ConsultarTodos", function (data) {
        $("#tblSedes").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_sede" },
                { data: "id_ciudad" },
                { data: "nombre" },
                { data: "telefono" },
                { data: "direccion" },
                
                {
                    data: "id_sede",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarSedePorId(${data})">
                            <i class="fas fa-trash-alt"></i>
                        </button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
}

async function EjecutarComandoSede(metodo, accion) {
    const sede = {
        id_sede: parseInt($("#txtid_sede").val()),
        nombre: $("#txtnombre").val(),
        id_ciudad: parseInt($("#txtid_ciudad").val()),
        direccion: $("#txtdireccion").val(),
        telefono: $("#txttelefono").val()
    };

    try {
        const res = await fetch(BaseURL + accion, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sede)
        });

        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaSedes();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function ConsultarSede() {
    const id = $("#txtid_sede").val();
    if (!id) {
        alert("Ingrese el ID para consultar.");
        return;
    }

    try {
        const res = await fetch(BaseURL + "ConsultarXId?idSede=" + id);
        if (res.ok) {
            const sede = await res.json();
            $("#txtnombre").val(sede.nombre);
            $("#txtid_ciudad").val(sede.id_ciudad);
            $("#txtdireccion").val(sede.direccion);
            $("#txttelefono").val(sede.telefono);
        } else {
            alert("Sede no encontrada.");
        }
    } catch (error) {
        alert("Error al consultar: " + error);
    }
}

async function EliminarSedeDesdeFormulario() {
    const id = $("#txtid_sede").val();
    if (!id) {
        alert("Ingrese el ID para eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de eliminar esta sede?")) return;

    try {
        const res = await fetch(BaseURL + "EliminarXId?idSede=" + id, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaSedes();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

async function EliminarSedePorId(id) {
    if (!confirm("¿Estás seguro de eliminar esta sede?")) return;

    try {
        const res = await fetch(BaseURL + "EliminarXId?idSede=" + id, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaSedes();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}
