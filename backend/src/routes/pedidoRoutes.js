const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');
const auth = require('../middlewares/auth');
const permitir = require('../middlewares/permitir');

router.post('/api/pedidos', auth, controller.criar);
router.get('/api/pedidos/meus', auth, controller.meus);
router.get('/api/pedidos', auth, permitir('administrador'), controller.listarTodos);
router.patch('/api/pedidos/:id/status', auth, permitir('administrador'), controller.atualizarStatus);

module.exports = router;
