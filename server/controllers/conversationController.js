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
            participants: { $in: [userId] }
        })
            .populate('participants', 'name profilePicture')
            .populate('lastMessageSender', 'name')
            .sort({ lastMessageAt: -1 });

        const conversationsWithUnreadCount = conversations.map(conversation => {
            const userUnreadCount = conversation.unreadCounts.find(
                unreadCount => unreadCount.userId.toString() === userId.toString()
            );

            return {
                ...conversation.toObject(),
                unreadCount: userUnreadCount ? userUnreadCount.count : 0
            };
        });

        return {
            success: true,
            conversations: conversationsWithUnreadCount
        };
    } catch (error) {
        console.error('Error in getUserConversations:', error);
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

//mark messages as read for a specific user in a conversation
const markConversationAsRead = async (conversationId, userId) => {
    try {
        console.log('markConversationAsRead called with:', conversationId, userId);

        // First ensure unreadCounts array exists
        const conversation = await Conversation.findOne({ conversationId: conversationId });

        if (!conversation.unreadCounts || conversation.unreadCounts.length === 0) {
            console.log('Initializing unreadCounts for conversation:', conversationId);
            conversation.unreadCounts = [
                { userId: conversation.participants[0], count: 0 },
                { userId: conversation.participants[1], count: 0 }
            ];
            await conversation.save();
        }

        await Conversation.findOneAndUpdate(
            { conversationId: conversationId },
            {
                $set: {
                    'unreadCounts.$[elem].count': 0
                }
            },
            {
                arrayFilters: [{ 'elem.userId': userId }]
            }
        );

        console.log('Conversation marked as read successfully');
        return {
            success: true,
            message: 'Messages marked as read'
        };
    } catch (error) {
        console.error('Error marking conversation as read:', error);
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
    deleteConversation,
    markConversationAsRead
};
