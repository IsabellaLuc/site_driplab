# DRIPLAB — conexão entre frontend e backend

## 1. Configurar o banco
Dentro de `backend`, crie um arquivo `.env` copiando o modelo `.env.example`.
Preencha DB_HOST, DB_PORT, DB_NAME, DB_USER e DB_PASSWORD com os dados do seu MySQL.
Defina também JWT_SECRET com uma chave aleatória de pelo menos 24 caracteres.

## 2. Instalar dependências
Abra o terminal na pasta `backend` e execute:
```bash
npm install
```

## 3. Iniciar a API
Ainda na pasta `backend`, execute:
```bash
npm start
```
O servidor usa a porta definida em PORT (por padrão, 3000).

## 4. Abrir o site
Com o servidor ligado, abra:
`http://localhost:3000/html/index.html`

Não abra as páginas por `file://` nem use Live Server para testar a integração. Abrir pelo servidor Express evita problemas de origem/CORS.

## Rotas conectadas
- POST `/api/auth/cadastro` — cadastro
- POST `/api/auth/login` — login
- GET `/api/produtos` — lista produtos
- GET `/api/produtos/:id` — detalhes de produto
- POST `/api/pedidos` — criar pedido autenticado
- GET `/api/pedidos/meus` — consultar pedidos do usuário autenticado

## Observações
- Cadastros exigem nome, username, email, telefone e senha com pelo menos 8 caracteres.
- O login usa email e senha.
- A home carrega produtos cadastrados no banco. Se não houver produtos, aparecerá a mensagem de catálogo vazio.
- O carrinho desta versão é mantido no navegador (localStorage). A criação efetiva do pedido ainda precisa de uma tela/formulário de endereço e forma de pagamento.
- O backend deste ZIP não possui tabela/modelo Drop; as referências a esse modelo foram removidas para que as rotas de produtos e pedidos funcionem com os modelos existentes.
- O arquivo `.env` original não foi incluído no ZIP por conter credenciais. Crie seu próprio `.env` a partir de `.env.example`.
