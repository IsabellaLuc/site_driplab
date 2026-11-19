function permitir(...tiposPermitidos) {
    return function (req, res, next) {
        if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para realizar esta ação' });
        }

        next();
    };
}

module.exports = permitir;
