const getUser = require('./user.js')

function createPost(userId, post){
    if (!post)
        throw new Error("Dados inválidos");

    if (!post.id || typeof post.id !== "number" || isNaN(post.id) || post.id <= 0)
        throw new Error("ID inválido");

    if (!post.content || post.content.trim().length === 0)
        throw new Error("Conteúdo inválido");

    if (!post.category || post.category.trim().length === 0)
        throw new Error("Categoria inválida");

    if (!post.createdAt)
         throw new Error("Data inválida");
        
    if(!(post.createdAt instanceof Date)) post.createdAt = new Date (post.createdAt);

    const user = getUser.getUserById(userId);
    if(!user) throw new Error("Usuário não encontrado");

    if (user.posts.find(p => p.id === post.id)) throw new Error("ID já está cadastrado");
    
    user.posts.push({ ...post, comments:[] });
}

function removePost(userId, index){
    const user = getUser.getUserById(userId);
    if(!user || index < 0 || index >= user.posts.length) throw new Error("Usuário não encontrado.");
    user.posts.splice(index, 1);
}

function searchPosts(userId){
    const user = getUser.getUserById(userId);
    if(!user) return[];

    return[...user.posts];
}

function searchPostCategory(userId, category){
    const user = getUser.getUserById(userId);
    if(!user) return[];

    return user.posts.filter(post => post.category === category);
}

function searchPostID(userId, postId){
    const user = getUser.getUserById(userId);
    if(!user) return[];

    return user.posts.find(p => p.id === postId);
}

function getPostsByRangeDate(userId, dateStart, dateEnd) {
    const user = getUser.getUserById(userId);
    if(!user) return[];

    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);

    if (dateStart > dateEnd) 
        throw new Error('A data de inicio não deve ser maior que a data final');

    return user.posts.filter(post => 
        post.createdAt >= dateStart && post.createdAt <= dateEnd
    );
}

module.exports = {
    createPost,
    removePost,
    searchPosts,
    searchPostCategory,
    searchPostID,
    getPostsByRangeDate
}