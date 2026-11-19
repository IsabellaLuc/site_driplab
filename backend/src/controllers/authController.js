const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');


async function cadastrar(req, res) {
    try {
        const { nome, username, email, telefone, senha } = req.body;

        if (
            !nome?.trim() ||
            !username?.trim() ||
            !email?.trim() ||
            !telefone?.trim() ||
            !senha
        ) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos.'
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                mensagem: 'A senha deve ter pelo menos 8 caracteres.'
            });
        }

        const nomeNormalizado = nome.trim();
        const usernameNormalizado = username.trim().toLowerCase();
        const emailNormalizado = email.trim().toLowerCase();
        const telefoneNormalizado = telefone.trim();

        const emailExistente = await Usuario.findOne({
            where: { email: emailNormalizado }
        });

        if (emailExistente) {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        const usernameExistente = await Usuario.findOne({
            where: { username: usernameNormalizado }
        });

        if (usernameExistente) {
            return res.status(409).json({
                mensagem: 'Este nome de usuário já está em uso.'
            });
        }

        const hash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome: nomeNormalizado,
            username: usernameNormalizado,
            email: emailNormalizado,
            telefone: telefoneNormalizado,
            senha: hash,
            tipo: 'cliente'
        });

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                username: usuario.username,
                email: usuario.email,
                telefone: usuario.telefone,
                tipo: usuario.tipo
            }
        });

    } catch (erro) {
        if (erro.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                mensagem: 'Este e-mail ou nome de usuário já está cadastrado.'
            });
        }

        console.error('Erro ao cadastrar usuário:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao realizar o cadastro.'
        });
    }
}


async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Informe email e senha' });
        }

        const usuario = await Usuario.findOne({
            where: { email: String(email).trim().toLowerCase() }
        });

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        return res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                pontos: usuario.pontos,
                nivel: usuario.nivel
            }
        });
    } catch (erro) {
        return res.status(500).json({ mensagem: 'Erro ao fazer login' });
    }
}

async function minhaConta(req, res) {
    const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    return res.json(usuario);
}

module.exports = { cadastrar, login, minhaConta };
