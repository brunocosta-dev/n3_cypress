const { getUserById } = require('./user.js');
const { getPhotoById } = require('./gallery.js');
const { searchPostID } = require('./post.js');

/**
 * Cria e adiciona uma nova foto à galeria.
 * @param {object} dadosComentario - Objeto com { id, conteudo, idAutor, dataCriacao }
 */
function criarComentario(targetUserId, target, targetId, dadosComentario) {

  if (!targetUserId || !target || !targetId || targetId <= 0) 
    throw new Error("Parâmetros de destino inválidos");

  const targetUser = getUserById(targetUserId);
  if (!targetUser) throw new Error("Usuário (alvo do comentário) não encontrado.");

  if (!dadosComentario || !dadosComentario.id || !dadosComentario.conteudo || !dadosComentario.idAutor || !dadosComentario.dataCriacao)
    throw new Error("Dados do comentário inválidos");
  
  const autor = getUserById(dadosComentario.idAutor);
  if (!autor) throw new Error("Usuário (autor do comentário) não encontrado.");

  const novoComentario = {
    id: dadosComentario.id,
    conteudo: dadosComentario.conteudo.trim(),
    idAutor: dadosComentario.idAutor,
    dataCriacao: new Date()
  };

  const targetType = target.toLowerCase();
  let contentTarget = null;

  if (targetType === 'photo' || targetType === 'foto') {
    contentTarget = getPhotoById(targetUserId, targetId); 

    if (!contentTarget) throw new Error("Foto não encontrada.");

  } else if (targetType === 'post') {
    contentTarget = searchPostID(targetUserId, targetId); 

    if (!contentTarget) throw new Error("Postagem não encontrada.");

  } else {
    throw new Error("Tipo de 'target' inválido.");
  }

  if (!contentTarget.comments) contentTarget.comments = [];

  if (contentTarget.comments.find(c => c.id === dadosComentario.id))
      throw new Error("ID de comentário já está cadastrado neste conteúdo.");

  contentTarget.comments.push(novoComentario);
}

function procuraComentario(targetUserId, targetType, targetId, comentarioId) {
  if (targetType === 'photo' || targetType === 'foto') {
    const comments = listarComentariosPorFoto(targetUserId, targetId);

    return comments.find(c => c.id === comentarioId);

  } else if (targetType === 'post') {
    const comments = listarComentariosPorPostagem(targetUserId, targetId);

    return comments.find(c => c.id === comentarioId);

  } else {
    throw new Error("Tipo de 'target' inválido.");
  }
}

function listarComentariosPorFoto(targetUserId, photoId) {
  const targetUser = getUserById(targetUserId);
  if (!targetUser) throw new Error("Usuário (alvo do comentário) não encontrado.");

  const foto = getPhotoById(targetUser.id, photoId);
  if (!foto) throw new Error("Foto não encontrada.");

  return foto.comments;
}

function listarComentariosPorPostagem(targetUserId, postId) {
  const targetUser = getUserById(targetUserId);
  if (!targetUser) throw new Error("Usuário (alvo do comentário) não encontrado.");

  const postagem = searchPostID(targetUser.id, postId); 
  if (!postagem) throw new Error("Postagem não encontrada.");

  return postagem.comments;
}

function deletarComentario(targetUserId, targetType, targetId, comentarioId) {
  let comments = [];

  if (targetType === 'photo' || targetType === 'foto') {
    comments = listarComentariosPorFoto(targetUserId, targetId)

  } else if (targetType === 'post') {
    comments = listarComentariosPorPostagem(targetUserId, targetId)

  } else {
    throw new Error("Tipo de 'target' inválido.");
  }

  const index = comments.findIndex(c => c.id === comentarioId);
  if (index === -1) throw new Error("Comentário não encontrado.");
  comments.splice(index, 1);
}

module.exports = {
  criarComentario,
  procuraComentario,
  listarComentariosPorFoto,
  listarComentariosPorPostagem,
  deletarComentario
};
