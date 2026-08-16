const CODIGO_PEDIDO_REGEX = /^[A-Za-z0-9_-]{3,25}$/;

function esCodigoPedidoValido(codigoPedido) {
    return CODIGO_PEDIDO_REGEX.test(codigoPedido);
}

module.exports = {
    esCodigoPedidoValido
};
