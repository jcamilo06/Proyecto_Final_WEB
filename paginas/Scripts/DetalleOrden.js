var BaseURL = "http://inmobiliaria.runasp.net/api/DetalleOrden/";

$(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaDetalles();
});

function LlenarTablaDetalles() {
    $.get(BaseURL + "ConsultarTodas", function (data) {
        $("#tblDetalles").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_detalle" },
                { data: "id_orden" },
                { data: "descripcion" },
                { data: "cantidad" },
                { data: "precio_unitario" },
                {
                    data: "id_detalle",
                    render: function (id) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarPorId(${id})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
}

async function EjecutarComando(metodo, accion) {
    const detalle = new DetalleOrden(
        $("#txtid_detalle").val(),
        $("#txtid_orden").val(),
        $("#txtdescripcion").val(),
        $("#txtcantidad").val(),
        $("#txtprecio_unitario").val()
    );

    const url = BaseURL + accion;
    const opciones = {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detalle)
    };

    try {
        const res = await fetch(url, opciones);
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaDetalles();
    } catch (error) {
        alert("Error al ejecutar operación: " + error);
    }
}

async function Consultar() {
    const id = $("#txtid_detalle").val();
    if (!id) return alert("Por favor ingrese un ID de detalle.");

    const url = BaseURL + "ConsultarPorId?id=" + id;

    try {
        const res = await fetch(url);
        if (!res.ok) return alert("Detalle no encontrado.");

        const detalle = await res.json();
        $("#txtid_orden").val(detalle.id_orden);
        $("#txtdescripcion").val(detalle.descripcion);
        $("#txtcantidad").val(detalle.cantidad);
        $("#txtprecio_unitario").val(detalle.precio_unitario);
    } catch (error) {
        alert("Error al consultar el detalle: " + error);
    }
}

async function EliminarDesdeFormulario() {
    const id = $("#txtid_detalle").val();
    if (!id) return alert("Debe ingresar el ID del detalle a eliminar.");

    if (!confirm("¿Está seguro que desea eliminar este detalle?")) return;

    const url = BaseURL + "EliminarPorId?id=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaDetalles();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

async function EliminarPorId(id) {
    if (!confirm("¿Está seguro que desea eliminar este detalle?")) return;

    const url = BaseURL + "EliminarPorId?id=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaDetalles();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

class DetalleOrden {
    constructor(id_detalle, id_orden, descripcion, cantidad, precio_unitario) {
        this.id_detalle = parseInt(id_detalle);
        this.id_orden = parseInt(id_orden);
        this.descripcion = descripcion;
        this.cantidad = parseFloat(cantidad);
        this.precio_unitario = parseFloat(precio_unitario);
    }
}
