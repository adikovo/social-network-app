
const express = require("express");
const router = express.Router();
const { handleGroupCommand } = require("../controllers/groupController");

//endpoint for CRUD operations
router.post("/", handleGroupCommand);

module.exports = router;