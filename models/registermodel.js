const mongoose = require('mongoose');

// schema
const registerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,

});

// model
const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
