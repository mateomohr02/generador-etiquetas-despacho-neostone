const { contextBridge } = require('electron');

// La UI consume la API interna vía fetch a http://127.0.0.1:PORT/api/...
// Este puente queda preparado para exponer funciones de impresión (USB)
// en la Etapa 5, cuando esa comunicación tenga que pasar por el proceso principal.
contextBridge.exposeInMainWorld('neostoneApi', {
    apiBaseUrl: 'http://127.0.0.1:3001/api'
});
