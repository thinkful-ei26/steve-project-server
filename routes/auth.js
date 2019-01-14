'use strict'
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { JWT_SECRET, JWT_EXPIRY } = require('../config')

const jwtAuth = passport.authenticate('jwt', { session: false })

const router = express.Router()

const localAuth = passport.authenticate('local', { session: false })
router.use(bodyParser.json())
// The user provides a username and password to login

router.post('/login', localAuth, function(req, res) {
  // The `req.user` has a value because of `done(null, user)` in Local Strategy
  //contains password but toJSON() will get rid of it - we have access to req.user bc localAuth strategy gives it to us after validating
  const authToken = createAuthToken(req.user)
  return res.json({ authToken }) //they only get to this point after going through localAuth validation. Now we assign them a token!
})
// we pass in localAuth as a middleware fn that will check if the user can log in or not (i did this in server.js)- if they cant, then the middlware handles it and it never gets to the endpoint. Otherwise, they're granted access to the login endpoint, and the middleware gives us a req.user so we can now acccess that and know who's logged in - and assign a token for that user!

//this creates a new token
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user)
  res.json({ authToken })
})

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  }) //{user} is the payload,
  console.log(user.username)
}

module.exports = router
