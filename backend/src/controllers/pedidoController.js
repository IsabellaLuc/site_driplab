const { sequelize } = require('sequelize');
const db = require('../config/database');
const { Pedido, ItemPedido, Produto } = require('../models');

async function criar(req, res) {
    const { itens, endereco_entrega, forma_pagamento = 'outro' } = req.body;

    if (!Array.isArray(itens) || itens.length === 0 || !endereco_entrega) {
        return res.status(400).json({ mensagem: 'Informe itens do pedido e endereço de entrega' });
    }

    if (!['pix', 'cartao', 'boleto', 'outro'].includes(forma_pagamento)) {
        return res.status(400).json({ mensagem: 'Método de pagamento inválido' });
    }

    const transaction = await db.transaction(); 

    try {
        let total = 0;
        const itensPreparados = [];

        for (const item of itens) {
            const quantidade = Number(item.quantidade);
            if (!Number.isInteger(quantidade) || quantidade < 1) {
                throw Object.assign(new Error('Quantidade de item inválida'), { status: 400 });
            }

            const produto = await Produto.findOne({
                where: { id: item.produto_id, ativo: true },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!produto) throw Object.assign(new Error(`Produto ${item.produto_id} não encontrado`), { status: 404 });
            if (produto.estoque < quantidade) {
                throw Object.assign(new Error(`Estoque insuficiente para ${produto.nome}`), { status: 400 });
            }

            const preco = Number(produto.preco);
            const subtotal = preco * quantidade;
            total += subtotal;
            itensPreparados.push({ produto, quantidade, preco, subtotal });
        }

        const pedido = await Pedido.create({
            usuario_id: req.usuario.id,
            status: 'pendente',
            total: total.toFixed(2),
            endereco_entrega,
            forma_pagamento
        }, { transaction });

        for (const item of itensPreparados) {
            await ItemPedido.create({
                pedido_id: pedido.id,
                produto_id: item.produto.id,
                quantidade: item.quantidade,
                preco_unitario: item.preco.toFixed(2),
                subtotal: item.subtotal.toFixed(2)
            }, { transaction });

            item.produto.estoque -= item.quantidade;
            await item.produto.save({ transaction });
        }

        await transaction.commit();

        const pedidoCompleto = await Pedido.findByPk(pedido.id, {
            include: [{ model: ItemPedido, include: [Produto] }]
        });
        return res.status(201).json({ mensagem: 'Pedido criado. O pagamento ainda não foi processado.', pedido: pedidoCompleto });
    } catch (erro) {
        await transaction.rollback();
        return res.status(erro.status || 500).json({
            mensagem: erro.status ? erro.message : 'Erro ao criar pedido'
        });
    }
}

async function meus(req, res) {
    const pedidos = await Pedido.findAll({
        where: { usuario_id: req.usuario.id },
        include: [{ model: ItemPedido, include: [Produto] }],
        order: [['createdAt', 'DESC']]
    });
    res.json(pedidos);
}

async function listarTodos(req, res) {
    const pedidos = await Pedido.findAll({
        include: [
            { model: ItemPedido, include: [Produto] }
        ],
        order: [['createdAt', 'DESC']]
    });
    res.json(pedidos);
}

async function atualizarStatus(req, res) {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado' });

    const statusValidos = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!statusValidos.includes(req.body.status)) {
        return res.status(400).json({ mensagem: 'Status de pedido inválido' });
    }

    if (pedido.status === 'cancelado' && req.body.status !== 'cancelado') {
        return res.status(400).json({ mensagem: 'Pedido cancelado não pode ser reaberto por esta rota' });
    }

    pedido.status = req.body.status;
    await pedido.save();
    res.json({ mensagem: 'Status atualizado', pedido });
}

module.exports = { criar, meus, listarTodos, atualizarStatus };
