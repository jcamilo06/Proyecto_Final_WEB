﻿var BaseURL = "http://inmobiliaria2025full.runasp.net/";

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

function MostrarImagenesPropiedadDesdeObjeto(propiedad) {
    let galeria = $("#galeriaImagenes");
    galeria.empty();

    const imagenes = propiedad.IMAGENES;

    if (imagenes && imagenes.length > 0) {
        imagenes.forEach(img => {
            let tarjeta = `
                <div class="col-md-3 mb-3">
                    <div class="card shadow">
                        <img src="${BaseURL}api/UploadFiles/Consultar?NombreImagen=${img.NOMBRE}" class="card-img-top" style="height: 200px; object-fit: cover;">
                        <div class="card-body text-center">
                            <h6 class="card-title">${propiedad.TITULO}</h6>
                            <p class="card-text text-muted">${propiedad.DESCRIPCION}</p>
                        </div>
                    </div>
                </div>`;
            galeria.append(tarjeta);
        });
    } else {
        galeria.append('<div class="col-12 text-center text-muted">No hay imágenes para esta propiedad.</div>');
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
