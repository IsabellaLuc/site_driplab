const { Usuario } = require('../models');
const { paginaLimite } = require('../utils/validacoes');

async function listar(req, res) {
    const { pagina, limite, offset } = paginaLimite(req.query);
    const resultado = await Usuario.findAndCountAll({
        attributes: { exclude: ['senha'] },
        limit: limite,
        offset,
        order: [['createdAt', 'DESC']]
    });

    res.json({
        total: resultado.count,
        pagina,
        limite,
        usuarios: resultado.rows
    });
}

async function atualizar(req, res) {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const { nome, email, tipo } = req.body;
    if (nome !== undefined) usuario.nome = String(nome).trim();
    if (email !== undefined) usuario.email = String(email).trim().toLowerCase();
    // A rota é exclusiva de administrador; não aceita alteração de senha por aqui.
    if (tipo !== undefined && ['cliente', 'administrador'].includes(tipo)) usuario.tipo = tipo;

    await usuario.save();
    res.json({
        mensagem: 'Usuário atualizado',
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
    });
}

async function excluir(req, res) {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    if (Number(req.params.id) === Number(req.usuario.id)) {
        return res.status(400).json({ mensagem: 'Não é permitido excluir a própria conta por esta rota' });
    }

    await usuario.destroy();
    res.json({ mensagem: 'Usuário excluído' });
}

module.exports = { listar, atualizar, excluir };
