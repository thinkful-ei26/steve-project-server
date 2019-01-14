const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

listingSchema.set('toJSON', {
  virtuals: true, // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id
    delete result.__v
  }
})

module.exports = mongoose.model('Listing', listingSchema)
