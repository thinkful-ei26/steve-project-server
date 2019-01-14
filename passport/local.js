'use strict'

//Passport Local Strategy that finds the user and validates the password.

//Require passport-local in the file and set the Strategy property to a local variable named LocalStrategy using object destructuring.
const { Strategy: LocalStrategy } = require('passport-local')
const User = require('../models/userModel')

//There's no express here, so there's no calling next.

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, callback) => {
  let user
  User.findOne({ username: username })
    .then(_user => {
      user = _user
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        })
      }
      return user.validatePassword(password)
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        })
      }
      return callback(null, user)
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err)
      }
      return callback(err, false)
    })
})

module.exports = localStrategy

//JWT will actually protect our endpoints, LocalAuth is just for the login endpoint
