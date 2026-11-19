
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING(120),
        allowNull: false
    },

    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(valor) {
            this.setDataValue('username', valor.trim().toLowerCase());
        }
    },

    email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        set(valor) {
            this.setDataValue('email', valor.trim().toLowerCase());
        }
    },

    telefone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },

    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    tipo: {
        type: DataTypes.ENUM('cliente', 'administrador'),
        allowNull: false,
        defaultValue: 'cliente'
    }
});

module.exports = Usuario;

