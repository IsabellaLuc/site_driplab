const formulario = document.querySelector('#form-login');

if (formulario) {
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value.trim();
        const senha = document.querySelector('#senha').value;

        try {
            const resposta = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || 'Não foi possível entrar.');
            }

            localStorage.setItem('token', dados.token);
            localStorage.setItem('usuario', JSON.stringify(dados.usuario));
            window.location.href = 'home.html';
        } catch (erro) {
            alert(erro.message === 'Failed to fetch'
                ? 'Não foi possível conectar ao servidor.'
                : erro.message);
        }
    });
}
