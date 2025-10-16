
const mongoose = require('mongoose');

//structure of group document in the db
const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: Array,
    createdBy: String,
    privacy: String,
    posts: Array
})

//group describes one document in db
const Group = mongoose.model('Group', groupSchema)

module.exports = Group;