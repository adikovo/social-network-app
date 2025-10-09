
const mongoose = require('mongoose');


//structure of data document in the db
const userSchema = new mongoose.Schema({
    name: String,
    email: String
})

//user describes the one document in db
const User = mongoose.model('User', userSchema)

module.exports = User;  