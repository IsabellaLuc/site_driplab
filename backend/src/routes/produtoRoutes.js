const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const auth = require('../middlewares/auth');
const permitir = require('../middlewares/permitir');

router.get('/api/produtos', controller.listar);
router.get('/api/produtos/:id', controller.obter);
router.post('/api/produtos', auth, permitir('administrador'), controller.cadastrar);
router.patch('/api/produtos/:id', auth, permitir('administrador'), controller.atualizar);
router.delete('/api/produtos/:id', auth, permitir('administrador'), controller.excluir);

module.exports = router;
