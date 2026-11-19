
document.querySelectorAll('.sacola-pg-controle').forEach(controle => {

    const botoes = controle.querySelectorAll('button');
    const numero = controle.querySelector('span');

    const botaoMais = controle.querySelector('[data-acao="aumentar"]');
    const botaoMenos = controle.querySelector('[data-acao="diminuir"]');

    let quantidade = 1;

    function atualizarQuantidade() {

        numero.textContent = quantidade;

        // Desativa o botão de menos quando chegar a 1
        botaoMenos.disabled = quantidade === 1;

    }

    botaoMais.addEventListener('click', () => {
        quantidade++;
        atualizarQuantidade();
    });

    botaoMenos.addEventListener('click', () => {

        if (quantidade > 1) {
            quantidade--;
            atualizarQuantidade();
        }

    });

    atualizarQuantidade();

});
