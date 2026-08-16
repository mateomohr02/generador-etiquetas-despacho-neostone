const pedidoService = require('../services/pedidoService');
const etiquetaService = require('../services/etiquetaService');
const qrPreviewService = require('../services/qrPreviewService');
const printerService = require('../services/printerService');
const etiquetaZpl = require('../zpl/etiquetaZpl');
const { esCodigoPedidoValido } = require('./validators');

async function previewEtiquetas(req, res) {
    const codigoPedido = (req.params.codigoPedido || '').trim();

    if (!esCodigoPedidoValido(codigoPedido)) {
        return res.status(400).json({ error: 'Número de pedido inválido' });
    }

    try {
        const pedido = await pedidoService.buscarPedido(codigoPedido);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const etiquetas = etiquetaService.construirEtiquetasDePedido(pedido);

        const etiquetasConQr = await Promise.all(
            etiquetas.map(async (etiqueta) => ({
                ...etiqueta,
                qrImageDataUrl: await qrPreviewService.generarQrDataUrl(etiqueta.qrContenido)
            }))
        );

        return res.json({ pedido: pedido.pedido, etiquetas: etiquetasConQr });
    } catch (error) {
        console.error('Error generando preview de etiquetas:', error);
        return res.status(500).json({ error: 'Error generando preview de etiquetas' });
    }
}

async function imprimirEtiqueta(req, res) {
    try {
        const zpl = etiquetaZpl.generarZPL(req.body);
        await printerService.imprimir(zpl);
        return res.json({ ok: true });
    } catch (error) {
        console.error('Error imprimiendo etiqueta:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    previewEtiquetas,
    imprimirEtiqueta
};
