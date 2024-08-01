const mongoose = require('mongoose')

const SignupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    batch: String, 
  });

  const Signup = mongoose.model('Signup', SignupSchema);
  module.exports = Signup