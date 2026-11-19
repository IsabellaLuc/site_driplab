async function carregarProdutos() {
    const carrossel = document.querySelector('.carrossel');
    if (!carrossel) return;

    try {
        const resposta = await fetch('/api/produtos');
        if (!resposta.ok) throw new Error('Não foi possível carregar os produtos.');

        const dados = await resposta.json();
        const produtos = dados.produtos || [];

        if (produtos.length === 0) {
            carrossel.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
            return;
        }

        carrossel.innerHTML = produtos.map(produto => `
            <div class="produto">
                <a href="../html/produto.html?id=${produto.id}" class="util">
                    <img src="${produto.imagem || '../img/produto1.png'}" alt="${produto.nome}">
                    <p>${Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <span>Ver produto</span>
                </a>
            </div>
        `).join('');
    } catch (erro) {
        console.error(erro);
        carrossel.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
    }
}

carregarProdutos();
