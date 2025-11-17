const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes for multiple pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/users', (req, res) => res.sendFile(path.join(__dirname, 'public', 'users.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, 'public', 'menu.html')));
app.get('/posts', (req, res) => res.sendFile(path.join(__dirname, 'public', 'posts.html')));
app.get('/albums', (req, res) => res.sendFile(path.join(__dirname, 'public', 'albums.html')));
app.get('/todos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'todos.html')));
app.get('/comments', (req, res) => res.sendFile(path.join(__dirname, 'public', 'comments.html')));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));