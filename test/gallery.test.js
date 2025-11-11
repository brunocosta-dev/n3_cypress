const chai = require('chai');
const sinon = require('sinon');
const usuario = require('../src/user.js');
const gallery = require('../src/gallery.js'); 

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

// Dados de Teste 
const sampleUser = { id: 1, name: 'Tester', userName: 'tester', password: '123', email: 'tester@test.com', images: [] }; // Adicionado images: []
const sampleImageData = { id: 15, type: 'image/png', description: 'Sample Photo', createDat: "2024/10/02" }; // Data como string inicialmente

// Bloco Principal
describe('Gerenciamento da Galeria de Fotos (Integrado com User)', () => {

    // Hook principal para limpar usuários antes de cada teste
    beforeEach(() => {
        usuario.resetUsers();
        // Adiciona um usuário padrão SEMPRE para a maioria dos testes
        usuario.createUser({ ...sampleUser, images: [] }); // Garante que user 1 existe e images está vazio
    });

    // Restaurar stubs do Sinon após cada teste, se houver
    afterEach(() => {
        sinon.restore();
    });

    // 1 Testes para uploadPhoto (10 Assert) 
    describe('uploadPhoto com ASSERT', () => {
        it('ASSERT - Deve fazer upload de foto com sucesso', () => {
            const userId = 1;
            const image = { ...sampleImageData }; // Usa cópia
            const uploaded = gallery.uploadPhoto(userId, image);

            // Verifica o retorno
            assert.isObject(uploaded, 'Retorno deveria ser um objeto');
            assert.strictEqual(uploaded.id, image.id, 'ID da imagem retornada incorreto');
            assert.instanceOf(uploaded.createDat, Date, 'Data deveria ser convertida para Date');

            // Verifica se foi adicionado ao usuário
            const user = usuario.getUserById(userId);
            assert.isArray(user.images, 'User.images deveria ser um array');
            assert.lengthOf(user.images, 1, 'User.images deveria conter 1 foto');
            assert.deepInclude(user.images[0], { id: image.id, description: image.description }, 'Dados da foto no array do usuário incorretos');
        });

        it('ASSERT - Deve lançar erro se usuário não for encontrado', () => {
            assert.throws(() => gallery.uploadPhoto(999, sampleImageData), "Usuario não encontrado");
        });

        it('ASSERT - Deve lançar erro para tipo de imagem inválido (não PNG)', () => {
            const invalidImage = { ...sampleImageData, type: 'image/jpeg' };
            assert.throws(() => gallery.uploadPhoto(sampleUser.id, invalidImage), 'Tipo de imagem não suportado');
        });

        it('ASSERT - Deve lançar erro para descrição em branco', () => {
            const invalidImage = { ...sampleImageData, description: '   ' };
            assert.throws(() => gallery.uploadPhoto(sampleUser.id, invalidImage), 'Descrição da imagem não pode ser em branco');
        });

        it('ASSERT - Deve lançar erro para data inválida (string incorreta)', () => {
            const invalidImage = { ...sampleImageData, createDat: 'data-invalida' };
            assert.throws(() => gallery.uploadPhoto(sampleUser.id, invalidImage), 'Data Inválida');
        });

        it('ASSERT - Deve lançar erro para ID de imagem duplicado NO MESMO USUÁRIO', () => {
            gallery.uploadPhoto(sampleUser.id, { ...sampleImageData }); // Adiciona a primeira vez
            assert.throws(() => gallery.uploadPhoto(sampleUser.id, { ...sampleImageData }), 'Já existe uma imagem com esse id para este usuário');
        });

        it('ASSERT - Deve lançar erro se campo description não existir', () => {
            const { description, ...invalidImage } = { ...sampleImageData }; // Remove a descrição
            assert.throws(() => gallery.uploadPhoto(sampleUser.id, invalidImage), 'Descrição da imagem não pode ser em branco');
        });
       
        it('ASSERT - Deve lançar erro se o objeto image for nulo ou inválido', () => {
          const userId = 1;
          assert.throws(() => gallery.uploadPhoto(userId, null), 'Dados da imagem inválidos.');
          assert.throws(() => gallery.uploadPhoto(userId, 'nao sou objeto'), 'Dados da imagem inválidos.');
        });
        it('ASSERT - Deve lançar erro se o ID da imagem for inválido (nulo, não número, zero ou negativo)', () => {
          const userId = 1;
          const baseImage = { type: 'image/png', description: 'Desc', createDat: new Date() };
          assert.throws(() => gallery.uploadPhoto(userId, { ...baseImage }), 'ID da imagem inválido.');// Testa ID faltando
          assert.throws(() => gallery.uploadPhoto(userId, { ...baseImage, id: null }), 'ID da imagem inválido.'); // Testa ID nulo
          assert.throws(() => gallery.uploadPhoto(userId, { ...baseImage, id: '10' }), 'ID da imagem inválido.'); // Testa ID como string
          assert.throws(() => gallery.uploadPhoto(userId, { ...baseImage, id: 0 }), 'ID da imagem inválido.'); // Testa ID zero
          assert.throws(() => gallery.uploadPhoto(userId, { ...baseImage, id: -5 }), 'ID da imagem inválido.'); // Testa ID negativo
          });
        it('ASSERT - Deve lançar erro se createDat estiver faltando', () => {
          const userId = 1;
          const invalidImage = { id: 20, type: 'image/png', description: 'Descricao valida' }; // Falta createDat
          assert.throws(() => gallery.uploadPhoto(userId, invalidImage), 'Data Inválida');
        });
    });

    // 2 Testes para getPhotoById (5 Expect + Sinon)
    describe('getPhotoById com EXPECT e SINON', () => {
        it('EXPECT - Deve retornar undefined se o ID da imagem não for encontrado', () => {
            gallery.uploadPhoto(sampleUser.id, { ...sampleImageData, id: 10 }); // Adiciona uma foto
            const foundPhoto = gallery.getPhotoById(sampleUser.id, 999);
            expect(foundPhoto).to.be.undefined;
        });

        it('EXPECT - Deve retornar undefined se o usuário não tiver galeria (images)', () => {
            // Cria usuário sem galeria inicializada (caso raro, mas bom testar)
            usuario.resetUsers();
            usuario.createUser({ id: 5, name: 'NoGallery', userName: 'nogal', password:'1', email:'n@g.com' }); // Sem images: []
            const foundPhoto = gallery.getPhotoById(5, 10);
            expect(foundPhoto).to.be.undefined;
        });

        it('EXPECT - A foto encontrada deve ter a propriedade description', () => {
            gallery.uploadPhoto(sampleUser.id, { ...sampleImageData, id: 10 });
            const foundPhoto = gallery.getPhotoById(sampleUser.id, 10);
            expect(foundPhoto).to.have.property('description', 'Sample Photo');
        });

        // Teste usando Sinon para mockar o usuário retornado
        it('SINON - Deve encontrar a foto correta usando stub de usuário (EXPECT)', () => {
            const fakeUser = {
                id: 1, name: 'Fake', images: [
                    { id: 15, type: 'image/png', description: 'Foto Fake 1', createDat: new Date("2024/10/02") },
                    { id: 20, type: 'image/png', description: 'Foto Fake 2', createDat: new Date("2024/10/15") }
                ]
            };
            // Stub para getUserById sempre retornar nosso usuário fake
            sinon.stub(usuario, 'getUserById').returns(fakeUser);

            const result = gallery.getPhotoById(1, 20); // Busca foto 20 no usuário fake 1

            expect(result).to.not.be.undefined;
            expect(result.id).to.equal(20);
            expect(result.description).to.equal('Foto Fake 2');
        });
         it('EXPECT - Deve retornar undefined se o usuário (mockado) não for encontrado', () => {
             sinon.stub(usuario, 'getUserById').returns(undefined); // Mock retorna undefined
             const foundPhoto = gallery.getPhotoById(999, 10);
             expect(foundPhoto).to.be.undefined;
         });
    });

    // 3 Testes para getPhotosByUser (5 Should)
    describe('getPhotosByUser com SHOULD', () => {
        beforeEach(() => {
            // Adiciona múltiplas fotos para o usuário 1 e uma para o usuário 2
            usuario.createUser({ id: 2, name: 'Other', userName: 'other', password: '456', email: 'other@test.com', images: [] });
            gallery.uploadPhoto(1, { ...sampleImageData, id: 10 });
            gallery.uploadPhoto(1, { ...sampleImageData, id: 11, description: 'Outra foto' });
            gallery.uploadPhoto(2, { ...sampleImageData, id: 12, description: 'Foto do outro user' });
        });

        it('SHOULD - Deve retornar todas as fotos de um usuário específico', () => {
            const user1Photos = gallery.getPhotosByUser(1);
            user1Photos.should.be.an('array').with.lengthOf(2);
            // Verifica os IDs para garantir que são as fotos corretas
            const ids = user1Photos.map(p => p.id);
            ids.should.include.members([10, 11]);
        });

        it('SHOULD - Deve retornar um array vazio se o usuário não tiver fotos', () => {
            usuario.createUser({ id: 3, name: 'NoPhotos', userName: 'nophotos', password: '789', email: 'no@test.com' }); // User sem 'images' inicializado
            const user3Photos = gallery.getPhotosByUser(3);
            user3Photos.should.be.an('array').that.is.empty;
        });

        it('SHOULD - Deve retornar um array vazio se o usuário não existir', () => {
            const user99Photos = gallery.getPhotosByUser(99);
            user99Photos.should.be.an('array').that.is.empty;
        });

        it('SHOULD - O array retornado deve ser uma cópia (imutabilidade)', () => {
            const user1Photos = gallery.getPhotosByUser(1);
            user1Photos.push({ id: 99 }); // Modifica a cópia
            const userOriginal = usuario.getUserById(1);
            userOriginal.images.should.have.lengthOf(2); // Original não deve ser afetado
        });
        
        it('SHOULD - As fotos retornadas devem conter a propriedade id', () => {
             const user1Photos = gallery.getPhotosByUser(1);
             user1Photos[0].should.have.property('id');
        });
    });

    // 4 Testes para getPhotosByRangeDate (5 Sinon/variados) 
    describe('getPhotosByRangeDate com SINON', () => {
        let getUserStub;
        const fakeUser = {
            id: 1, name: 'Fake', userName: 'fake', /*...*/
            images: [
                { id: 1, description: 'Foto 1', createDat: new Date(2025, 9, 10) }, 
                { id: 2, description: 'Foto 2', createDat: new Date(2025, 9, 15) }, 
                { id: 3, description: 'Foto 3', createDat: new Date(2025, 9, 20) }  
            ]
        };

        beforeEach(() => {
            getUserStub = sinon.stub(usuario, 'getUserById').returns(fakeUser);
        });

        it('SINON - Deve encontrar fotos dentro do intervalo de datas (EXPECT)', () => {
            const startDate = new Date(2025, 9, 12);
            const endDate = new Date(2025, 9, 18); 
            const results = gallery.getPhotosByRangeDate(1, startDate, endDate);
            expect(results).to.have.lengthOf(1);
            expect(results[0].id).to.equal(2);
            expect(getUserStub.calledOnceWith(1)).to.be.true;
        });

        it('SINON - Deve retornar array vazio se nenhuma foto estiver no intervalo (SHOULD)', () => {
            const startDate = new Date(2025, 10, 1); // Nov 1
            const endDate = new Date(2025, 10, 5);   // Nov 5
            const results = gallery.getPhotosByRangeDate(1, startDate, endDate);
            results.should.be.an('array').that.is.empty;
        });

        it('SINON - Deve lançar erro se data de início for posterior à data final (ASSERT)', () => {
            const startDate = new Date(2025, 9, 20);
            const endDate = new Date(2025, 9, 10);
            assert.throws(() => gallery.getPhotosByRangeDate(1, startDate, endDate),
                'A data de início não pode ser posterior à data final');
        });

        it('SINON - Deve lançar erro se formato de data for inválido (EXPECT)', () => {
             expect(() => gallery.getPhotosByRangeDate(1, 'data-invalida', new Date()))
                 .to.throw('Formato de data inválido');
        });

        it('SINON - Deve retornar vazio se getUserById retornar undefined (ASSERT)', () => {
             getUserStub.returns(undefined); // Stub retorna undefined
             const results = gallery.getPhotosByRangeDate(1, new Date(2025, 9, 1), new Date(2025, 9, 30));
             assert.isEmpty(results);
        });
    });

    // 5 Testes para deletePhoto (5 Should/Assert)
    describe('deletePhoto com SHOULD e ASSERT', () => {
        beforeEach(() => {
             gallery.uploadPhoto(sampleUser.id, { ...sampleImageData, id: 10 });
             gallery.uploadPhoto(sampleUser.id, { ...sampleImageData, id: 11 });
        });

        it('SHOULD - Deve deletar uma foto com sucesso', () => {
            let user = usuario.getUserById(sampleUser.id);
            user.images.should.have.lengthOf(2);
            gallery.deletePhoto(sampleUser.id, 10);
            user = usuario.getUserById(sampleUser.id);
            user.images.should.have.lengthOf(1);
            user.images[0].id.should.equal(11); // Verifica se a foto correta sobrou
        });

        it('SHOULD - Deve lançar erro ao tentar deletar foto inexistente', () => {
            (() => gallery.deletePhoto(sampleUser.id, 999)).should.throw("Foto não encontrada na galeria do usuário");
        });

        it('ASSERT - Deve lançar erro ao tentar deletar foto de usuário inexistente', () => {
            assert.throws(() => gallery.deletePhoto(999, 10), "Usuário ou galeria não encontrados");
        });
        
        it('ASSERT - Não deve lançar erro ao deletar foto existente', () => {
             assert.doesNotThrow(() => gallery.deletePhoto(sampleUser.id, 11));
        });

        it('SHOULD - A lista deve ficar vazia após deletar a última foto', () => {
            gallery.deletePhoto(sampleUser.id, 10);
            gallery.deletePhoto(sampleUser.id, 11);
            const user = usuario.getUserById(sampleUser.id);
            user.images.should.be.an('array').that.is.empty;
        });
    });
});