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
        // Rellenar los campos del formulario con la propiedad consultada
        $("#txtid").val(propiedad.ID_PROPIEDAD);
        $("#txttitulo").val(propiedad.TITULO);
        $("#txtarea").val(propiedad.AREA_M2);
        $("#txthabitaciones").val(propiedad.HABITACIONES);
        $("#txtbanos").val(propiedad.BANOS);
        $("#txtparqueaderos").val(propiedad.PARQUEADEROS);
        $("#txtciudad").val(propiedad.CIUDAD?.NOMBRE);
        $("#txtventa").val(propiedad.PRECIO_VENTA);
        $("#txtarriendo").val(propiedad.PRECIO_ARRIENDO);
        $("#txtestado").val(propiedad.ESTADO?.DESCRIPCION);
        $("#txttipo").val(propiedad.TIPO?.DESCRIPCION);

        $("#dvMensaje").html(""); // Limpiar mensaje de error

        MostrarImagenesPropiedadDesdeObjeto(propiedad);

    } else {
        $("#dvMensaje").html(typeof propiedad === 'string' ? propiedad : "La propiedad no está en la base de datos");

        // Limpiar los campos si no se encontró
        $("#txtid, #txttitulo, #txtarea, #txthabitaciones, #txtbanos, #txtparqueaderos, #txtciudad, #txtventa, #txtarriendo, #txtestado, #txttipo").val("");
    }
}

function MostrarImagenesPropiedadDesdeObjeto(propiedad) {
    let galeria = $("#galeriaImagenes");
    galeria.empty();

    const imagenes = propiedad.IMAGENES;

    if (imagenes && imagenes.length > 0) {
        imagenes.forEach(img => {
            let tarjeta = `
                <div class="col-md-3 mb-3">
                    <div class="card shadow">
                        <img src="${BaseURL}api/UploadFiles/Consultar?NombreImagen=${img.NOMBRE}" class="card-img-top" style="height: 200px; width: 200px; object-fit: cover;">
                    </div>
                </div>`;
            galeria.append(tarjeta);
        });
    } else {
        galeria.append('<div class="col-12 text-center text-muted">No hay imágenes para esta propiedad.</div>');
    }
}