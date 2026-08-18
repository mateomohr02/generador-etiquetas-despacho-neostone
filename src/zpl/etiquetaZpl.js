// Genera el ZPL final para la Zebra GK420t (203dpi, 9,80x5,90cm, ^BQN para el QR).
//
// IMPORTANTE: estas coordenadas y tamaños se calcularon matemáticamente a partir de las
// especificaciones dadas (mm -> dots a 203dpi) y del layout ya validado en el preview HTML,
// pero NUNCA se probaron contra la impresora física (no hay una disponible en este entorno).
// Van a necesitar un ajuste fino con la GK420t real: magnificación del QR, oscuridad y
// posiciones exactas de cada campo.

const DPI = 203;
const MM_PER_INCH = 25.4;
const DOTS_PER_MM = DPI / MM_PER_INCH;

const LABEL_WIDTH_MM = 98;
const LABEL_HEIGHT_MM = 59;
const MARGIN_MM = 4; // > 0,20cm de margen no imprimible del fabricante, ya lo cubre
const PRINT_SPEED_IPS = 5; // 12,7 cm/s == 5 in/s exacto
const DARKNESS = 1; // TODO: verificar/ajustar contra la impresora real
const QR_MAGNIFICATION = 4; // TODO: ajustar según legibilidad real del QR impreso
const QR_BOX_MM = 19;

function mm(valorMm) {
    return Math.round(valorMm * DOTS_PER_MM);
}

// ^ y ~ son caracteres de control en ZPL; los sacamos de los datos para no corromper el label.
function escaparZpl(texto) {
    return String(texto ?? '').replace(/[\^~]/g, '');
}

function generarZPL(etiqueta) {
    const anchoDots = mm(LABEL_WIDTH_MM);
    const altoDots = mm(LABEL_HEIGHT_MM);
    const margen = mm(MARGIN_MM);
    const anchoContenido = anchoDots - margen * 2;

    const cliente = escaparZpl(etiqueta.cliente);
    const poblacion = escaparZpl(etiqueta.poblacion);
    const pedido = escaparZpl(etiqueta.pedido);
    const descripcion = escaparZpl(etiqueta.descripcion);
    const id = escaparZpl(etiqueta.id);
    const contador = `${etiqueta.bulto}/${etiqueta.totalBultos}`;
    const medidas = `L  ${etiqueta.medidaLDisplay}   H  ${etiqueta.medidaHDisplay}   P  ${etiqueta.medidaPDisplay}`;

    const qrBoxDots = mm(QR_BOX_MM);
    const qrX = anchoDots - margen - qrBoxDots - mm(5);
    const qrY = altoDots - margen - qrBoxDots - mm(5);
    const anchoMedidas = qrX - margen - mm(2);

    return [
        '^XA',
        '^CI28', // UTF-8, para tildes/ñ

        `^PW${anchoDots}`,
        `^LL${altoDots}`,
        `^PR${PRINT_SPEED_IPS}`,
        `^MD${DARKNESS}`,

        // Contador de bultos (arriba a la derecha, fijo 1/1 en esta versión)
        `^FO${anchoDots - margen - mm(20)},${margen}^A0N,${mm(3.6)},${mm(3.6)}^FB${mm(20)},1,0,R^FD${contador}^FS`,

        // Cliente (arriba a la izquierda, negrita/grande)
        `^FO${margen},${margen}^A0N,${mm(4.3)},${mm(4.3)}^FB${anchoContenido - mm(20)},1,0,L^FD${cliente}^FS`,

        // Poblacion (izquierda) + ID (derecha), misma fila
        `^FO${margen},${margen + mm(7)}^A0N,${mm(3)},${mm(3)}^FD${poblacion}^FS`,
        `^FO${anchoDots - margen - mm(30)},${margen + mm(6)}^A0N,${mm(5)},${mm(5)}^FB${mm(30)},1,0,R^FDID: ${id}^FS`,

        // N. DE PEDIDO (etiqueta chica + valor grande en negrita)
        `^FO${margen},${margen + mm(13)}^A0N,${mm(3)},${mm(3)}^FDN. DE PEDIDO:^FS`,
        `^FO${margen + mm(30)},${margen + mm(12)}^A0N,${mm(5)},${mm(5)}^FD${pedido}^FS`,

        // Descripcion (hasta 3 lineas), dejando lugar a "Accesorios" a la derecha.
        // Antes eran 2 lineas y un texto largo desbordaba pisando la linea de arriba;
        // con 3 lineas y un poco menos de ancho entra completo sin superponerse.
        `^FO${margen},${margen + mm(20)}^A0N,${mm(3.3)},${mm(3.3)}^FB${anchoContenido - mm(26)},3,2,L^FD${descripcion}^FS`,

        // "Accesorios": texto fijo de plantilla, no viene de la base de datos
        `^FO${anchoDots - margen - mm(19)},${margen + mm(20)}^A0N,${mm(3)},${mm(3)}^FB${mm(19)},1,0,L^FDAccesorios^FS`,

        // Medidas L/H/P (abajo a la izquierda, negrita)
        `^FO${margen},${altoDots - margen - mm(6)}^A0N,${mm(3.3)},${mm(3.3)}^FB${anchoMedidas},1,0,L^FD${medidas}^FS`,

        // QR (abajo a la derecha), generado nativamente por la impresora, no como imagen
        `^FO${qrX},${qrY}^BQN,2,${QR_MAGNIFICATION},M`,
        `^FDQA,${etiqueta.qrContenido}^FS`,

        '^XZ'
    ].join('\n');
}

module.exports = {
    generarZPL
};
