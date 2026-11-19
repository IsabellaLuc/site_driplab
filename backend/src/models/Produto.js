const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
    nome: { 
        type: DataTypes.STRING(160), 
        allowNull: false 
    },
    descricao: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    preco: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    imagem: { 
        type: DataTypes.STRING(500), 
        allowNull: true 
    },
    categoria: { 
        type: DataTypes.STRING(80), 
        allowNull: false 
    },
    tamanho: { 
        type: DataTypes.ENUM('P', 'M', 'G', 'GG', 'XG'),
        allowNull: true 
    },
    cor: { 
        type: DataTypes.STRING(60), 
        allowNull: true 
    },
    estoque: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 0 
    },
    ativo: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: true 
    }
});

module.exports = Produto;
