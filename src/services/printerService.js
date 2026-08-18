const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Envía el ZPL crudo a la impresora Zebra copiando el archivo en modo binario
// a la ruta de red (UNC) de la impresora compartida, sin depender de módulos
// nativos de Node ni del comando "print" (obsoleto/no confiable en Windows 11
// y no soporta bien colas de impresoras compartidas por red).
//
// La Zebra GK420t está conectada por USB a la PC "GERMAN" y compartida en red.
// PRINTER_PATH en el .env debe ser la ruta UNC de esa cola compartida, por ejemplo:
//   \\GERMAN\ZDesigner GK420t
// (visible en Windows > Impresoras y escáneres > [la impresora] > Propiedades > General).
async function imprimir(zpl) {
    const printerPath = process.env.PRINTER_PATH;
    if (!printerPath) {
        throw new Error('Falta configurar PRINTER_PATH en el .env con la ruta UNC de la impresora compartida (ej: \\\\GERMAN\\ZDesigner GK420t)');
    }

    const tempFile = path.join(os.tmpdir(), `etiqueta-${Date.now()}-${Math.random().toString(36).slice(2)}.zpl`);
    fs.writeFileSync(tempFile, zpl, 'utf8');

    return new Promise((resolve, reject) => {
        exec(`copy /b "${tempFile}" "${printerPath}"`, (error, stdout, stderr) => {
            fs.unlink(tempFile, () => {});
            if (error) {
                reject(new Error(`Error enviando a la impresora: ${stderr || error.message}`));
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    imprimir
};
