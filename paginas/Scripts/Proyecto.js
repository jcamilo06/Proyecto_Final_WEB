const BaseURL = "http://inmobiliaria.runasp.net/api/Proyectos/";

$(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaProyectos();
});

function LlenarTablaProyectos() {
    $.get(BaseURL + "ConsultarTodos", function (data) {
        $("#tblProyectos").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_proyecto" },
                { data: "nombre" },
                { data: "id_ciudad" },
                { data: "direccion" },
                {
                    data: "fecha_lanzamiento",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "";
                    }
                },
                {
                    data: "fecha_entrega_estimada",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "";
                    }
                },
                { data: "desarrollador" },
                {
                    data: "id_proyecto",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarProyectoPorId(${data})">
                            <i class="fas fa-trash-alt"></i>
                        </button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
}

async function EjecutarComandoProyecto(metodo, accion) {
    const proyecto = {
        id_proyecto: parseInt($("#txtid_proyecto").val()),
        nombre: $("#txtnombre").val(),
        id_ciudad: parseInt($("#txtid_ciudad").val()),
        direccion: $("#txtdireccion").val(),
        fecha_lanzamiento: $("#txtfecha_lanzamiento").val() || null,
        fecha_entrega_estimada: $("#txtfecha_entrega_estimada").val() || null,
        desarrollador: $("#txtdesarrollador").val()
    };

    try {
        const res = await fetch(BaseURL + accion, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(proyecto)
        });

        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaProyectos();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function ConsultarProyecto() {
    const id = $("#txtid_proyecto").val();
    if (!id) {
        alert("Ingrese el ID para consultar.");
        return;
    }

    try {
        const res = await fetch(BaseURL + "ConsultarPorId?id=" + id);
        if (res.ok) {
            const proyecto = await res.json();
            $("#txtnombre").val(proyecto.nombre);
            $("#txtid_ciudad").val(proyecto.id_ciudad);
            $("#txtdireccion").val(proyecto.direccion);
            $("#txtfecha_lanzamiento").val(proyecto.fecha_lanzamiento ? proyecto.fecha_lanzamiento.split('T')[0] : "");
            $("#txtfecha_entrega_estimada").val(proyecto.fecha_entrega_estimada ? proyecto.fecha_entrega_estimada.split('T')[0] : "");
            $("#txtdesarrollador").val(proyecto.desarrollador);
        } else {
            alert("Proyecto no encontrado.");
        }
    } catch (error) {
        alert("Error al consultar: " + error);
    }
}

async function EliminarProyectoDesdeFormulario() {
    const id = $("#txtid_proyecto").val();
    if (!id) {
        alert("Ingrese el ID para eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    try {
        const res = await fetch(BaseURL + "EliminarPorId?id=" + id, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaProyectos();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

async function EliminarProyectoPorId(id) {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    try {
        const res = await fetch(BaseURL + "EliminarPorId?id=" + id, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaProyectos();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}
