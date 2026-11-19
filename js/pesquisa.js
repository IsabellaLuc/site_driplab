
(() => {
    const formulario = document.querySelector('#form-pesquisa');
    const campoPesquisa = document.querySelector('#campo-pesquisa');

    if (!formulario || !campoPesquisa) {
        return;
    }

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const pesquisa = campoPesquisa.value.trim().toLowerCase();

        if (pesquisa === '') {
            return;
        }

        const produtos = document.querySelectorAll('.prod, .produto');

        produtos.forEach(function(produto) {
            const nome = produto.textContent.toLowerCase();

            if (nome.includes(pesquisa)) {
                produto.style.display = '';
            } else {
                produto.style.display = 'none';
            }
        });
    });
})();
