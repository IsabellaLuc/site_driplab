function rotaNaoEncontrada(req, res) {
    res.status(404).json({ mensagem: 'Rota não encontrada' });
}

function tratarErro(err, req, res, next) {
    console.error(err);

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ mensagem: 'Já existe um registro com esses dados' });
    }

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ mensagem: 'Dados inválidos ou relacionados a um registro inexistente' });
    }

    res.status(500).json({ mensagem: 'Erro interno do servidor' });
}

module.exports = { rotaNaoEncontrada, tratarErro };
