const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Register endpoint
router.post("/register", async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;