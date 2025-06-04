var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaVentas();
});

function LlenarTablaVentas() {
    let URL = BaseURL + "api/ventas/ConsultarTodos";
    $.get(URL, function (data) {
        if (Array.isArray(data)) {
            $("#tablaVentas tbody").empty();
            data.forEach(v => {
                const fila = `
                    <tr>
                        <td>${v.ID_VENTA}</td>
                        <td>${formatearFecha(v.FECHA_VENTA)}</td>
                        <td>${v.PROPIEDAD?.TITULO || '-'}</td>
                        <td>${v.CLIENTE?.NOMBRES || '-'}</td>
                        <td>${v.EMPLEADO?.NOMBRES || '-'}</td>
                        <td>$${parseFloat(v.PRECIO_FINAL).toLocaleString()}</td>
                        <td>$${parseFloat(v.COMISION).toLocaleString()}</td>
                    </tr>`;
                $("#tablaVentas tbody").append(fila);
            });

            if (!$.fn.DataTable.isDataTable("#tablaVentas")) {
                $("#tablaVentas").DataTable();
            }
        } else {
            alert("No se encontraron datos de ventas.");
        }
    }).fail(function () {
        alert("Error al cargar ventas desde el servidor.");
    });
}

async function EjecutarComando(Metodo, Funcion) {
    let URL = BaseURL + "api/ventas/" + Funcion;

    const venta = new Venta(
        parseInt($("#txtid_venta").val()) || 0,
        $("#txtfecha_venta").val(),
        parseInt($("#txtid_propiedad").val()) || 0,
        parseInt($("#txtid_cliente").val()) || 0,
        parseInt($("#txtid_empleado").val()) || 0,
        parseFloat($("#txtprecio_final").val()) || 0,
        parseFloat($("#txtcomision").val()) || 0
    );

    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, venta);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaVentas();
}

async function Consultar() {
    let id = $("#txtid_venta").val();

    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de venta válido.");
        return;
    }

    let URL = BaseURL + "api/ventas/Consultar?id=" + id;
    const venta = await ConsultarServicioAuth(URL);

    if (venta && typeof venta === 'object' && !Array.isArray(venta)) {
        $("#txtid_venta").val(venta.ID_VENTA);
        $("#txtfecha_venta").val(venta.FECHA_VENTA?.split("T")[0] || "");
        $("#txtid_propiedad").val(venta.PROPIEDAD?.ID_PROPIEDAD || "");
        $("#txtid_cliente").val(venta.CLIENTE?.ID_CLIENTE || "");
        $("#txtid_empleado").val(venta.EMPLEADO?.ID_EMPLEADO || "");
        $("#txtprecio_final").val(venta.PRECIO_FINAL);
        $("#txtcomision").val(venta.COMISION);
    } else {
        $("#dvMensaje").html(typeof venta === 'string' ? venta : "La venta no está en la base de datos");
        $("#frmVentas input").val("");
    }
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { year: "numeric", month: "2-digit", day: "2-digit" };
    return fecha.toLocaleDateString("es-CO", opciones);
}

class Venta {
    constructor(id_venta, fecha_venta, id_propiedad, id_cliente, id_empleado, precio_final, comision) {
        this.ID_VENTA = id_venta;
        this.FECHA_VENTA = fecha_venta;
        this.ID_PROPIEDAD = id_propiedad;
        this.ID_CLIENTE = id_cliente;
        this.ID_EMPLEADO = id_empleado;
        this.PRECIO_FINAL = precio_final;
        this.COMISION = comision;
    }
}
