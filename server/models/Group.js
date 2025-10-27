
const mongoose = require('mongoose');

//structure of group document in the db
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    members: Array,
    //creator id
    createdBy: {
        type: String,
        required: true,
        maxlength: 50
    },
    //name of the creator
    createdByName: {
        type: String,
        maxlength: 100,
        trim: true
    },
    admins: [String],
    privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public",
        maxlength: 20
    },
    posts: Array,
    //join requests for private groups
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //track when each member joined
    memberJoinDates: [{
        userId: String,
        joinDate: { type: Date, default: Date.now }
    }]
})

//group describes one document in db
const Group = mongoose.model('Group', groupSchema)

module.exports = Group;