const pedidoService = require('../services/pedidoService');
const { esCodigoPedidoValido } = require('./validators');

async function buscarPedido(req, res) {
    const codigoPedido = (req.params.codigoPedido || '').trim();

    if (!esCodigoPedidoValido(codigoPedido)) {
        return res.status(400).json({ error: 'Número de pedido inválido' });
    }

    try {
        const pedido = await pedidoService.buscarPedido(codigoPedido);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        return res.json(pedido);
    } catch (error) {
        console.error('Error consultando el pedido:', error);
        return res.status(500).json({ error: 'Error consultando el pedido' });
    }
}

module.exports = {
    buscarPedido
};
