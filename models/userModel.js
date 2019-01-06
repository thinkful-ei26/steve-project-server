const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },
  email: { type: String, validate: [validateEmail, 'Validation of `{PATH}` failed with value `{VALUE}`'] },
  password: { type: String, required: true },

})

userSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

userSchema.methods.validatePassword = function (AttemptedPassword) {
  return bcrypt.compare(AttemptedPassword, this.password);
};

userSchema.statics.hashPassword = function (unhashedPass) {
  const hashed = bcrypt.hash(unhashedPass, 10);
  return hashed;
};


function validateEmail(email) {
  const re = new RegExp('[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}', 'i');
  if (!email) {
    return true;
  }
  return re.test(email);
}

module.exports = mongoose.model('User', userSchema);

