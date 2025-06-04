var BaseURL = "http://inmobiliaria2025full.runasp.net/";

jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaPropiedades();
});

function LlenarTablaPropiedades() {
    let URL = BaseURL + "api/propiedades/ConsultarTodos";
    LlenarTablaXServiciosAuth(URL, "#tblPropiedades");
}

async function EjecutarComandoPropiedad(Metodo, Funcion) {
    let URL = BaseURL + "api/propiedades/" + Funcion;

    const propiedad = new Propiedad(
        parseInt($("#txtid_propiedad").val()) || 0,
        $("#txttitulo").val(),
        $("#txtdescripcion").val(),
        parseFloat($("#txtarea").val()) || 0,
        parseInt($("#txthabitaciones").val()) || 0,
        parseInt($("#txtbanos").val()) || 0,
        parseInt($("#txtparqueaderos").val()) || 0,
        parseInt($("#txtanio").val()) || 0,
        $("#txtdireccion").val(),
        parseInt($("#txtciudad").val()) || 0,
        parseInt($("#txtestado").val()) || 0,
        parseInt($("#txttipo").val()) || 0,
        $("#txtfecha").val(),
        parseFloat($("#txtprecio_venta").val()) || 0,
        parseFloat($("#txtprecio_arriendo").val()) || 0
    );

    const Rpta = await EjecutarComandoServicioRptaAuth(Metodo, URL, propiedad);
    if (typeof Rpta === 'string') {
        $("#dvMensaje").html(Rpta);
    }
    LlenarTablaPropiedades();
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
        $("#txtid_propiedad").val(propiedad.ID_PROPIEDAD);
        $("#txttitulo").val(propiedad.TITULO);
        $("#txtdescripcion").val(propiedad.DESCRIPCION);
        $("#txtarea").val(propiedad.AREA_M2);
        $("#txthabitaciones").val(propiedad.HABITACIONES);
        $("#txtbanos").val(propiedad.BANOS);
        $("#txtparqueaderos").val(propiedad.PARQUEADEROS);
        $("#txtanio").val(propiedad.ANIO_CONSTRUCCION);
        $("#txtdireccion").val(propiedad.DIRECCION);
        $("#txtciudad").val(propiedad.CIUDAD?.ID_CIUDAD || 0);
        $("#txtestado").val(propiedad.ESTADO?.ID_ESTADO_PROPIEDAD || 0);
        $("#txttipo").val(propiedad.TIPO?.ID_TIPO_PROPIEDAD || 0);
        $("#txtfecha").val(propiedad.FECHA_REGISTRO?.split('T')[0] || "");
        $("#txtprecio_venta").val(propiedad.PRECIO_VENTA);
        $("#txtprecio_arriendo").val(propiedad.PRECIO_ARRIENDO);

        MostrarImagenesPropiedadDesdeObjeto(propiedad);
    } else {
        $("#dvMensaje").html(typeof propiedad === 'string' ? propiedad : "La propiedad no está en la base de datos");
        $("#frmPropiedades input").val("");
    }
}

async function SubirImagenes() {
    let idPropiedad = $("#txtid_propiedad").val();
    let archivos = $("#inputImagenes")[0].files;

    if (!idPropiedad || archivos.length === 0) {
        alert("Seleccione una propiedad y al menos una imagen.");
        return;
    }

    let formData = new FormData();
    for (let i = 0; i < archivos.length; i++) {
        formData.append("file", archivos[i]); // ✅ usa siempre 'file'
    }

    let url = BaseURL + "api/UploadFiles/Subir?Datos=" + encodeURIComponent(idPropiedad) + "&Proceso=IMAGEN";
    const token = localStorage.getItem("token");

    try {
        let response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer " + token
                // NO pongas Content-Type
            }
        });

        if (!response.ok) throw new Error(await response.text());

        let result = await response.text();
        alert("Imágenes subidas: " + result);

        ConsultarPropiedad();
    } catch (error) {
        alert("Error al subir imágenes: " + error.message);
        console.error(error);
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
                    <div class="card">
                        <img src="${BaseURL}api/UploadFiles/Consultar?NombreImagen=${img.NOMBRE}" class="card-img-top" style="height: 200px; object-fit: cover;">
                        <div class="card-body p-2 text-center">
                            <button class="btn btn-danger btn-sm" onclick="EliminarImagen('${img.NOMBRE}', ${propiedad.ID_PROPIEDAD})">Eliminar</button>
                        </div>
                    </div>
                </div>`;
            galeria.append(tarjeta);
        });
    } else {
        galeria.append('<div class="col-12 text-center text-muted">No hay imágenes para esta propiedad.</div>');
    }
}

async function EliminarImagen(nombreImagen, idPropiedad) {
    if (!confirm("¿Está seguro de eliminar esta imagen?")) return;

    const token = localStorage.getItem("token");
    const url = BaseURL + "api/UploadFiles/Eliminar?NombreImagen=" + nombreImagen;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (response.ok) {
        alert("Imagen eliminada.");
        ConsultarPropiedad(); // 🔁 Refresca galería al eliminar
    } else {
        alert("No se pudo eliminar la imagen.");
    }
}

class Propiedad {
    constructor(id, titulo, descripcion, area, habitaciones, banos, parqueaderos, anio, direccion, ciudad, estado, tipo, fecha, venta, arriendo) {
        this.ID_PROPIEDAD = id;
        this.TITULO = titulo;
        this.DESCRIPCION = descripcion;
        this.AREA_M2 = area;
        this.HABITACIONES = habitaciones;
        this.BANOS = banos;
        this.PARQUEADEROS = parqueaderos;
        this.ANIO_CONSTRUCCION = anio;
        this.DIRECCION = direccion;
        this.ID_CIUDAD = ciudad;
        this.ID_ESTADO_PROPIEDAD = estado;
        this.ID_TIPO_PROPIEDAD = tipo;
        this.FECHA_REGISTRO = fecha;
        this.PRECIO_VENTA = venta;
        this.PRECIO_ARRIENDO = arriendo;
    }
}
