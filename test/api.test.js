const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const expect = chai.expect;

chai.use(chaiHttp);

// URL base do JSONPlaceholder
const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('JSONPlaceholder - Testes de API', () => {

  describe('GET', () => {
    it('/posts - Deve retornar todos os posts cadastrados', async () => {
      const res = await chai.request(BASE_URL).get('/posts');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.lengthOf(100);
    });

    it('/users - Deve retornar todos os usuários cadastrados', async () => {
      const res = await chai.request(BASE_URL).get('/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.lengthOf(10);
    });

    it('/users/1 - Valida todas as chaves obrigatórias', async () => {
      const res = await chai.request(BASE_URL).get('/users/1');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys(['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company']);
      expect(res.body.address).to.have.keys(['street', 'suite', 'city', 'zipcode', 'geo']);
      expect(res.body.company).to.have.keys(['name', 'catchPhrase', 'bs']);

      expect(res.body.id).to.be.a('number').and.to.be.not.null;
    });
    
    it('/users/10 - Valida os dados do usuário de ID 10', async () => { 
      const res = await chai.request(BASE_URL).get('/users/10');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(10).and.be.a('number');
      expect(res.body.name).to.equal('Clementina DuBuque').and.be.a('string');
    });

    it('/users/99 - Retorna "404 Not Found" para user de ID inexistente.', async () => {
      try {
        await chai.request(BASE_URL).get('/users/99');
      } 
      catch (err) {
        expect(err.response).to.have.status(404);
        expect(err.response.body).to.be.an('object');
      }
    });

    it('/users/5/albuns - Garante que todos os álbuns aninhados possuem userId 5', async () => {
      const res = await chai.request(BASE_URL).get('/users/5/albums');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);

      res.body.forEach(a => {
          expect(a.userId).to.equal(5);
      });
    });

    it('/users/1/todos - Garante que as tarefas de users/1 tem o userId igual 1', async () => {
      const res = await chai.request(BASE_URL).get('/users/1/todos');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');

      res.body.forEach(a => {
          expect(a.userId).to.equal(1);
      });

      const statusFalse = res.body.filter(a => a.completed === false);
      expect(statusFalse.length).to.be.lessThan(res.body.length);
    });
    
    it('/posts/5/comments - Garante que os comentários de posts/5 tem o postId igual 5', async () => {
      const res = await chai.request(BASE_URL).get('/posts/5/comments');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);

      res.body.forEach(a => {
          expect(a.postId).to.equal(5);
      });

      const emailUsers = res.body.map(a => a.email);
      expect(emailUsers).to.include('Sophia@arianna.co.uk');
    });

    it('/comments - Valida os comentários se os postId são números e não nulos', async() => {
      const res = await chai.request(BASE_URL).get('/comments');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.be.lengthOf(500);

      res.body.forEach(comment => {
          expect(comment).to.have.property('postId');   
          expect(comment.postId).to.be.a('number');     
          expect(comment.postId).to.not.be.null;
      });
    });

    it('/albums/1/photos - Verifica todas as url e thumbnailUrl das fotos mantém o padrão "https://"', async() => {
      const res = await chai.request(BASE_URL).get('/albums/1/photos');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');

      res.body.forEach(a => {
          expect(a.url).to.contain('https://');
          expect(a.thumbnailUrl).to.contain('https://');
      });
    });

  });

  describe('POST', () => {
    it('/posts - Verifica a geração de uma nova postagem', async () => {
      const newPost = {
        userId: 1,
        title: 'Teste de API',
        body: 'Um post criado para teste de API'
      };

      const res = await chai.request(BASE_URL).post('/posts').send(newPost);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.deep.include(newPost);
      expect(res.body.id).to.be.a('number').and.to.be.greaterThan(100);
    });

    it('/posts - Verifica a geração de uma nova postagem com userId inválido', async () => {
      const newPost = {
        userId: 99,
        title: 'Teste de API',
        body: 'Um post criado para teste de API'
      };

      const res = await chai.request(BASE_URL).post('/posts').send(newPost);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.userId).to.be.equal(newPost.userId).and.to.be.a('number');
    });

    it('/photos - Verifica a geração de uma nova foto', async () => {
      const newPhoto = {
        albumId: 1,
        title: 'Teste de API',
        url: 'https://testeApi.com',
        thumbnailUrl: 'https://linkParaTesteApi.com'
      };
  
      const res = await chai.request(BASE_URL).post('/photos').send(newPhoto);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.deep.include(newPhoto);
      expect(res.body.id).to.be.a('number').and.to.be.greaterThan(5000);
    });

    it('/todos - Cria uma nova tarefa omitindo o campo completed', async () => {
      const newTodo = {
        userId: 1,
        title: 'Teste de API'
        //completed
      };

      const res = await chai.request(BASE_URL).post('/todos').send(newTodo);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.be.a('number').and.to.be.greaterThan(200);
      expect(res.body).to.not.have.property('completed');
    });

    it('/albums - Envia um objeto vazio no corpo da requisição', async () => {
      const res = await chai.request(BASE_URL).post('/albums').send({});

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.be.not.null;
      expect(res.body.id).to.be.a('number').and.to.be.greaterThan(100);
    });

    it('/albums - Envia um objeto com string no userId e number no title', async () => {
      const newTodo = {
        userId: 'Teste',
        title: 123
      };

      const res = await chai.request(BASE_URL).post('/albums').send(newTodo);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.userId).to.be.a('string').and.to.be.equal(newTodo.userId);
      expect(res.body.title).to.be.a('number').and.to.be.equal(newTodo.title);
    });
  });

  describe('PUT', () => {
    it('/posts/1 - Valida que a resposta corresponde exatamente a atualização dos dados', async () => {
      const updatePost = {
        userId: 1,
        id: 1,
        title: "Novo Titulo",
        body: "Novo Body"
      };

      const res = await chai.request(BASE_URL).put('/posts/1').send(updatePost);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.deep.equal(updatePost);
    });

    it('/photos/1 - Verifica que o ID da URL (1) não é alterado', async () => {
      const updatePhoto = {
        id: 99
      };

      const res = await chai.request(BASE_URL).put('/photos/1').send(updatePhoto);

      expect(res).to.have.status(200);
      expect(res.body.id).to.not.equal(updatePhoto.id);
      expect(res.body.id).to.equal(1);
    });

    it('/todos/1 - Verifica se o title atualiza e mantém o ID', async () => {
      const updateTodo = {
        title: 'Teste de API'
      };

      const res = await chai.request(BASE_URL).put('/todos/1').send(updateTodo);

      expect(res).to.have.status(200);
      expect(res.body).to.have.keys(['id', 'title']);
      expect(res.body.id).to.be.a('number').and.not.to.be.undefined;
      expect(res.body.title).to.be.a('string').and.not.to.be.undefined;

      expect(res.body.userId).to.be.undefined;
      expect(res.body.completed).to.be.undefined;

    });

    it('/photos/1 - Verifica se ele atualiza os dados com com string no albumId e number no title', async () => {
      const updatePhoto = {
        albumId: 'Teste',
        title: 123
      };

      const res = await chai.request(BASE_URL).put('/photos/1').send(updatePhoto);

      expect(res).to.have.status(200);
      expect(res.body.albumId).to.be.a('string').and.to.be.equal(updatePhoto.albumId);
      expect(res.body.title).to.be.a('number').and.to.be.equal(updatePhoto.title);
    });

    it('/photos/9999 - Verifica se ocorre um erro ao atualizar uma foto inexistente', async () => {
      const updatePhoto = {
        albumId: 1,
        title: 'Teste de API'
      };

      const res = await chai.request(BASE_URL).put('/photos/9999').send(updatePhoto);
      expect([404, 500]).to.include(res.status);
      expect(res.body).to.be.an('object');
    });
  });

  describe('PATCH', () => {
    it('/todos/1 - Confirma preservação dos campos não enviados', async () => {
      const updateTodo = {
        completed: true
      };

      const res = await chai.request(BASE_URL).patch('/todos/1').send(updateTodo);

      expect(res).to.have.status(200);
      expect(res.body.completed).to.be.a('boolean').and.to.equal(true);

      expect(res.body).to.have.keys(['userId', 'id', 'title', 'completed']);
      expect(res.body.userId).to.equal(1);
      expect(res.body.id).to.equal(1);
      expect(res.body.title).to.be.a('string').and.not.to.be.empty;
    });

    it('/posts/1 - Valida que o "patch" altera indevidamente o ID do recurso', async () => {
        const updatePost = { 
            id: 9999,
            title: "Tentando Mudar o ID" 
        };

        const res = await chai.request(BASE_URL).patch('/posts/1').send(updatePost);

        expect(res).to.have.status(200);
      
        expect(res.body.id).to.not.equal(1); 
        expect(res.body.id).to.equal(9999);   // O ID foi alterado pelo PATCH

        expect(res.body.title).to.equal(updatePost.title);
    });
  });

  describe('DELETE', () => {
    it('/comments/1 - Verifica a remoção bem sucessida de comments/1', async () => {
      const res = await chai.request(BASE_URL).delete('/comments/1');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.be.empty;
    });

    it('/users/1 - Verifica a remoção bem sucessida do users/1', async () => {
      const res = await chai.request(BASE_URL).delete('/users/1');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.be.empty;
    });

    it('/users/1/posts - Verifica a remoção de todos os posts', async () => {
      try{
        await chai.request(BASE_URL).delete('/users/1/posts');
      }
      catch (err){
        expect(err.response).to.have.status(404);
      }
    });

    it('/albums/9999 - Verifica a remoção de um album inexistente', async () => {
      const res = await chai.request(BASE_URL).delete('/albums/9999');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.be.empty;
    });
  });
});