const chai = require('chai');
const usuario = require('../src/user.js');
const postagem = require('../src/post.js');

const expect = chai.expect;

beforeEach(() => { 
    usuario.resetUsers();
});

describe("createPost", ()=>{ 
    const userId = 1;
    beforeEach (()=> {
        const user = {
            id: userId,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com',
        };
        usuario.createUser(user);});
    it("Deve criar e associar corretamente um novo post ao ID do usuário", ()=>{
     const newPost = {
        id: 1,
        category: "Política",
        content: "Os politicos são corruptos, por isso a população passa fome.",
        createdAt: "2024/10/02"
        };
        postagem.createPost(userId, newPost);

        const postCriado = postagem.searchPostID(userId, newPost.id);
        expect(postCriado).to.exist;
        expect(postCriado).to.deep.include(newPost);
        expect(postCriado).to.deep.include({comments: []});
    });
    
    it("Deve lançar um erro caso o 'post' seja nulo ou indefinido", ()=>{
        expect(()=>{
            postagem.createPost(userId, null)
        }).to.throw("Dados inválidos");
        
        expect(()=>{
            postagem.createPost(userId, undefined)
        }).to.throw("Dados inválidos");
    });

    it("Deve lançar um erro caso o 'id' seja nulo ou indefinido", ()=>{
        const invalidIdPost = {
        // id: 1, 
        category: "Política",
        content: "Conteúdo Válido",
        createdAt: "2024/10/02"
        };

        expect(()=>{
        postagem.createPost(userId, invalidIdPost)
        }).to.throw("ID inválido");
        
        const nullIdPost = { ...invalidIdPost, id: null };
        expect(()=>{
        postagem.createPost(userId, nullIdPost)
        }).to.throw("ID inválido");
    });

    it("Deve lançar um erro caso o 'id' não for um número", ()=>{
        const invalidId = {
            id: 'Texto',
            category: "Política",
            content: "Conteúdo Válido", 
            createdAt: "2024/10/02"
        };
        expect(()=>{
            postagem.createPost(userId,invalidId)
        }).to.throw("ID inválido");
    });

    it("Deve lançar um erro caso o 'id' seja NaN", ()=>{
        const invalidId = {
            id: NaN,
            category: "Política",
            content: "Conteúdo Válido",
            createdAt: "2024/10/02"
        };
        expect(()=>{
            postagem.createPost(userId,invalidId)
        }).to.throw("ID inválido");
    });

    it("Deve lançar um erro caso o 'id' seja menor ou igual a 0", ()=>{
        const invalidId = {
            id: -1,
            category: "Política",
            content: "Conteúdo Válido",
            createdAt: "2024/10/02"
        };
        expect(()=>{
            postagem.createPost(userId,invalidId)
        }).to.throw("ID inválido");
    });

    it("Deve lançar um erro caso o 'id' já esteja cadastrado", ()=>{
        const post = {
            id: 10,
            category: "Teste",
            content: "Teste",
            createdAt: "2024/10/02"
        };
        postagem.createPost(userId,post);

        const postDuplicate = {
            id: 10,
            category: "Teste 2",
            content: "Teste 2",
            createdAt: "2024/10/02"
        };

        expect(()=>{
            postagem.createPost(userId,postDuplicate)
        }).to.throw("ID já está cadastrado");
    });

    // Teste de Conteúdo vazio
    it("Deve lançar um erro caso o campo 'content' seja vazio", ()=>{
        const invalidContentEmpty = {
            id: 2,
            category: "Política",
            content: "",
            createdAt: "2024/10/02"
        };
        expect(()=>{
            postagem.createPost(userId,invalidContentEmpty)
        }).to.throw("Conteúdo inválido");
        
        const invalidContentWhitespace = {
            id: 2,
            ategory: "Política",
            content: "   ",
            createdAt: "2024/10/02"
         };
         expect(()=>{
            postagem.createPost(userId,invalidContentWhitespace)
        }).to.throw("Conteúdo inválido");
    });

    it("Deve lançar um erro caso o campo category seja vazio", ()=>{
        const invalidCategoryEmpty = {
            id: 3,
            category: "",
            content: "Os politicos são corruptos, por isso a população passa fome.",
            createdAt: "2024/10/02"
        };
        expect(()=>{
            postagem.createPost(userId,invalidCategoryEmpty)
        }).to.throw("Categoria inválida");
        
        const invalidCategoryWhitespace = {
            id: 3,
            category: "   ",
            content: "Os politicos são corruptos, por isso a população passa fome.",
            createdAt: "2024/10/02"
        };
        expect(()=>{
            postagem.createPost(userId,invalidCategoryWhitespace)
        }).to.throw("Categoria inválida");
    });

    // Teste de Data Vazia
    it("Deve lançar um erro caso o campo 'createdAt' seja vazio", ()=>{
        const invalidDate = {
            id: 4,
            category: "Política",
            content: "Os politicos são corruptos, por isso a população passa fome.",
            createdAt: ""
        };
        expect(()=>{
            postagem.createPost(userId,invalidDate)
        }).to.throw("Data inválida");
        
        const missingDate = {
             id: 4,
             category: "Política",
             content: "Os politicos são corruptos, por isso a população passa fome."
             // createdAt
             };
             expect(()=>{
                postagem.createPost(userId,missingDate)
            }).to.throw("Data inválida");
        });

    it("Deve converter 'createdAt' de string para Date", () => {
        const date = new Date(2025, 9, 24); 

        const newPost = {
            id: 10,
            category: "Tecnologia",
            content: "Post de teste",
            createdAt: date
        };

        postagem.createPost(userId, newPost);

        const postCriado = postagem.searchPostID(userId, newPost.id);

        expect(postCriado.createdAt).to.be.an.instanceOf(Date);
        expect(postCriado.createdAt.getFullYear()).to.equal(2025);
        expect(postCriado.createdAt.getMonth()).to.equal(9);
        expect(postCriado.createdAt.getDate()).to.equal(24);
    });

    it("Deve lançar um erro caso usuário não exista", ()=>{
        const nonExistentUserId = 35;
        const validPost = {
            id: 6,
            createdAt: "2024/10/02",
            category: "Política",
            content: "Os politicos são corruptos, por isso a população passa fome."
        }
        expect(()=>{
            postagem.createPost(nonExistentUserId, validPost)
        }).to.throw("Usuário não encontrado");
    });
});

describe("removePost",()=>{
    it("Deve remover um post de um usuário específico",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;

        const post1 = {id: 1, createdAt: "2025/01/10", category: 
            "Tecnologia", content: "Novidades do JS"};
        const post2 = {id: 2, createdAt: "2025/01/11", 
            category: "Esportes", content: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        expect (postagem.searchPosts(userId)).to.have.lengthOf(2);
        postagem.removePost(userId,1);

        const postagensRestantes = postagem.searchPosts(userId);
        expect (postagem.searchPosts(userId)).to.have.lengthOf(1);

        expect(postagensRestantes[0]).to.deep.include(post1);
    });
    it("Deve lançar erro ao excluir post caso usuário não exista",()=>{
        const userId = 10;
        expect(()=>{
            postagem.removePost(userId,1);
        }).to.throw("Usuário não encontrado.");
    });
    it("Deve lançar erro caso o index seja menor do que tamanho de posts",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;
        const post1 = {id: 1,createdAt: "2025/01/10",category: 
            "Tecnologia",content: "Novidades do JS"};
        const post2 = {id: 2,createdAt: "2025/01/11",category: 
            "Esportes",content: "Resultado do jogo"};
        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);
        expect(()=>{
            postagem.removePost(userId,-1);
        }).to.throw("Usuário não encontrado.");
    })
    it("Deve lançar erro caso o index seja maior do que o tamanho de posts",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;
        const post1 = {id: 1,createdAt: "2025/01/10",category: 
            "Tecnologia",content: "Novidades do JS"};
        const post2 = {id: 2,createdAt: "2025/01/11",category: 
            "Esportes",content: "Resultado do jogo"};
        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);
        expect(()=>{
            postagem.removePost(userId,2);
        }).to.throw("Usuário não encontrado.");
    })
});

describe("searchPost",()=>{
    it("Deve retornar o conteudo do post",()=>{
        const user = {
            id: 35,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 35;

        const post1 = {id: 1,createdAt: "2025/01/10",category: "Tecnologia",content: "Novidades do JS"};
        const post2 = {id: 2,createdAt: "2025/01/11",category: "Esportes",content: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        const postagensTotais = postagem.searchPosts(userId);

        expect (postagensTotais).to.have.lengthOf(2);

        expect(postagensTotais[0]).to.deep.include(post1);
        expect(postagensTotais[1]).to.deep.include(post2);
    });
    it("Deve retornar uma array de post vazia",()=>{
        const userId = 35;

        const postagensTotais = postagem.searchPosts(userId);

        expect(postagensTotais).to.have.lengthOf(0);
        expect(postagensTotais).to.deep.equal([]);
    });
});

describe("searchPostCategoria",()=>{
    it("Deve retornar todos os post com uma categoria especifica",()=>{
        const user = {
            id: 5,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 5;

        const post1 = {id: 1,createdAt: "2025/01/10",category: "Tecnologia",content: "Novidades do JS"};
        const post2 = {id: 2,createdAt: "2025/01/11",category: "Esportes",content: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        const category = "Esportes"

        const post = postagem.searchPostCategory(userId,category)
        expect(post).to.have.lengthOf(1);
        expect(post[0].category).to.equal("Esportes");
    });
    it("Deve retornar uma string vazia",()=>{
        const userId = 10;
        const category = "Esportes";

        const post = postagem.searchPostCategory(userId,category)
        expect (post).to.have.lengthOf(0);
        expect(post).to.deep.equal([]);
    });
})

describe("serachPostID",()=>{
    it("Deve retornar um post por ID",()=>{
        const user = {
            id: 7,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
        const userId = 7;

        const post1 = {id: 10, createdAt: "2025/01/10", category: "Tecnologia", content: "Novidades do JS"};
        const post2 = {id: 14, createdAt: "2025/01/11", category: "Esportes",   content: "Resultado do jogo"};

        postagem.createPost(userId,post1);
        postagem.createPost(userId,post2);

        const postId = 10;

        const post = postagem.searchPostID(userId,postId)
        expect(post.id).to.equal(10);
        expect(post).to.deep.include(post1);

    });
    it("Deve retornar um array vazio",()=>{
        const userId = 10;
        const postId = 3;

        const post = postagem.searchPostID(userId,postId)
        expect(post).to.deep.equal([]);
    });
});

describe("getPostsByRangeDate",()=>{
    it("Deve retornar um período de posts", () => {
        const user = {
            id: 7,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);

        const post1 = { id: 1, createdAt: "2025/01/10", category: "Tecnologia", content: "Novidades do JS" };
        const post2 = { id: 2, createdAt: "2025/02/11", category: "Esportes",  content: "Resultado do jogo" };
        const post3 = { id: 3, createdAt: "2025/03/12", category: "Culinaria", content: "Receita prática" };
        const post4 = { id: 4, createdAt: "2025/04/01", category: "Política",  content: "Propaganda política" };

        postagem.createPost(user.id, post1);
        postagem.createPost(user.id, post2);
        postagem.createPost(user.id, post3);
        postagem.createPost(user.id, post4);

        const rangeDate = postagem.getPostsByRangeDate(user.id, "2025/01/10", "2025/03/12");

        expect(rangeDate).to.have.lengthOf(3);
        expect(rangeDate.map(p => p.category)).to.deep.equal(["Tecnologia", "Esportes", "Culinaria"]);
    });
    it("A data de inicio não deve ser maior que a data final",()=>{
        const user = {
            id: 7,
            name: 'Catatau',
            userName: 'catatau',
            password: '12345',
            email: 'catatau@gmail.com'
        };
        usuario.createUser(user);
    
        expect(()=>{
            postagem.getPostsByRangeDate(user.id, "2025/12/12", "2025/01/01")
        }).to.throw("A data de inicio não deve ser maior que a data final");
    });
    it("Deve retornar uma array vazia",()=>{
        const userId = 99;
        
        const postResult = postagem.getPostsByRangeDate(userId, "2025/01/10", "2025/03/12")
        expect (postResult).to.have.lengthOf(0);
        expect (postResult).to.deep.equal([]);
    });
})