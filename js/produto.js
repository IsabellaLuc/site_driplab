const parametrosProduto = new URLSearchParams(window.location.search);
const idProduto = parametrosProduto.get('id');

async function carregarProduto() {
    if (!idProduto) return;

    try {
        const resposta = await fetch(`/api/produtos/${encodeURIComponent(idProduto)}`);
        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.mensagem || 'Produto não encontrado.');

        const titulo = document.querySelector('.informacoes-produto h1');
        const preco = document.querySelector('.preco span');
        const descricao = document.querySelector('.descricao');
        const imagem = document.querySelector('.imagem-principal img');

        if (titulo) titulo.textContent = dados.nome;
        if (preco) preco.textContent = Number(dados.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (descricao) descricao.textContent = dados.descricao || '';
        if (imagem && dados.imagem) imagem.src = dados.imagem;

        document.title = `DRIPLAB — ${dados.nome}`;

        const form = document.querySelector('#form-produto');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const tamanho = form.querySelector('input[name="tamanho"]:checked')?.value || dados.tamanho || null;
                const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
                const existente = carrinho.find(item => item.produto_id === dados.id && item.tamanho === tamanho);

                if (existente) existente.quantidade += 1;
                else carrinho.push({
                    produto_id: dados.id,
                    nome: dados.nome,
                    preco: Number(dados.preco),
                    imagem: dados.imagem,
                    tamanho,
                    quantidade: 1
                });

                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                alert('Produto adicionado ao carrinho!');
            });
        }
    } catch (erro) {
        console.error(erro);
        const titulo = document.querySelector('.informacoes-produto h1');
        if (titulo) titulo.textContent = erro.message;
    }
}

// Mantém a troca das miniaturas da galeria.
const imagemPrincipal = document.querySelector('.imagem-principal img');
document.querySelectorAll('.miniatura').forEach((miniatura) => {
    miniatura.addEventListener('click', () => {
        const imagem = miniatura.querySelector('img');
        if (!imagemPrincipal || !imagem) return;
        imagemPrincipal.src = imagem.src;
        imagemPrincipal.alt = imagem.alt;
        document.querySelectorAll('.miniatura').forEach(item => item.classList.remove('selecionada'));
        miniatura.classList.add('selecionada');
    });
});

carregarProduto();
