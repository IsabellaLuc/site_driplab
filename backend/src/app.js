require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
require('./models');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const { rotaNaoEncontrada, tratarErro } = require('./middlewares/erros');

const app = express();

app.use(cors());
app.use(express.json());

// Permite abrir o front pelo próprio servidor: http://localhost:3000/html/index.html
app.use(express.static(path.resolve(__dirname, '../../')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', sistema: 'DRIPLAB API' });
});

app.use(authRoutes);
app.use(usuarioRoutes);
app.use(produtoRoutes);
app.use(pedidoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErro);

const PORT = Number(process.env.PORT || 3000);

async function iniciarServidor() {
    try {
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
            throw new Error('JWT_SECRET precisa existir no .env e ter pelo menos 24 caracteres.');
        }

        await sequelize.authenticate();
        console.log('Conectado ao banco de dados MySQL.');

        await sequelize.sync();
        console.log('Modelos sincronizados com o banco de dados.');

        app.listen(PORT, () => {
            console.log(`Servidor DRIPLAB rodando na porta ${PORT}`);
        });
    } catch (erro) {
    console.error('Não foi possível iniciar o servidor:');
    console.error(erro);
    process.exit(1);
    }
}

iniciarServidor();
