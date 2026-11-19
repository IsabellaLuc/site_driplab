const { Op } = require('sequelize');
const { Produto } = require('../models');
const { paginaLimite, numeroPositivo } = require('../utils/validacoes');

async function listar(req, res) {
    const { pagina, limite, offset } = paginaLimite(req.query);
    const where = { ativo: true };

    if (req.query.nome) where.nome = { [Op.like]: `%${req.query.nome}%` };
    if (req.query.categoria) where.categoria = req.query.categoria;
    if (req.query.drop_id) where.drop_id = req.query.drop_id;

    const resultado = await Produto.findAndCountAll({
        where,
        limit: limite,
        offset,
        order: [['createdAt', 'DESC']]
    });

    res.json({ total: resultado.count, pagina, limite, produtos: resultado.rows });
}

async function obter(req, res) {
    const produto = await Produto.findOne({
        where: { id: req.params.id, ativo: true }
    });

    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json(produto);
}

async function cadastrar(req, res) {
    const { nome, descricao, preco, imagem, categoria, tamanho, cor, estoque } = req.body;

    if (!nome || !categoria || !numeroPositivo(preco) || !Number.isInteger(Number(estoque ?? 0)) || Number(estoque ?? 0) < 0) {
        return res.status(400).json({ mensagem: 'Informe nome, categoria, preço positivo e estoque válido' });
    }

    const produto = await Produto.create({
        nome, descricao, preco, imagem, categoria, tamanho, cor,
        estoque: Number(estoque ?? 0)
    });

    res.status(201).json({ mensagem: 'Produto cadastrado', produto });
}

async function atualizar(req, res) {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });

    const campos = ['nome', 'descricao', 'preco', 'imagem', 'categoria', 'tamanho', 'cor', 'estoque', 'ativo'];
    for (const campo of campos) {
        if (req.body[campo] !== undefined) produto[campo] = req.body[campo];
    }

    if (produto.preco <= 0 || produto.estoque < 0) {
        return res.status(400).json({ mensagem: 'Preço deve ser positivo e estoque não pode ser negativo' });
    }

    await produto.save();
    res.json({ mensagem: 'Produto atualizado', produto });
}

async function excluir(req, res) {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });

    // Exclusão lógica para preservar histórico de pedidos.
    produto.ativo = false;
    await produto.save();
    res.json({ mensagem: 'Produto desativado' });
}

module.exports = { listar, obter, cadastrar, atualizar, excluir };
