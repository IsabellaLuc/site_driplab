const listaCarrinho = document.querySelector('.sacola-pg-listagem');
const resumoCarrinho = document.querySelector('.sacola-pg-informacoes');

function lerCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho') || '[]');
}

function salvarCarrinho(itens) {
    localStorage.setItem('carrinho', JSON.stringify(itens));
    renderizarCarrinho();
}

function renderizarCarrinho() {
    if (!listaCarrinho || !resumoCarrinho) return;
    const itens = lerCarrinho();

    listaCarrinho.querySelectorAll('.sacola-pg-item').forEach(el => el.remove());

    if (itens.length === 0) {
        listaCarrinho.insertAdjacentHTML('beforeend', '<p>Seu carrinho está vazio.</p>');
    } else {
        itens.forEach((item, indice) => {
            const artigo = document.createElement('article');
            artigo.className = 'sacola-pg-item';
            artigo.innerHTML = `
                <div class="sacola-pg-foto"><img src="${item.imagem || '../img/produto1.png'}" alt="${item.nome}"></div>
                <div class="sacola-pg-detalhes">
                    <h3>${item.nome}</h3>
                    <p>${item.tamanho ? 'Tamanho: ' + item.tamanho : ''}</p>
                    <p class="sacola-pg-valor">${Number(item.preco).toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</p>
                    <button type="button" data-remover="${indice}">Remover</button>
                </div>
                <div class="sacola-pg-controle">
                    <button type="button" data-diminuir="${indice}">−</button>
                    <span>${item.quantidade}</span>
                    <button type="button" data-aumentar="${indice}">+</button>
                </div>`;
            listaCarrinho.appendChild(artigo);
        });
    }

    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    resumoCarrinho.textContent = `Subtotal: ${total.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}`;
}

if (listaCarrinho) {
    listaCarrinho.addEventListener('click', event => {
        const itens = lerCarrinho();
        const remover = event.target.closest('[data-remover]');
        const aumentar = event.target.closest('[data-aumentar]');
        const diminuir = event.target.closest('[data-diminuir]');

        if (remover) itens.splice(Number(remover.dataset.remover), 1);
        if (aumentar) itens[Number(aumentar.dataset.aumentar)].quantidade++;
        if (diminuir) {
            const item = itens[Number(diminuir.dataset.diminuir)];
            if (item.quantidade > 1) item.quantidade--;
        }
        salvarCarrinho(itens);
    });
}

renderizarCarrinho();
