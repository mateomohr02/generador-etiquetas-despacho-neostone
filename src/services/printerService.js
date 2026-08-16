const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Envía el ZPL crudo a la cola de impresión de Windows usando el comando "print" nativo,
// sin depender de módulos nativos de Node (evita el requisito de Visual Studio Build Tools).
//
// Requiere que la Zebra GK420t esté instalada como impresora de Windows (driver ZDesigner)
// y que PRINTER_NAME en el .env coincida EXACTO con el nombre que figura en
// "Dispositivos e impresoras". No se pudo probar contra una impresora real en este entorno.
async function imprimir(zpl) {
    const printerName = process.env.PRINTER_NAME;
    if (!printerName) {
        throw new Error('Falta configurar PRINTER_NAME en el .env con el nombre exacto de la impresora Zebra instalada en Windows');
    }

    const tempFile = path.join(os.tmpdir(), `etiqueta-${Date.now()}-${Math.random().toString(36).slice(2)}.zpl`);
    fs.writeFileSync(tempFile, zpl, 'utf8');

    return new Promise((resolve, reject) => {
        exec(`print /D:"${printerName}" "${tempFile}"`, (error, stdout, stderr) => {
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
