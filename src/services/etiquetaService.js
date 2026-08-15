const BULTO = 1;
const TOTAL_BULTOS = 1;

function formatMedida(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
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
            qrContenido: construirQrContenido(datos)
        };
    });
}

module.exports = {
    construirEtiquetasDePedido,
    construirQrContenido
};
