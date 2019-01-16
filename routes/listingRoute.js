const express = require('express')
const Router = express.Router()
const Listing = require('../models/listingModel')
const passport = require('passport')

const jwtAuth = passport.authenticate('jwt', { session: false })

//post new listing
Router.post('/', jwtAuth, function(req, res, next) {
  let { title, description, price, location } = req.body
  const newListing = {
    title: title,
    description: description,
    price: price,
    location: location,
    user: req.user.id
  }
  console.log(req.user)
  return Listing.create(newListing).then(result => {
    return res.json(result).status(201)
  })
})

//remove listing
Router.delete('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params

  return Listing.findOneAndRemove({ _id: id })
    .then(data => res.json(data))
    .catch(err => next(err))
})
//get All listings

Router.get('/', jwtAuth, (req, res, next) => {
  const { searchTerm } = req.query
  const userId = req.user.id
  let filter = {}

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i')
    filter.$or = [{ title: re }, { description: re }, { location: re }]
  }
  console.log(searchTerm)
  filter.user = userId

  return Listing.find(filter)
    .then(data => res.json(data))
    .catch(err => next(err))
})

//get listing by ID
Router.get('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params
  // const goodId = checkIdIsValid(id);
  // // if(!goodId){
  //     const err = new Error("Invalid id in url");
  //     err.status = 400;
  //     return next(err);
  // }
  return Listing.find({ _id: id })
    .then(data => res.json(data))
    .catch(err => next(err))
})

//update listing
Router.put('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params
  // const goodId = checkIdIsValid(id);
  // if(!goodId){
  //     const err = new Error("Invalid id in url");
  //     err.status = 400;
  //     return next(err);
  // }
  // const userId = req.user.id;
  let { title, price, description, location } = req.body
  const updateObj = {}

  updateObj['title'] = title
  updateObj['price'] = Number(price)
  updateObj['description'] = description
  updateObj['location'] = location

  return Listing.findOneAndUpdate({ _id: id }, updateObj, {
    $set: true,
    new: true
  })
    .then(data => res.json(data))
    .catch(err => next(err))
})

module.exports = Router
