const express = require("express");
const router = express.Router();
const { getFeed, getPostsByAuthor, getUserPosts } = require("../controllers/feedController");

// Get user's feed (posts from friends, groups, and own posts)
router.get("/", async (req, res) => {
    try {
        const result = await getFeed(req.query);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get posts by specific author
router.get("/author", async (req, res) => {
    try {
        const result = await getPostsByAuthor(req.query);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get posts by current user (for profile page)
router.get("/user", async (req, res) => {
    try {
        const result = await getUserPosts(req.query);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
