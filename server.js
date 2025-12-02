const express = require('express');
const path = require('path');
const cors = require('cors'); // Importante para evitar erros de CORS
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Habilita CORS

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------
// Routes for Multiple Pages
// ---------------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/users', (req, res) => res.sendFile(path.join(__dirname, 'public', 'users.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, 'public', 'menu.html')));
app.get('/posts', (req, res) => res.sendFile(path.join(__dirname, 'public', 'post.html')));
app.get('/albums', (req, res) => res.sendFile(path.join(__dirname, 'public', 'albums.html')));
app.get('/todos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'todos.html')));
app.get('/comments', (req, res) => res.sendFile(path.join(__dirname, 'public', 'comments.html')));


// ---------------------------
// Rotas de API (JSON)
// ---------------------------

// Usuários (USERS)
let users = [
  {
    id: 1,
    nome: "Este é um usuário estático",
    user: "user",
    genero: "Masculino",
    email: "user@gmail.com",
    senha: "123",
    termo: "true"
  }
];

// GET users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// POST users
app.post('/api/users', (req, res) => {
  const { nome, user, genero, email, senha, termo } = req.body;
  const novoUsuario = {
    id: users.length + 1,
    nome, user, genero, email, senha, termo
  };
  users.push(novoUsuario);
  res.json(novoUsuario);
});

// Tarefas (TODOS)
let todos = [
  {
    id: 1,
    responsavel: "Sistema",
    titulo: "Tarefa inicial",
    descricao: "Esta é uma tarefa estática",
    prazo: "2025-01-01",
    prioridade: "baixa"
  }
];

// GET todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST todos
app.post('/api/todos', (req, res) => {
  const { responsavel, titulo, descricao, prazo, prioridade } = req.body;
  const novaTarefa = {
    id: todos.length + 1,
    responsavel, titulo, descricao, prazo, prioridade
  };
  todos.push(novaTarefa);
  res.json(novaTarefa);
});


// Álbuns 

let albums = [
  { userId: 1, id: 1, title: 'Fotos dos Bruninhos' }, 
  { userId: 1, id: 2, title: 'Yan na Praia' }         
];

// GET albums
app.get('/api/albums', (req, res) => {
  console.log('GET /api/albums chamado');
  res.json(albums);
});

// POST albums
app.post('/api/albums', (req, res) => {
  console.log('POST /api/albums chamado', req.body);
  const { title } = req.body;
  const novoAlbum = {
    userId: 1, // Simulado
    id: albums.length + 1,
    title
  };
  albums.push(novoAlbum);
  res.status(201).json(novoAlbum);
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));