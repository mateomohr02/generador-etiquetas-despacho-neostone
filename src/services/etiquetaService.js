const BULTO = 1;
const TOTAL_BULTOS = 1;

function formatMedida(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
}

// Formato solo visual para el preview (con separador de miles, ej: "2.040,00").
// El contenido del QR usa formatMedida (sin separador de miles) para no alterar
// el formato ya validado contra el ejemplo original.
function formatMedidaDisplay(valor) {
    return Number(valor).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function construirQrContenido({ pedido, id, cliente, poblacion, descripcion, medidaL, medidaH, medidaP }) {
    return [
        'NEO1',
        pedido,
        id,
        cliente,
        poblacion,
        descripcion,
        formatMedida(medidaL),
        formatMedida(medidaH),
        formatMedida(medidaP),
        BULTO,
        TOTAL_BULTOS
    ].join('|');
}

function construirEtiquetasDePedido(pedidoData) {
    return pedidoData.modulos.map((modulo) => {
        const datos = {
            pedido: pedidoData.pedido,
            id: modulo.id,
            cliente: pedidoData.cliente,
            poblacion: pedidoData.poblacion,
            descripcion: modulo.descripcion,
            medidaL: modulo.medidaL,
            medidaH: modulo.medidaH,
            medidaP: modulo.medidaP,
            bulto: BULTO,
            totalBultos: TOTAL_BULTOS
        };
        return {
            ...datos,
            medidaLDisplay: formatMedidaDisplay(modulo.medidaL),
            medidaHDisplay: formatMedidaDisplay(modulo.medidaH),
            medidaPDisplay: formatMedidaDisplay(modulo.medidaP),
            qrContenido: construirQrContenido(datos)
        };
    });
}

module.exports = {
    construirEtiquetasDePedido,
    construirQrContenido
};
