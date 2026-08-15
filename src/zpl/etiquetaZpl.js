// ETAPA 5 (ZPL): implementación pendiente.
// Va a tomar los datos de una etiqueta (ya con qrContenido armado por etiquetaService)
// y devolver el string ZPL final (^BQN para el QR, tamaño 10,80x7,00cm a 203dpi, etc.),
// sin acceder a SQL ni a la impresora.

function generarZPL(etiquetaData) {
    throw new Error('etiquetaZpl.generarZPL no está implementado todavía (Etapa 5)');
}

module.exports = {
    generarZPL
};
