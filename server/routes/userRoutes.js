

const express = require("express");
const router = express.Router();
const { handleUserCommand } = require("../controllers/userController");

//CRUD operations
router.post("//", handleUserCommand);


module.exports = router;