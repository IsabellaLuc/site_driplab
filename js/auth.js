
const usuarioLogado = document.getElementById('usuario-logado');
const usuarioDeslogado = document.getElementById('usuario-deslogado');
const btnSair = document.getElementById('btn-sair');

const token = localStorage.getItem('token');

if (usuarioLogado) {
    usuarioLogado.style.display = token ? 'flex' : 'none';
}

if (usuarioDeslogado) {
    usuarioDeslogado.style.display = token ? 'none' : 'flex';
}

if (btnSair) {
    btnSair.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        window.location.href = 'index.html';
    });
}
