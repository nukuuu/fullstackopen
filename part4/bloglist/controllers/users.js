const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1});
  if (users) {
    response.json(users);
  } else {
    response.status(404);
  }
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(username && password)) {
    return response.status(400).json({
      error: 'username and password are required',
    })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long',
    })
  }

  const existingUser = await User.findOne({username})
 if (existingUser) {
  return response.status(400).json({
    error: 'username must be unique'
  })
 }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    blogs: []
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter