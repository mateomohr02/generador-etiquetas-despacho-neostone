const express = require('express');
const pedidosRouter = require('./pedidosRouter');
const etiquetasRouter = require('./etiquetasRouter');

const router = express.Router();

router.use('/pedidos', pedidosRouter);
router.use('/etiquetas', etiquetasRouter);

module.exports = router;
