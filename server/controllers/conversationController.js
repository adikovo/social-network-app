const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

//get or create conversation between two users
const startConversation = async (userId, otherUserId) => {
    try {
        // check if conversation exists
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        // create new if doesn't exist
        if (!conversation) {
            const conversationId = [userId, otherUserId].sort().join('_');
            conversation = await Conversation.create({
                participants: [userId, otherUserId],
                conversationId: conversationId
            });
        }

        return {
            success: true,
            conversation: conversation
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

//get messages in a conversation
const getConversationMessages = async (conversationId) => {
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

//get all conversations for a user
const getUserConversations = async (userId) => {
    try {
        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'name profilePicture')
            .populate('lastMessageSender', 'name')
            .sort({ lastMessageAt: -1 });

        return {
            success: true,
            conversations: conversations
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

//send a message
const sendMessage = async (conversationId, senderId, receiverId, content) => {
    try {
        const message = await Message.create({
            conversationId,
            senderId,
            receiverId,
            content
        });

        // update conversation's last message
        await Conversation.findOneAndUpdate(
            { conversationId: conversationId },
            {
                lastMessage: content,
                lastMessageAt: new Date(),
                lastMessageSender: senderId
            }
        );

        return {
            success: true,
            message: message
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

//delete conversation and all its messages
const deleteConversation = async (conversationId) => {
    try {
        // delete all messages in the conversation
        await Message.deleteMany({ conversationId });

        // delete the conversation
        const deletedConversation = await Conversation.findOneAndDelete({ conversationId });

        return {
            success: true,
            conversation: deletedConversation
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    startConversation,
    getConversationMessages,
    getUserConversations,
    sendMessage,
    deleteConversation
};
