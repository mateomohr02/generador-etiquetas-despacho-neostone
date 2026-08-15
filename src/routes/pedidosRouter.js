const express = require('express');
const pedidosController = require('../controllers/pedidosController');

const router = express.Router();

router.get('/:codigoPedido', pedidosController.buscarPedido);

module.exports = router;
