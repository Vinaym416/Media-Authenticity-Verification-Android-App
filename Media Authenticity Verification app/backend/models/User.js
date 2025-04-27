const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  securityQuestions: [{
    question: String,
    answer: String
  }]
});

module.exports = mongoose.model('User', userSchema);