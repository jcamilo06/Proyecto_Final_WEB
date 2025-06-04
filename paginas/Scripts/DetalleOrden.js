var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaDetallesOrden();
});

function LlenarTablaDetallesOrden() {
    let URL = BaseURL + "api/detalles_orden/ConsultarTodos";

    $.get(URL, function (data) {
        $("#tblDetallesOrden").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "ID_DETALLE" },
                { data: "DESCRIPCION" },
                { data: "CANTIDAD" },
                { data: "PRECIO_UNITARIO" },
                { data: "ORDEN.ID_ORDEN" }, 
                {
                    data: "ORDEN.FECHA_ORDEN",
                    render: function (d) {
                        return d ? new Date(d).toLocaleDateString() : "";
                    }
                }
            ]
        });
    });
}

async function EjecutarComandoDetalleOrden(Metodo, Funcion) {
    let URL = BaseURL + "api/detalles_orden/" + Funcion;
    const detalleOrden = {
        ID_DETALLE: parseInt($("#txtid_detalle").val()) || 0,
        DESCRIPCION: $("#txtdescripcion").val(),
        CANTIDAD: parseFloat($("#txtcantidad").val()) || 0,
        PRECIO_UNITARIO: parseFloat($("#txtprecio_unitario").val()) || 0,
        ID_ORDEN: parseInt($("#txtid_orden").val()) || 0 
    };

    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, detalleOrden);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaDetallesOrden();
}

async function ConsultarDetalleOrden() {
    let id = $("#txtid_detalle").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de detalle de orden válido.");
        return;
    }

    let URL = BaseURL + "api/detalles_orden/Consultar?id=" + id;
    const detalleOrden = await ConsultarServicioAuth(URL);

    if (detalleOrden && typeof detalleOrden === 'object' && !Array.isArray(detalleOrden)) {
        $("#txtid_detalle").val(detalleOrden.ID_DETALLE);
        $("#txtdescripcion").val(detalleOrden.DESCRIPCION);
        $("#txtcantidad").val(detalleOrden.CANTIDAD);
        $("#txtprecio_unitario").val(detalleOrden.PRECIO_UNITARIO);
        $("#txtid_orden").val(detalleOrden.ORDEN?.ID_ORDEN || ""); 
        $("#txtfecha_orden").val(detalleOrden.ORDEN?.FECHA_ORDEN?.split('T')[0] || ""); 
    } else {
        $("#dvMensaje").html(typeof detalleOrden === 'string' ? detalleOrden : "El detalle de orden no está en la base de datos");
        $("#frmDetallesOrden input").val("");
    }
}

class DetalleOrden {
    constructor(id_detalle, descripcion, cantidad, precio_unitario, id_orden) {
        this.ID_DETALLE = id_detalle;
        this.DESCRIPCION = descripcion;
        this.CANTIDAD = cantidad;
        this.PRECIO_UNITARIO = precio_unitario;
        this.ID_ORDEN = id_orden;
    }
}
