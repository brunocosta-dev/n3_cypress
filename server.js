// Importa o Express e o Path (módulo nativo do Node)
const express = require('express');
const path = require('path');
const cors = require('cors'); // Importa o CORS

// Inicializa o aplicativo Express
const app = express();
const PORT = 3000; // Define a porta para o servidor local

// --- Middlewares Essenciais ---

// 1. Habilita o CORS para todas as rotas
// Isso permite que o seu HTML (ex: albums.html) faça requisições (fetch)
// para este servidor local sem erros de política de mesma origem.
app.use(cors());

// 2. Middleware para servir arquivos estáticos
// Diz ao Express para servir todos os arquivos da pasta 'public'
// Isso fará com que 'albums.html', 'style.css', etc. fiquem acessíveis.
app.use(express.static(path.join(__dirname, 'public')));

// 3. Middleware para interpretar JSON
// Permite que o servidor entenda requisições POST/PUT que enviam JSON
app.use(express.json());

// --- Rotas da API Mock (Simulada) ---

// Rota GET /users (para a página users.html)
app.get('/api/users', (req, res) => {
    console.log('Recebida requisição GET em /api/users');
    // Retorna um JSON estático (exemplo)
    res.json([
        { id: 1, name: 'Usuário Teste 1', email: 'user1@teste.com' },
        { id: 2, name: 'Usuário Teste 2', email: 'user2@teste.com' }
    ]);
});

// Rota GET /todos (para a página todos.html)
app.get('/api/todos', (req, res) => {
    console.log('Recebida requisição GET em /api/todos');
    res.json([
        { userId: 1, id: 1, title: 'Fazer teste de UI', completed: false },
        { userId: 1, id: 2, title: 'Fazer teste de Carga', completed: true }
    ]);
});

// Rota GET /albums (para a sua página albums.html)
app.get('/api/albums', (req, res) => {
    console.log('Recebida requisição GET em /api/albums');
    res.json([
        { userId: 1, id: 1, title: 'Fotos dos Bruninhos' },
        { userId: 1, id: 2, title: 'Yan na Praia' }
    ]);
});

// Adicionando rotas POST para os formulários (exemplo)
app.post('/api/todos', (req, res) => {
    const novaTarefa = req.body;
    console.log('Recebida requisição POST em /api/todos com dados:', novaTarefa);
    // Simula a criação com sucesso, retornando os dados recebidos + um ID
    res.status(201).json({ id: Math.floor(Math.random() * 100), ...novaTarefa });
});

app.post('/api/albums', (req, res) => {
    const novoAlbum = req.body;
    console.log('Recebida requisição POST em /api/albums com dados:', novoAlbum);
    // Simula a criação com sucesso
    res.status(201).json({ id: Math.floor(Math.random() * 100), ...novoAlbum });
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor mock local rodando em http://localhost:${PORT}`);
});