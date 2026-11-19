const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
    status: {
        type: DataTypes.ENUM('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendente'
    },
    total: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    endereco_entrega: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    forma_pagamento: {
        type: DataTypes.ENUM('pix', 'cartao', 'boleto', 'outro'),
        allowNull: false,
        defaultValue: 'outro'
    }
});

module.exports = Pedido;
