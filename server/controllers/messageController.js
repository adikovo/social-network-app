const Message = require('../models/Message');

//get messages in a conversation
const getMessages = async (conversationId) => {
    try {
        const messages = await Message.find({
            conversationId: conversationId
        })
            .populate('senderId', 'name profilePicture')
            .sort({ timestamp: 1 })
            .limit(50);

        return {
            success: true,
            messages: messages
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    getMessages
};
