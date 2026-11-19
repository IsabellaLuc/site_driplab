
const formulario = document.getElementById('form-cadastro');
const mensagem = document.getElementById('mensagem-cadastro');

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    mensagem.textContent = '';

    if (senha !== confirmarSenha) {
        mensagem.textContent = 'As senhas não coincidem.';
        mensagem.style.cssText = `
            display: block;
            color: #E51A22;
            font-family: Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            margin-top: 15px;
        `;
        return;
    }

    try {
        const resposta = await fetch('/api/auth/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                username,
                email,
                telefone,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Não foi possível realizar o cadastro.'
            );
        }

        mensagem.textContent = 'Cadastro realizado com sucesso!';
        mensagem.style.cssText = `
            display: block;
            color: #4ade80;
            font-family: Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            margin-top: 15px;
        `;

        formulario.reset();

    } catch (erro) {
        mensagem.textContent =
            erro.message === 'Failed to fetch'
                ? 'Não foi possível conectar ao servidor.'
                : erro.message;
                
        mensagem.style.cssText = `
            display: block;
            color: #E51A22;
            font-family: Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            margin-top: 15px;
        `;
    }
});
