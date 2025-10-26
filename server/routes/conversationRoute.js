const express = require('express');
const router = express.Router();
const {
    startConversation,
    getConversationMessages,
    getUserConversations,
    deleteConversation
} = require('../controllers/conversationController');

//get or create conversation between two users
router.post('/start', async (req, res) => {
    const { userId, otherUserId } = req.body;

    try {
        const conversation = await startConversation(userId, otherUserId);
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get all conversations for a user
router.get('/:userId', async (req, res) => {
    try {
        const conversations = await getUserConversations(req.params.userId);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete conversation
router.delete('/:conversationId', async (req, res) => {
    try {
        const deletedConversation = await deleteConversation(req.params.conversationId);
        if (!deletedConversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.json({ message: 'Conversation deleted successfully', conversation: deletedConversation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;