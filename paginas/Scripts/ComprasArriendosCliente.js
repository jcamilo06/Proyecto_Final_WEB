var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
});

async function Consultar() {
    let idCliente = $("#txtIdCliente").val().trim();

    const dvMensaje = $("#dvMensaje");
    const ventasBody = $("#tblVentas tbody");
    const arriendosBody = $("#tblArriendos tbody");

    // Limpiar mensajes y tablas
    dvMensaje.html("");
    ventasBody.html("");
    arriendosBody.html("");

    if (!idCliente || isNaN(idCliente)) {
        dvMensaje.html(`<div class='alert alert-warning'>Ingrese un ID válido</div>`);
        return;
    }

    try {
        await ConsultarVentas(idCliente, ventasBody);
        await ConsultarArriendos(idCliente, arriendosBody);
    } catch (error) {
        dvMensaje.html(`<div class='alert alert-danger'>${error.message}</div>`);
    }
}

async function ConsultarVentas(idCliente, contenedor) {
    let URL = BaseURL + "api/ventas/ConsultarTodos";
    const respuesta = await fetch(URL);
    if (!respuesta.ok) throw new Error("Error al consultar ventas");

    const ventas = (await respuesta.json()).filter(v => v.ID_CLIENTE == idCliente);

    if (ventas.length > 0) {
        contenedor.html(ventas.map(v => `
            <tr>
                <td>${v.ID_VENTA}</td>
                <td>${v.ID_INMUEBLE}</td>
                <td>${v.ID_CLIENTE}</td>
                <td>${v.ID_EMPLEADO}</td>
                <td>${v.FECHA_VENTA?.split('T')[0]}</td>
                <td>$${v.PRECIO_FINAL?.toLocaleString()}</td>
            </tr>
        `).join(""));
    } else {
        contenedor.html(`<tr><td colspan="6">No hay ventas para este cliente.</td></tr>`);
    }
}

async function ConsultarArriendos(idCliente, contenedor) {
    let URL = BaseURL + "api/arriendos/ConsultarTodos";
    const respuesta = await fetch(URL);
    if (!respuesta.ok) throw new Error("Error al consultar arriendos");

    const arriendos = (await respuesta.json()).filter(a => a.ID_INQUILINO == idCliente);

    if (arriendos.length > 0) {
        contenedor.html(arriendos.map(a => `
            <tr>
                <td>${a.ID_ARRIENDO}</td>
                <td>${a.ID_INMUEBLE}</td>
                <td>${a.ID_INQUILINO}</td>
                <td>${a.ID_EMPLEADO}</td>
                <td>${a.FECHA_INICIO?.split('T')[0]}</td>
                <td>${a.FECHA_FIN?.split('T')[0]}</td>
                <td>$${a.PRECIO_FINAL?.toLocaleString()}</td>
            </tr>
        `).join(""));
    } else {
        contenedor.html(`<tr><td colspan="7">No hay arriendos para este cliente.</td></tr>`);
    }
}
