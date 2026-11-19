const express = require('express');
const router = express.Router();
const { cadastrar, login, minhaConta } = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/api/auth/cadastro', cadastrar);
router.post('/api/auth/login', login);
router.get('/api/auth/me', auth, minhaConta);

module.exports = router;
