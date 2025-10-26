const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

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

//send a new message
const sendMessage = async (messageData) => {
    try {
        const { senderId, receiverId, content, conversationId } = messageData;

        // validate required fields
        if (!senderId || !receiverId || !content || !conversationId) {
            return {
                success: false,
                message: 'Missing required fields'
            };
        }

        //create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            content: content.trim(),
            conversationId
        });

        const savedMessage = await newMessage.save();

        //create or update conversation
        let conversation = await Conversation.findOne({ conversationId });

        if (!conversation) {
            //create new conversation if it doesn't exist
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                conversationId: conversationId,
                lastMessage: content.trim(),
                lastMessageAt: new Date(),
                lastMessageSender: senderId
            });
        } else {
            //update existing conversation with last message info
            await Conversation.findOneAndUpdate(
                { conversationId: conversationId },
                {
                    lastMessage: content.trim(),
                    lastMessageAt: new Date(),
                    lastMessageSender: senderId
                }
            );
        }

        //populate sender info
        await savedMessage.populate('senderId', 'name profilePicture');

        return {
            success: true,
            message: savedMessage
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    getMessages,
    sendMessage
};
