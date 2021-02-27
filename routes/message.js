const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/messageController");



// GET request to create message
router.get("/create", message_controller.message_create_get);

// POST request to create message
router.post("/create", message_controller.message_create_post);

// POST request to delete message
router.post("/delete", message_controller.message_delete_post);




module.exports = router
