const mongoose = require('mongoose');

//structure of message document in the db
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    conversationId: {
        type: String,
        required: true
    }
});

//message describes one document in db
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
