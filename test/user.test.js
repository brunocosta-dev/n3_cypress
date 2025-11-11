const sinon = require('sinon');
const chai = require('chai');
const usuario = require('../src/user.js');

const expect = chai.expect;
const assert = chai.assert;
chai.should();

let sandbox; // <<< Adicionado para o Sinon Sandbox

beforeEach(() => {
    usuario.resetUsers();
    sandbox = sinon.createSandbox(); // <<< Criar sandbox antes de cada teste
});

afterEach(() => { // <<< Adicionado para limpar o Sinon Sandbox
    sandbox.restore(); // <<< Restaurar todos os stubs/spies criados no sandbox
});


describe('createUser', () => {
    it('EXPECT - Usuário adicionado', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        const listUser = usuario.getAllUsers();
        expect(listUser).to.be.lengthOf(1);
        expect(listUser[0]).to.deep.equal({
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com',
            gallery: [],
            posts: []
        });
    });

    it('SHOULD - Dados do usuário inválidos', () => {
        // !user
        (() => usuario.createUser({})).should.throw('Dados inválidos');

        // !user.id
        (() => usuario.createUser({userName: 'Error', password: 'error123', email: 'error@gmail'})).should.throw('Dados inválidos');

        // !user.userName
        (() => usuario.createUser({id: 99, password: 'error123', email: 'error@gmail'})).should.throw('Dados inválidos');

        // !user.password
        (() => usuario.createUser({id: 99, userName: 'Error', email: 'error@gmail'})).should.throw('Dados inválidos');

        // !user.email
        (() => usuario.createUser({id: 99, userName: 'Error', password: 'error123'})).should.throw('Dados inválidos');
    });

    it('SHOULD - Email do usuário inválido', () => {
        // Sem o ' @ '

        (() => usuario.createUser({
            id: 99,
            name: 'Rodrigo',
            userName: 'Digo',
            password: 'senha987',
            email: 'digogmail.com'
        })).should.throw('Email inválido');
    });

    it('SHOULD - Dados duplicados', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        // id
        (() => usuario.createUser({
            id: 1,
            name: 'Mateus',
            userName: 'Teteu',
            password: 'senha123',
            email: 'teteu@gmail.com'
        })).should.throw('ID já está cadastrado');

        // userName
        (() => usuario.createUser({
            id: 2,
            name: 'Mateus',
            userName: 'Carlinhos',
            password: 'senha123',
            email: 'teteu@gmail.com'
        })).should.throw('Nome de usuário já está cadastrado');

        // email
        (() => usuario.createUser({
            id: 2,
            name: 'Mateus',
            userName: 'Teteu',
            password: 'senha123',
            email: 'carlos@gmail.com'
        })).should.throw('Email já está cadastrado');
    });
});

describe('LogInUser', () => {
    
    it('SHOULD - Usuário não encontrado', () => {
        (() => usuario.logInUser('Error', 'error123')).should.throw('Usuário não encontrado');
    });

    it('SHOULD - Senha inválida', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        (() => usuario.logInUser('Carlinhos', 'error123')).should.throw('Senha inválida');
    });
});

describe('getAllUsers', () => {
    it('EXPECT - Busca todos os usuários', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'Marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        const listUser = usuario.getAllUsers();
        expect(listUser).to.be.lengthOf(2);
        expect(listUser[0]).to.contain({id: 1, userName: 'Marcelinho123'});
    });

    it('ASSERT - Lista de usuários vazia', () => {
        const listUser = usuario.getAllUsers()
        assert.strictEqual(listUser.length, 0);
        assert.deepStrictEqual(listUser, []);
    });
});

describe('getUserById', () => {
    it('EXPECT - Busca o usuário pelo id', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'Marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        expect(usuario.getUserById(1)).to.contain({ id:1, 
        userName: 'Marcelinho123', email: 'marcelo@gmail.com' });
    });

    it('ASSERT - Usuário não encontrado', () => {
        assert.isUndefined(usuario.getUserById(99));
    });
});

describe('getUsersByName', () => {
    it('EXPECT - Busca os usuários pelo nome', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'Marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        usuario.createUser({
            id: 3,
            name: 'Marcelo',
            userName: 'Marcelao',
            password: '12345',
            email: 'marcelao@gmail.com'
        });

        const listUser = usuario.getUsersByName('Marcelo');
        expect(listUser).to.be.lengthOf(2);
        expect(listUser[0]).to.contain({id: 1, name: 'Marcelo'});
        expect(listUser[1]).to.contain({id: 3, name: 'Marcelo'});

        // Valida se a senha foi ocultada
        expect(listUser[0]).to.not.contain({password: 'marcelo123'}); 
    });

    it('ASSERT - Nome não encontrado', () => {
        const listUser = usuario.getUsersByName('Pablo');
        assert.lengthOf(listUser, 0)
        assert.deepStrictEqual(listUser, []);
    });

    // TESTE FOI MOVIDO PARA O BLOCO DE STUBS ABAIXO
    // it('SINON  - Busca os usuários pelo nome, usando stub', () => { ... });
});

describe('updateUser', () => {
    it('EXPECT - Atualiza usuário', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        usuario.updateUser(1, 'name', 'Carlao');

        const dataUser = usuario.getUserById(1);
        expect(dataUser).to.contain({name: 'Carlao'});
    });

    it('SHOULD - Usuário não encontrado', () => {
        (() => usuario.updateUser(99, 'name', 'Error')).should.throw('Usuário não encontrado');
    });

    it('SHOULD - Dados que não podem ser alterados', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        // id
        (() => usuario.updateUser(1, 'id', 99)).should.throw('Esses dados não podem ser alterados');

        // email
        (() => usuario.updateUser(1, 'email', 'error@gmail.com')).should.throw('Esses dados não podem ser alterados');
    });

    it('SHOULD - Campo inválido', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        (() => usuario.updateUser(1, 'banana', 'Error'))
        .should.throw('Campo inválido');
    });

    it('SHOULD - Apelido já existe', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        (() => usuario.updateUser(1, 'userName', 'CARLINHOS')).should.throw('Nome de usuário já está cadastrado');
    });

    it('ASSERT - Atualiza userName mantendo o mesmo usuário', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        usuario.updateUser(1, 'userName', 'CARLINHOS');

        const dataUser = usuario.getUserById(1);
        assert.strictEqual(dataUser.userName, 'CARLINHOS');
    });
});

describe('deleteUser', () => {
    it('EXPECT - Deleta usuário', () => {
        usuario.createUser({
            id: 1,
            name: 'Marcelo',
            userName: 'marcelinho123',
            password: 'marcelo123',
            email: 'marcelo@gmail.com'
        });

        usuario.createUser({
            id: 2,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        });

        usuario.deleteUser(1);
        expect(usuario.getAllUsers()).to.be.lengthOf(1);
        expect(usuario.getUserById(1)).to.be.undefined;
    });

    it('SHOULD - Usuário não encontrado', () => {
        (() => usuario.deleteUser(99)).should.throw('Usuário não encontrado');
    });
});

describe('reseteUsers', () => {
    it('ASSERT - Reseta lista de usuários', () => {
        const user = {
            id: 1,
            name: 'Carlos',
            userName: 'Carlinhos',
            password: '12345',
            email: 'carlos@gmail.com'
        };
        usuario.createUser(user);

        usuario.resetUsers();
        assert.strictEqual(usuario.getAllUsers().length, 0);
    });
});

// BLOCOS COM TESTES STUBADOS E MOCKADOS - Marcos 

describe('Testes com Stubs (Sinon)', () => {

    // Forçar 'find' a não encontrar usuário no login
    it('STUB 1 - logInUser: Deve lançar erro se users.find retornar undefined', () => {
        // Arrange: Substitui users.find para sempre retornar undefined
        // Como 'users' é um array interno, stubamos Array.prototype.find
        const findStub = sandbox.stub(Array.prototype, 'find').returns(undefined);
        // Act & Assert
        expect(() => usuario.logInUser('inexistente', 'senha'))
            .to.throw('Usuário não encontrado');
    });

    //Forçar 'find' a encontrar um usuário específico no login
    it('STUB 2 - logInUser: Deve ter sucesso se users.find retornar usuário correto', () => {
        const fakeUser = { id: 1, userName: 'teste', password: '123' };
        const findStub = sandbox.stub(Array.prototype, 'find').returns(fakeUser);
        const logStub = sandbox.stub(console, 'log'); // Stub para console.log

        // Act: Tenta logar (senha correta para fakeUser)
        usuario.logInUser('teste', '123');

        // Assert: Verifica se log foi chamado (implica sucesso)
        expect(logStub.calledOnce).to.be.true;
    });

    // Forçar 'findIndex' a não encontrar usuário no deleteUser
    it('STUB 3 - deleteUser: Deve lançar erro se findIndex retornar -1', () => {
        const findIndexStub = sandbox.stub(Array.prototype, 'findIndex').returns(-1);

        expect(() => usuario.deleteUser(999))
            .to.throw('Usuário não encontrado');
    });

    //Forçar 'find' a retornar um usuário existente ao tentar criar duplicado
     it('STUB 4 - createUser: Deve lançar erro de ID duplicado se find retornar usuário', () => {
         const existingUser = { id: 1, userName: 'existente', email: 'e@e.com' };
         // Stub para a primeira chamada find (verificação de ID)
         sandbox.stub(Array.prototype, 'find').onFirstCall().returns(existingUser);

         const newUser = { id: 1, name: 'Novo', userName: 'novo', password: 'pwd', email: 'n@n.com' };
         expect(() => usuario.createUser(newUser))
             .to.throw('ID já está cadastrado');
     });

    //Stub para getUsersByName
    it('STUB 5 - getUsersByName: Deve retornar dados do stub', () => {
        const fakeUser = { id: 1, name: 'Stubbed User', userName: 'stub_user', email: 's@s.com'}; // Removido password
        // Stub diretamente na função exportada
        const stub = sandbox.stub(usuario, 'getUsersByName').returns([fakeUser]);

        const result = usuario.getUsersByName('Qualquer Coisa'); // Argumento não importa

        expect(result).to.deep.equal([fakeUser]);
        expect(stub.calledOnce).to.be.true; // Verifica se o stub foi chamado
    });
});

describe('Testes com Mocks/Expectations (Sinon)', () => {

    //Verifica console.log no login
    it('MOCK 1 - logInUser: Verifica se console.log é chamado corretamente', () => {
        const user = { id: 1, userName: 'carlinhos', password: '123', name: 'Carlos', email:'c@c.com' };
        usuario.createUser(user);
        const logStub = sandbox.stub(console, 'log');

        usuario.logInUser('carlinhos', '123');

        // Expectativas sobre o stub (Mock)
        expect(logStub.calledOnce).to.be.true;
        expect(logStub.calledWith('Usuário carlinhos foi logado')).to.be.true; // Corrigido nome do user
    });

    //Verifica se users.push é chamado no createUser
    it('MOCK 2 - createUser: Verifica se users.push é chamado', () => {
        const user = { id: 1, name: 'Teste', userName: 'testUser', password: 'pwd', email: 't@t.com' };
        // Cria um Spy para observar Array.prototype.push
        const pushSpy = sandbox.spy(Array.prototype, 'push');

        usuario.createUser(user);

        // Verifica se o spy (push) foi chamado
        expect(pushSpy.calledOnce).to.be.true;
        // Verifica se foi chamado com um objeto contendo as propriedades do user
        expect(pushSpy.calledWith(sinon.match({
            id: 1,
            userName: 'testUser',
            gallery: [],
            posts: []
        }))).to.be.true;
    });

    // Verifica se findIndex é chamado com o ID correto no deleteUser
    it('MOCK 3 - deleteUser: Verifica se findIndex é chamado com a lógica de ID correta', () => {
        const user = { id: 5, name: 'Para Deletar', userName: 'del', password: 'pwd', email: 'd@d.com' };
        usuario.createUser(user);
        // Spy no findIndex para verificar como ele é chamado
        const findIndexSpy = sandbox.spy(Array.prototype, 'findIndex');

        usuario.deleteUser(5); // Deleta o usuário com ID 5

        expect(findIndexSpy.calledOnce).to.be.true;
        // Pega a função callback que foi passada para findIndex na primeira chamada
        const callback = findIndexSpy.firstCall.args[0];
        // Testa a callback com um usuário de ID 5 (deve retornar true)
        expect(callback({ id: 5 })).to.be.true;
        // Testa a callback com um usuário de ID diferente (deve retornar false)
        expect(callback({ id: 99 })).to.be.false;
    });

     // Verifica se splice é chamado após encontrar o índice no deleteUser
     it('MOCK 4 - deleteUser: Verifica se splice é chamado com o índice correto', () => {
         const user = { id: 7, name: 'Outro Para Deletar', userName: 'del7', password: 'pwd', email: 'd7@d7.com' };
         usuario.createUser(user);
         // Stub findIndex para retornar um índice válido (0)
         sandbox.stub(Array.prototype, 'findIndex').returns(0);
         // Spy para observar splice
         const spliceSpy = sandbox.spy(Array.prototype, 'splice');

         usuario.deleteUser(7); // ID não importa mais, pois findIndex está stubado

         expect(spliceSpy.calledOnce).to.be.true;
         // Verifica se splice foi chamado com o índice 0 e para remover 1 elemento
         expect(spliceSpy.calledWith(0, 1)).to.be.true;
     });

    //Verifica se users.find é chamado no updateUser para achar o user
    it('MOCK 5 - updateUser: Verifica se users.find é chamado para encontrar o usuário a ser atualizado', () => {
        const user = { id: 10, name: 'Original', userName: 'orig', password: 'pwd', email: 'o@o.com' };
        usuario.createUser(user);
        // Spy no find para observar chamadas
        const findSpy = sandbox.spy(Array.prototype, 'find');

        usuario.updateUser(10, 'name', 'Novo Nome');

        // Verifica se find foi chamado (pelo menos uma vez para achar o usuário)
        expect(findSpy.called).to.be.true;
        // Verifica se a PRIMEIRA chamada foi com a lógica de buscar ID 10
        const firstCallCallback = findSpy.firstCall.args[0];
        expect(firstCallCallback({ id: 10 })).to.be.true;
        expect(firstCallCallback({ id: 99 })).to.be.false;
    });
});