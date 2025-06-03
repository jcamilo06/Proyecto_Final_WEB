var BaseURL = "http://inmobiliaria.runasp.net/";

$(function () {
    $("#dvMenu").load("../Paginas/Menu.html");
    LlenarTablaPropiedadModelo();
});

function LlenarTablaPropiedadModelo() {
    const URL = BaseURL + "api/PropiedadModelo/ConsultarTodas";
    $.get(URL, function (data) {
        $("#tblPropiedadModelo").DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: "id_propiedad" },
                { data: "id_proyecto" },
                { data: "costo_decoracion", render: data => data?.toFixed(2) || "0.00" },
                { data: "fecha_decoracion", render: data => data ? new Date(data).toLocaleDateString() : "" },
                {
                    data: "id_propiedad",
                    render: function (data) {
                        return `<button class="btn btn-sm btn-danger" onclick="EliminarPropiedadModeloPorId(${data})">
                            <i class="fas fa-trash-alt"></i>
                        </button>`;
                    },
                    orderable: false
                }
            ]
        });
    });
}

async function EjecutarComandoPropiedadModelo(metodo, accion) {
    const modelo = {
        id_propiedad: parseInt($("#txtid_propiedad").val()),
        id_proyecto: parseInt($("#txtid_proyecto").val()),
        costo_decoracion: parseFloat($("#txtcosto_decoracion").val()) || 0,
        fecha_decoracion: $("#txtfecha_decoracion").val()
    };

    const url = BaseURL + "api/PropiedadModelo/" + accion;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modelo)
        });

        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaPropiedadModelo();
    } catch (error) {
        alert("Error al realizar la operación: " + error);
    }
}

async function ConsultarPropiedadModelo() {
    const id = $("#txtid_propiedad").val();
    const url = BaseURL + "api/PropiedadModelo/ConsultarPorId?id=" + id;

    try {
        const res = await fetch(url);
        if (res.ok) {
            const modelo = await res.json();
            $("#txtid_proyecto").val(modelo.id_proyecto);
            $("#txtcosto_decoracion").val(modelo.costo_decoracion);
            $("#txtfecha_decoracion").val(modelo.fecha_decoracion?.substring(0, 10));
        } else {
            alert("Propiedad modelo no encontrada.");
        }
    } catch (error) {
        alert("Error al consultar: " + error);
    }
}

async function EliminarPropiedadModeloDesdeFormulario() {
    const id = $("#txtid_propiedad").val();
    if (!id) {
        alert("Ingrese el ID a eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de eliminar esta propiedad modelo?")) return;

    const url = BaseURL + "api/PropiedadModelo/EliminarPorId?id=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaPropiedadModelo();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}

async function EliminarPropiedadModeloPorId(id) {
    if (!confirm("¿Estás seguro de eliminar esta propiedad modelo?")) return;

    const url = BaseURL + "api/PropiedadModelo/EliminarPorId?id=" + id;

    try {
        const res = await fetch(url, { method: "DELETE" });
        const mensaje = await res.text();
        alert(mensaje);
        LlenarTablaPropiedadModelo();
    } catch (error) {
        alert("Error al eliminar: " + error);
    }
}
