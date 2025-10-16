
const express = require("express");
const router = express.Router();
const { handlePostCommand } = require("../controllers/postController");

//endpoint for CRUD operations
router.post("/", handlePostCommand);

module.exports = router;
