const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');

//endpoint to get messages in a conversation
router.get('/:conversationId', async (req, res) => {
    try {
        const result = await getMessages(req.params.conversationId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//endpoint to send a new message
router.post('/', async (req, res) => {
    try {
        const result = await sendMessage(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
