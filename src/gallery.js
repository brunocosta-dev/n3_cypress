const usuario = require('./user.js'); // Dependência do módulo User

function uploadPhoto(userId, image) { 
  const user = usuario.getUserById(userId);
  if (!user) throw new Error("Usuario não encontrado"); 

  // Validações do objeto 'image'
  if (!image || typeof image !== 'object') throw new Error('Dados da imagem inválidos.');
  if (!image.id || typeof image.id !== 'number' || image.id <= 0 || isNaN(image.id)) throw new Error('ID da imagem inválido.');
  if (image.type !== 'image/png') throw new Error('Tipo de imagem não suportado');
  if (!image.description || typeof image.description !== 'string' || image.description.trim().length === 0) {
    throw new Error('Descrição da imagem não pode ser em branco');
  }
  // Validação e conversão da data
  if (!image.createDat) throw new Error('Data Inválida');
  if (!(image.createDat instanceof Date)) image.createDat = new Date(image.createDat);
  if (isNaN(image.createDat.getTime())) throw new Error('Data Inválida');

  // Inicializa user.images se não existir
  if (!user.images) {
    user.images = [];
  }

  // Verifica ID duplicado DENTRO DO USUÁRIO
  if (user.images.find(img => img.id === image.id)) throw new Error('Já existe uma imagem com esse id para este usuário');

  // Adiciona a imagem ao array do usuário
  const imageToAdd = { ...image }; // Cria uma cópia
  user.images.push(imageToAdd);
  return imageToAdd;
}

function getPhotoById(userId, imageId) {
  const user = usuario.getUserById(userId);
  // Se usuário não existe ou não tem imagens, retorna undefined
  if (!user || !user.images) return undefined;
  return user.images.find(image => image.id === imageId);
}

function getPhotosByUser(userId) {
  const user = usuario.getUserById(userId);
  if (!user || !user.images) return []; // Retorna array vazio se não achar usuário ou imagens
  return [...user.images]; // Retorna cópia do array de imagens do usuário
}

function getPhotosByRangeDate(userId, startDate, endDate) {
  const user = usuario.getUserById(userId);
  if (!user || !user.images) return [];

  // Converte datas e valida intervalo
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  if (isNaN(startTime) || isNaN(endTime)) 
    throw new Error('Formato de data inválido');
  
  if (startTime > endTime) 
    throw new Error('A data de início não pode ser posterior à data final');

  return user.images.filter(image => {
    return image.createDat >= startTime && image.createDat <= endTime;
  });
}

function deletePhoto(userId, imageId) {
  const user = usuario.getUserById(userId);
  if (!user || !user.images) throw new Error("Usuário ou galeria não encontrados");

  const index = user.images.findIndex(img => img.id === imageId);
  if (index === -1) throw new Error("Foto não encontrada na galeria do usuário");

  user.images.splice(index, 1);
}

module.exports = {
  uploadPhoto,
  getPhotoById,
  getPhotosByUser,
  getPhotosByRangeDate,
  deletePhoto,
};