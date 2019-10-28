const express = require('express');

const server = express();

server.use(express.json())

const users = ['Carlos', 'Bruno', 'Teixeira'];

// CRUD = Create, Read, Update, Delete

// Middleware Global
server.use((req, res, next) => {
  console.time('Request')

  console.log(`Método: ${req.method}, URL: ${req.url}`)

  next()

  console.timeEnd('Request')
})

// Middleware Local
/// Verificando no body se o "user" não existe... aí retorna o erro.
function checkUserExists(req, res, next) {
  if(!req.body.user) {
    return res.status(400).json({ error: 'User name required' })
  }
  return next()
}

/// Verifica se já existe o usuario dentro do array "users", se tiver retorna um erro.
function checkUserNoRepeat(req, res, next) {
  if(users.indexOf(req.body.user) !== -1) {
    return res.status(400).json({ error: 'User exists, no repeat' })
  }
  return next()
}



// Lista todos usuários
server.get('/users', (req, res) => {
  return res.json(users);
});

// Lista um usuário
server.get('/users/:index', (req, res) => {
  const { index } = req.params

  return res.json(users[index]);
});

// Adiciona um usuário
server.post('/users', checkUserExists, checkUserNoRepeat, (req, res) => {
  const { user } = req.body
  users.push(user)

  return res.json(users)
})

// Atualizar os dados do usuário
server.put('/users/:index', checkUserExists, checkUserNoRepeat, (req, res) => {
  const { index } = req.params
  
  const { user } = req.body
  const userOld = users[index]
  users[index] = user

  return res.json({ message: `O usuário(a) ${userOld} foi alterado(a) para ${user}` })
})


// Deletar usuário
server.delete('/users/:index', (req, res) => {
  const { index } = req.params

  const userDel = users[index]

  users.splice(index, 1)

  return res.json({ message: `O usuário(a) ${userDel} foi removido` })

})


server.listen(3000)
