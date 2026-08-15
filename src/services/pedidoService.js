// ETAPA 1 (arquitectura): datos mock para validar el flujo búsqueda -> preview.
// La consulta SQL definitiva (tpedido/tpresupuesto/tpresupuestoLineas/tdespieceLineaPresupuesto/
// tClienteVarios/tpoblacion) se implementa en la Etapa 2, ya con el mapeo confirmado contra datos reales.

const MOCK_PEDIDOS = {
    'S1-00498': {
        pedido: 'S1-00498',
        cliente: 'ARQ. MEICHTRY CAROLINA',
        poblacion: 'SALTA',
        modulos: [
            {
                id: 17,
                descripcion: 'COLUMNA MARCO ALUMINIO ARMARIO IZQUIERDO H2040',
                medidaL: 600,
                medidaH: 2040,
                medidaP: 590
            },
            {
                id: 18,
                descripcion: 'AJUSTE PARA COLUMNAS',
                medidaL: 100,
                medidaH: 2040,
                medidaP: 18
            }
        ]
    }
};

async function buscarPedido(codigoPedido) {
    const pedido = MOCK_PEDIDOS[codigoPedido];
    if (!pedido) {
        return null;
    }
    return pedido;
}

module.exports = {
    buscarPedido
};
