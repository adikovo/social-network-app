const mongoose = require('mongoose');

//structure of conversation document in the db
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    lastMessageSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    conversationId: {
        type: String,
        required: true,
        unique: true
    }
});

//conversation describes one document in db
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
