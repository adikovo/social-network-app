const express = require("express");
const router = express.Router();
const { handleFeedCommand } = require("../controllers/feedController");

//endpoint for feed operations
router.post("/", handleFeedCommand);

module.exports = router;
