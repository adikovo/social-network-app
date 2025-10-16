
const mongoose = require('mongoose');


//structure of user document in the db
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    friends: Array,
    groups: Array
})

//user describes one document in db
const User = mongoose.model('User', userSchema)

module.exports = User;  