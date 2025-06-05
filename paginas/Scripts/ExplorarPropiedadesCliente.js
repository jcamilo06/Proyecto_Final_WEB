var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaPropiedades();
});

function LlenarTablaPropiedades() {
    let URL = BaseURL + "api/propiedades/ConsultarTodos";
    LlenarTablaXServiciosAuth(URL, "#tblPropiedades");
}

async function ConsultarPropiedad() {
    let id = $("#txtid_propiedad").val();
    if (!id || isNaN(id)) {
        $("#dvMensaje").html("Por favor ingresa un ID de propiedad válido.");
        return;
    }

    let URL = BaseURL + "api/propiedades/Consultar?id=" + id;
    const propiedad = await ConsultarServicioAuth(URL);

    if (propiedad && typeof propiedad === 'object' && !Array.isArray(propiedad)) {
        let html = `
            <tr>
                <td>${propiedad.ID_PROPIEDAD}</td>
                <td>${propiedad.TITULO}</td>
                <td>${propiedad.AREA_M2}</td>
                <td>${propiedad.HABITACIONES}</td>
                <td>${propiedad.BANOS}</td>
                <td>${propiedad.PARQUEADEROS}</td>
                <td>${propiedad.PRECIO_VENTA}</td>
                <td>${propiedad.PRECIO_ARRIENDO}</td>
                <td>${propiedad.CIUDAD}</td>
                <td>${propiedad.ESTADO}</td>
                <td>${propiedad.TIPO}</td>
            </tr>`;
        $("#tblPropiedades tbody").html(html);
        $("#dvMensaje").html("");
    } else {
        $("#dvMensaje").html(typeof propiedad === 'string' ? propiedad : "La propiedad no está en la base de datos");
        $("#tblPropiedades tbody").html("");
    }
}
