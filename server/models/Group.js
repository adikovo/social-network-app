
const mongoose = require('mongoose');

//structure of group document in the db
const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: Array,
    //user id
    createdBy: String,
    //name of the creator
    createdByName: String,
    admins: [String],
    privacy: String,
    posts: Array,
    //join requests for private groups
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

//group describes one document in db
const Group = mongoose.model('Group', groupSchema)

module.exports = Group;