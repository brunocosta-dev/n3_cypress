const chai = require('chai');
const chaiHttp = require('chai-http');
const { it } = require('mocha');
const expect = chai.expect;

chai.use(chaiHttp);

// URL base do My JSON Server
const BASE_URL = 'https://my-json-server.typicode.com/MarcosViniciusDaSilvaZacchi/n2-testes-api';

describe('My JSON Server - Testes de Integração', () => {
    describe('GET', () => {
        it('/users - Retorna todos os users cadastrados', async () => {
            const res = await chai.request(BASE_URL).get('/users');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(5);
        });

        it('/users/101 - Valida os dados do usuário de ID 101', async () => {
            const res = await chai.request(BASE_URL).get('/users/101');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(['id', 'name', 'userName', 'password', 'email']);
            expect(res.body.id).to.equal(101).and.be.a('number');
            expect(res.body.email).to.equal("alex.costa@tech.com").and.be.a('string');
        });

        it('/users/999 - Retorna status 404 para user de ID inexistente', async () => {
            try{
                await chai.request(BASE_URL).get('/users/999');
            }
            catch (err){
                expect(err.response).to.have.status(404);
            }
        });

        it('/comments - Retorna todos os comentários e valida os dados de "targetType"', async () => {
            const res = await chai.request(BASE_URL).get('/comments');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(5);

            const targetTypes = res.body.map(a => a.targetType);
            targetTypes.forEach(type => {
                expect(type).to.be.oneOf(['post', 'photo']);
            });
        });

        it('/photos - Retorna todas as fotos e valida os dados de "type"', async () => {
            const res = await chai.request(BASE_URL).get('/photos');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(5);

            const imageType = res.body.map(a => a.type);
            imageType.forEach(type => {
                expect(type).to.contain('image/');
            });
        });
    });
    describe('POST', () => {
        it('/users - Verifica a geração de um novo usuário', async () => {
            const newUser = {
                name: "TesteName",
                userName: "testeUserName",
                password: "teste123",
                email: "teste@tech.com"
            }; 
            const res = await chai.request(BASE_URL).post('/users').send(newUser);

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body.id).to.equal(106);
        });

        it('/posts - Verifica a geração de uma nova postagem com idUser inválido', async () => {
            const newPost = {
                idUser: 999,
                category: "Teste",
                content: "Teste criado para validar integração.",
                createdAt: "2024-11-20"
            };
            
            const res = await chai.request(BASE_URL).post('/posts').send(newPost);
            
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            
            expect(res.body).to.include(newPost);
            expect(res.body.id).to.be.equal(306).and.to.be.a('number');
        });

        it('/photos - Cria uma nova tarefa omitindo alguns campos', async () => {
            const newPhoto = {
                //idUser: 101,
                type: "image/jpeg",
                description: "Teste criado para validar integração.",
                // createDat:
            }
            
            const res = await chai.request(BASE_URL).post('/photos').send(newPhoto);
            
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            
            expect(res.body.id).to.equal(206).and.to.be.a('number');
            expect(res.body).to.include(newPhoto);

            expect(res.body).to.not.have.property('idUser');
            expect(res.body).to.not.have.property('createDat');
        });

        it('/users - Envia um objeto vazio no corpo da requisição', async () => {
            const res = await chai.request(BASE_URL).post('/users').send({});

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('id').and.to.not.have.keys(['name', 'userName', 'password', 'email']);
            expect(res.body.id).to.be.a('number').and.to.equal(106);
        });
    });
    describe('PUT', () => {
        it('/photos/201 - Valida a atualização dos dados', async () => {
            const updatePhoto = {
                idUser: 101,
                type: "image/jpeg",
                description: "Teste criado para validar integração.",
                createDat: "2024-11-20"
            };

            const res = await chai.request(BASE_URL).put('/photos/201').send(updatePhoto);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include(updatePhoto);
            expect(res.body.id).to.equal(201);
        });

        it('/posts/999 - Retorna um erro 404 ao atualizar um post inexistente', async () => {
            const updatePost = {
                idUser: 101,
                category: "Teste",
                content: "Teste criado para validar integração.",
                createdAt: new Date()
            };

            try{
                await chai.request(BASE_URL).put('/posts/999').send(updatePost);
            }
            catch (err){
                expect(err.response).to.have.status(404);
            }
        });

        it('/users/101 - Valida se ele não altera o campo "id"', async () => {
            const updateUser = {
                id: 999,
                name: "Teste",
                userName: "teste",
                password: "teste123",
                email: "teste@tech.com"
            };

            const res = await chai.request(BASE_URL).put('/users/101').send(updateUser);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');

            expect(res.body.id).to.not.equal(updateUser.id);
            expect(res.body.id).to.equal(101);
        });
    });
    describe('PATCH', () => {
        it('/users/101 - Valida se atualiza apenas o campo "name"', async () => {
            const updateUser = {
                name: 'Teste'
            };

            const res = await chai.request(BASE_URL).patch('/users/101').send(updateUser);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.keys(['id', 'name', 'userName', 'password', 'email']);
            expect(res.body.name).to.equal(updateUser.name);
        });

        it('/comments/401 - Valida se não troca o dado de "id"', async () => {
            const updateComment = {
                id: 999,
                conteudo: "Teste criado para validar integração.",
            };

            const res = await chai.request(BASE_URL).patch('/comments/401').send(updateComment);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');

            expect(res.body.id).to.not.equal(updateComment.id);
            expect(res.body.id).to.equal(401);

            expect(res.body.conteudo).to.equal(updateComment.conteudo);
        });
    });
    describe('DELETE', () => {
        it('/posts/301  - Valida se exclui um post', async () => {
            const res = await chai.request(BASE_URL).delete('/posts/301');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.empty;
        });

        it('/posts - Retorna um erro 404 ao tentar remover todos os posts', async () => {
            try{
                await chai.request(BASE_URL).delete('/posts');
            }
            catch (err){
                expect(err.response).to.have.status(404);
            }
        });

        it('/photos/999 - Verifica a remoção de uma foto inexistente', async () => {
            try{
                await chai.request(BASE_URL).delete('/photos/999');
            }
            catch (err){
                expect(err.response).to.have.status(404);
            }
        });
    });
});