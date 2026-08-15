// ETAPA 5 (impresión): implementación pendiente.
// Va a encargarse exclusivamente de enviar el ZPL ya generado a la Zebra GK420t por USB,
// sin conocer nada de SQL, QR ni la forma de los datos del pedido.

async function imprimir(zpl) {
    throw new Error('printerService.imprimir no está implementado todavía (Etapa 5)');
}

module.exports = {
    imprimir
};
