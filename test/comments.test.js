const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const comments = require('../src/comments');
const user = require('../src/user');
const photo = require('../src/gallery');
const post = require('../src/post');

describe("Testes de Comentários", () => {

  beforeEach(() => {
    user.resetUsers();

    user.createUser({ id: 1, name: "Yan", userName: "yanc", password: "123", email: "yan@email.com" });
    post.createPost(1, { id: 1, createdAt: "2025/01/10", category: "Tecnologia", content: "Novidades do JS" });
    post.createPost(1, { id: 2, createdAt: "2025/01/11", category: "Esportes",   content: "Resultado do jogo" });
    photo.uploadPhoto(1, { id:1, type: 'image/png', description: 'Setup gamer iluminado com teclado RGB e monitor ultrawide', createDat: new Date() } );

    user.createUser({ id: 2, name: "Marcos", userName: "marcos", password: "123", email: "marcos@email.com" });
    post.createPost(2, { id: 1, createdAt: "2025/03/12", category: "Culinaria", content: "Receita prática" });
    post.createPost(2, { id: 2, createdAt: "2025/04/01", category: "Política",  content: "Propaganda política" });
    photo.uploadPhoto(2, { id:1, type: 'image/png', description: 'Bolo de cenoura com cobertura de chocolate — receita da vovó', createDat: new Date() } );
    
  });

  describe("criarComentario()", () => {
    it("Cria comentário para postagem", () => {
      comments.criarComentario(1, 'post', 2, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      });
        const comentarioCriado = comments.procuraComentario(1, 'post', 2, 1);
        expect(comentarioCriado).to.exist;
        expect(comentarioCriado).to.have.keys(['id', 'conteudo', 'idAutor', 'dataCriacao']);
        expect(comentarioCriado.id).to.equal(1);
        expect(comentarioCriado.dataCriacao).to.be.an.instanceOf(Date);
        
        const postagem = post.searchPostID(1, 2); 
        expect(postagem.comments).to.have.lengthOf(1);
        expect(postagem.comments[0]).to.deep.include(comentarioCriado);
    });

    it("Cria comentário para foto", () => {
      comments.criarComentario(2, 'photo', 1, {
        id: 1, 
        conteudo: "Maravilhoso!", 
        idAutor: 1, 
        dataCriacao: new Date()
      });
        const comentarioCriado = comments.procuraComentario(2, 'photo', 1, 1);
        expect(comentarioCriado).to.exist;
        expect(comentarioCriado.id).to.equal(1);
        expect(comentarioCriado.dataCriacao).to.be.an.instanceOf(Date);
        
        const foto = photo.getPhotoById(2, 1); 
        expect(foto.comments).to.have.lengthOf(1);
        expect(foto.comments[0]).to.deep.include(comentarioCriado);
    });

    it("Parâmetros de destino inválidos", () => {
      (() => comments.criarComentario()).should.throw("Parâmetros de destino inválidos");               // !targetUserId
      (() => comments.criarComentario(1)).should.throw("Parâmetros de destino inválidos");              // !target
      (() => comments.criarComentario(1, "post")).should.throw("Parâmetros de destino inválidos");      // !targetId
      (() => comments.criarComentario(1, "post", -1)).should.throw("Parâmetros de destino inválidos");  // targetId <= 0
    });

    it("Usuário (alvo do comentário) não encontrado", () => {
      (() => comments.criarComentario(9999, 'post', 2, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("Usuário (alvo do comentário) não encontrado.");
    });

    it("Usuário (autor do comentário) não encontrado", () => {
      (() => comments.criarComentario(1, 'post', 2, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 9999, 
        dataCriacao: new Date()
      })).should.throw("Usuário (autor do comentário) não encontrado.");
    });

    it("Dados do comentário inválidos", () => {
      (() => comments.criarComentario(1, 'post', 2, {
        //id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("Dados do comentário inválidos");

      (() => comments.criarComentario(1, 'post', 2, {
        id: 1, 
        //conteudo: "Muito boa!", 
        idAutor: 2,
        dataCriacao: new Date()
      })).should.throw("Dados do comentário inválidos");

      (() => comments.criarComentario(1, 'post', 2, {
        id: 1,
        conteudo: "Muito boa!", 
        //idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("Dados do comentário inválidos");

      (() => comments.criarComentario(1, 'post', 2, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        //dataCriacao: new Date()
        })).should.throw("Dados do comentário inválidos");
    });

    it("Foto não encontrada", () => {
      (() => comments.criarComentario(1, 'foto', 99, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("Foto não encontrada.");
    });

    it("Postagem não encontrada", () => {
      (() => comments.criarComentario(1, 'post', 99, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("Postagem não encontrada.");
    });

    it("Usuário (autor do comentário) não encontrado", () => {
      (() => comments.criarComentario(1, 'teste', 2, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("Tipo de 'target' inválido.");
    });

    it("ID de comentário já está cadastrado neste conteúdo", () => {
      comments.criarComentario(1, 'post', 2, {
        id: 1, 
        conteudo: "Maravilhoso!", 
        idAutor: 2, 
        dataCriacao: new Date()
      });

      (() => comments.criarComentario(1, 'post', 2, {
        id: 1, 
        conteudo: "Muito boa!", 
        idAutor: 2, 
        dataCriacao: new Date()
      })).should.throw("ID de comentário já está cadastrado neste conteúdo.");
    });
  });

  describe("procuraComentario()", () => {
    it("Retorna um comentário de uma postagem", () => {
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      const lista = comments.procuraComentario(1, "post", 2, 1);
      expect(lista).to.have.keys(['id', 'conteudo', 'idAutor', 'dataCriacao']);
      expect(lista.id).to.equal(1);
    });

    it("Retorna um comentário de uma foto", () => {
      comments.criarComentario(1, 'photo', 1, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      const lista = comments.procuraComentario(1, "photo", 1, 1);
      expect(lista).to.have.keys(['id', 'conteudo', 'idAutor', 'dataCriacao']);
      expect(lista.id).to.equal(1);
    });

    it("Tipo de 'target' inválido", () => {
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      (() => comments.procuraComentario(1, "teste", 2, 1)).should.throw("Tipo de 'target' inválido.");
    });
  });

  describe("listarComentariosPorPostagem()", () => {
    it("Listar comentários de uma postagem", () => {
      comments.criarComentario(1, 'post', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'post', 1, { id: 2, conteudo: "Maravilhoso!", idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Quando foi?",  idAutor: 2, dataCriacao: new Date() });

      const listaPosts = comments.listarComentariosPorPostagem(1, 1);

      listaPosts.should.have.lengthOf(2);
      listaPosts[0].conteudo.should.include("Muito boa!");
      listaPosts[1].conteudo.should.include("Maravilhoso!");
    });

    it("Usuário (alvo do comentário) não encontrado", () => {
      comments.criarComentario(1, 'post', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });

      (() =>  comments.listarComentariosPorPostagem(99, 1)).should.throw('Usuário (alvo do comentário) não encontrado.')
    });

    it("Postagem não encontrada", () => {
      comments.criarComentario(1, 'post', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });

      (() =>  comments.listarComentariosPorPostagem(1, 99)).should.throw('Postagem não encontrada.')
    });
  });

  describe("listarComentariosPorFoto()", () => {
    it("Listar comentários de uma foto", () => {
      comments.criarComentario(1, 'photo', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'photo', 1, { id: 2, conteudo: "Maravilhoso!", idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'photo', 1, { id: 3, conteudo: "Quando foi?",  idAutor: 2, dataCriacao: new Date() });

      const listaFotos = comments.listarComentariosPorFoto(1, 1);

      listaFotos.should.have.lengthOf(3);
      listaFotos[0].conteudo.should.include("Muito boa!");
      listaFotos[1].conteudo.should.include("Maravilhoso!");
      listaFotos[2].conteudo.should.include("Quando foi?");
    });

    it("Usuário (alvo do comentário) não encontrado", () => {
      comments.criarComentario(1, 'photo', 1, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      (() =>  comments.listarComentariosPorFoto(99, 1)).should.throw('Usuário (alvo do comentário) não encontrado.')
    });

    it("Foto não encontrada", () => {
      comments.criarComentario(1, 'photo', 1, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      (() =>  comments.listarComentariosPorFoto(1, 99)).should.throw('Foto não encontrada.')
    });
  });

  describe("deletarComentario()", () => {
    it("Exclui um comentário de uma postagem", () => {
      comments.criarComentario(1, 'post', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'post', 1, { id: 2, conteudo: "Maravilhoso!", idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Quando foi?",  idAutor: 2, dataCriacao: new Date() });
      const before = comments.listarComentariosPorPostagem(1, 1);
      assert.lengthOf(before, 2);

      comments.deletarComentario(1, 'post', 1, 2);

      const after = comments.listarComentariosPorPostagem(1, 1);
      assert.lengthOf(after, 1);
      assert.equal(after[0].id, 1);

      expect(after.map(c => c.id)).to.not.include(2);
    });

    it("Exclui um comentário de uma foto", () => {
      comments.criarComentario(1, 'photo', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });
      comments.criarComentario(1, 'photo', 1, { id: 2, conteudo: "Maravilhoso!", idAutor: 2, dataCriacao: new Date() });
      const before = comments.listarComentariosPorFoto(1, 1);
      assert.lengthOf(before, 2);

      comments.deletarComentario(1, 'photo', 1, 2);

      const after = comments.listarComentariosPorFoto(1, 1);
      assert.lengthOf(after, 1);
      assert.equal(after[0].id, 1);

      expect(after.map(c => c.id)).to.not.include(2);
    });

    it("Tipo de 'target' inválido", () => {
      comments.criarComentario(1, 'post', 2, { id: 1, conteudo: "Muito boa!", idAutor: 2, dataCriacao: new Date() });

      (() => comments.deletarComentario(1, "teste", 2, 1)).should.throw("Tipo de 'target' inválido.");
    });

    it("Comentário não encontrado", () => {
      comments.criarComentario(1, 'photo', 1, { id: 1, conteudo: "Muito boa!",   idAutor: 2, dataCriacao: new Date() });

      (() => comments.deletarComentario(1, "photo", 1, 99)).should.throw("Comentário não encontrado.");
    });
  });
});