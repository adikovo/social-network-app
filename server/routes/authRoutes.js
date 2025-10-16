
const express = require("express");
const router = express.Router();
const { handleAuthCommand } = require("../controllers/authController");

//endpoint for register & login operations
router.post("/auth", handleAuthCommand);

module.exports = router;
