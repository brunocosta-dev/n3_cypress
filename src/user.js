const users = [];
// user = [id, name, userName, password, email]

function createUser(user){
  if (!user || !user.id || !user.userName || !user.password || !user.email) throw new Error("Dados inválidos");

  if (!user.email.includes("@")) throw new Error("Email inválido");

  if (users.find(u => u.id === user.id)) throw new Error("ID já está cadastrado");
  if (users.find(u => u.userName.toLowerCase() === user.userName.toLowerCase())) throw new Error("Nome de usuário já está cadastrado");
  if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) throw new Error("Email já está cadastrado");
  
  users.push({ ...user, gallery: [], posts: [] });
}

function logInUser(userName, password){
  const user =  users.find(u => u.userName.toLowerCase() === userName.toLowerCase());
  if(!user) throw new Error("Usuário não encontrado");
  if(user.password !== password) throw new Error("Senha inválida");
  console.log(`Usuário ${userName} foi logado`);
} 

function getAllUsers(){
  return [...users];
}

function getUserById(id){
  return users.find(u => u.id === id);
}

function getUsersByName(name){
  const usersList = users
                    .filter(u => u.name.toLowerCase().includes(name.toLowerCase()))
                    .map(({ password, ...userWithoutPassword }) => userWithoutPassword);

  return usersList;
}

function updateUser(id, field, newData){
  const user =  users.find(u => u.id === id);
  if(!user) throw new Error("Usuário não encontrado");

  if(field === "id" || field === "email") throw new Error("Esses dados não podem ser alterados");

  const allowedFields = ["name", "userName", "password"];
  if (!allowedFields.includes(field)) throw new Error("Campo inválido");

  if (field === "userName") {
    const userExists = users.find(u => u.userName.toLowerCase() === newData.toLowerCase());
    if (userExists && userExists.id !== id)
      throw new Error("Nome de usuário já está cadastrado");
  };
  user[field] = newData;
}

function deleteUser(id){
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error("Usuário não encontrado");
  users.splice(index, 1);
}

function resetUsers() {
  users.length = 0;
}

module.exports = { 
  createUser, 
  logInUser, 
  getAllUsers, 
  getUserById, 
  getUsersByName, 
  updateUser, 
  deleteUser, 
  resetUsers 
};