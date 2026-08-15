const express = require('express');
const etiquetasController = require('../controllers/etiquetasController');

const router = express.Router();

router.get('/preview/:codigoPedido', etiquetasController.previewEtiquetas);
router.post('/imprimir', etiquetasController.imprimirEtiqueta);

module.exports = router;
