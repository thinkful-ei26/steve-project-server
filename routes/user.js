const express = require('express')
const Router = express.Router()
const User = require('../models/userModel')

Router.post('/', function(req, res, next) {
  let { username, email, password } = req.body
  //TO_DO validate username and password
  // const isLegit = checkUsernameAndPassword([username, password]);
  // if(!isLegit.good){
  //     const err = new Error(`${isLegit.why} is not valid`);
  //     err.status = 401;
  //     return next(err);
  // }
  // firstName = trimName(firstName);
  // lastName = trimName(lastName);
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username: username,
        email: email,
        password: digest
      }
      return User.create(newUser)
    })
    .then(result => {
      return res
        .status(201)
        .location(`/register/${result.id}`)
        .json(result)
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists')
        err.status = 401
        err.reason = 'The username already exists'
      }
      next(err)
    })
})

module.exports = Router
