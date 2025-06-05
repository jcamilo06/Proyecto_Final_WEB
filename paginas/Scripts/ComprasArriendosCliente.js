var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaComprasYArriendos();
});

function obtenerCookie(nombre) {
    const valor = document.cookie;
    const partes = valor.split(nombre + "=");
    if (partes.length === 2) return partes.pop().split(";").shift();
    return null;
}

function obtenerIdCliente() {
    return obtenerCookie("IdCliente");
}

function LlenarTablaComprasYArriendos() {
    const idCliente = obtenerIdCliente();
    if (!idCliente || idCliente === "0" || idCliente === "undefined") {
        $("#dvMensaje").html("<div class='alert alert-danger'>No se pudo obtener el ID del cliente.</div>");
        return;
    }

    $("#dvMensaje").html("");
    $("#tblVentas tbody").html("");
    $("#tblArriendos tbody").html("");

    ConsultarVentas(idCliente);
    ConsultarArriendos(idCliente);
}

async function ConsultarVentas(idCliente) {
    const url = BaseURL + "api/ventas/ConsultarTodos";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al consultar ventas");
        const ventas = await response.json();

        ventas.forEach(v => {
            if (v.CLIENTE?.ID_CLIENTE == idCliente) {
                const fila = `
                    <tr>
                        <td>${v.ID_VENTA}</td>
                        <td>${v.PROPIEDAD?.TITULO || "-"}</td>
                        <td>${formatearFecha(v.FECHA_VENTA)}</td>
                        <td>$${parseFloat(v.PRECIO_FINAL).toLocaleString()}</td>
                        <td>${v.EMPLEADO?.NOMBRES || "-"}</td>
                        
                    </tr>`;
                $("#tblVentas tbody").append(fila);
            }
        });
    } catch (error) {
        $("#dvMensaje").html(`<div class='alert alert-danger'>${error.message}</div>`);
    }
}

async function ConsultarArriendos(idCliente) {
    const url = BaseURL + "api/arriendos/ConsultarTodos";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al consultar arriendos");
        const arriendos = await response.json();

        arriendos.forEach(a => {
            if (a.ID_INQUILINO == idCliente) {
                const fila = `
                    <tr>
                        <td>${a.ID_ARRIENDO}</td>
                        <td>${a.PROPIEDAD?.TITULO || "-"}</td>
                        <td>${formatearFecha(a.FECHA_INICIO)}</td>
                        <td>${formatearFecha(a.FECHA_FIN)}</td>
                        <td>$${parseFloat(a.CANON_MENSUAL).toLocaleString()}</td>
                        <td>$${parseFloat(a.DEPOSITO).toLocaleString()}</td>
                        <td>${a.EMPLEADO?.NOMBRES || "-"}</td>                
                    </tr>`;
                $("#tblArriendos tbody").append(fila);
            }
        });
    } catch (error) {
        $("#dvMensaje").html(`<div class='alert alert-danger'>${error.message}</div>`);
    }
}

function formatearFecha(fecha) {
    if (!fecha) return "-";
    const dt = new Date(fecha);
    return dt.toLocaleDateString("es-CO", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

async function ConsultarVentaPorId() {
    let idVenta = $("#txtid_ventas").val();
    const idCliente = obtenerIdCliente();

    if (!idVenta || isNaN(idVenta)) {
        $("#dvMensajeVentas").html("Por favor ingresa un ID de venta válido.");
        return;
    }

    const URL = BaseURL + "api/ventas/Consultar?id=" + idVenta;
    const venta = await ConsultarServicioAuth(URL);

    if (!venta || typeof venta !== 'object' || Array.isArray(venta)) {
        $("#dvMensajeVentas").html("La venta no esta en la base de datos.");
        return;
    }

    if (venta.CLIENTE?.ID_CLIENTE != idCliente) {
        $("#dvMensajeVentas").html("La venta no esta en la base de datos.");
        return;
    }

    // Mostrar la información en el formulario
    $("#txtidventa").val(venta.ID_VENTA);
    $("#txtpropiedadventa").val(venta.PROPIEDAD?.TITULO || "Sin título");
    $("#txtfechaventa").val(formatearFecha(venta.FECHA_VENTA));
    $("#txtprecioventa").val(parseFloat(venta.PRECIO_FINAL).toLocaleString());
    $("#txtempleadoventa").val(venta.EMPLEADO?.NOMBRES || "No asignado");

    $("#dvMensajeVentas").html(""); // Limpiar mensajes previos
}

async function ConsultarArriendoPorId() {
    let id = $("#txtid_arriendos").val();
    const idCliente = obtenerIdCliente();

    if (!id || isNaN(id)) {
        $("#dvMensajeArriendos").html("Por favor ingresa un ID de arriendo válido.");
        return;
    }


    const url = BaseURL + "api/arriendos/Consultar?id=" + id;
    const arriendo = await ConsultarServicioAuth(url);

    // Validar que el arriendo corresponde al cliente logueado
    if (arriendo && arriendo.CLIENTE?.ID_CLIENTE == idCliente) {
        $("#txtidarriendo").val(arriendo.ID_ARRIENDO);
        $("#txtpropiedadarriendo").val(arriendo.PROPIEDAD?.TITULO);
        $("#txtfechainicioarriendo").val(formatearFecha(arriendo.FECHA_INICIO));
        $("#txtfechafinarriendo").val(formatearFecha(arriendo.FECHA_FIN));
        $("#txtcanonarriendo").val(parseFloat(arriendo.CANON_MENSUAL).toLocaleString());
        $("#txtdepositoarriendo").val(parseFloat(arriendo.DEPOSITO).toLocaleString());
        $("#txtempleadoarriendo").val(arriendo.EMPLEADO?.NOMBRES);
        $("#dvMensajeArriendos").html("");

    } else {
        $("#dvMensajeArriendos").html("El arriendo no esta en la base de datos.");
        $("#txtidarriendo, #txtpropiedadarriendo, #txtfechainicioarriendo, #txtfechafinarriendo, #txtprecioarriendo, #txtempleadoarriendo").val("");
    }
}