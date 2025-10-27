const express = require('express');
const router = express.Router();
const {
    startConversation,
    getConversationMessages,
    getUserConversations,
    deleteConversation,
    markConversationAsRead
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
        const { conversationId } = req.params;
        const { userId } = req.body;

        const result = await deleteConversation(conversationId, userId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//mark conversation as read for a user
router.put('/:conversationId/read', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { userId } = req.body;

        const result = await markConversationAsRead(conversationId, userId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;