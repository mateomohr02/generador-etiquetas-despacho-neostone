const QRCode = require('qrcode');

// Genera una imagen QR SOLO para la previsualización en pantalla (HTML).
// La impresión final (Etapa 5) genera el QR directamente en ZPL con ^BQN,
// sin pasar por esta imagen.
async function generarQrDataUrl(contenido) {
    return QRCode.toDataURL(contenido, {
        margin: 1,
        width: 300,
        errorCorrectionLevel: 'M'
    });
}

module.exports = {
    generarQrDataUrl
};
