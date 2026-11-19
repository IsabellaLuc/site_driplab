
function paginaLimite(query) {
    const pagina = Math.max(1, parseInt(query.pagina, 10) || 1);
    const limite = Math.min(100, Math.max(1, parseInt(query.limite, 10) || 10));
    const offset = (pagina - 1) * limite;

    return { pagina, limite, offset };
}

module.exports = { paginaLimite };
