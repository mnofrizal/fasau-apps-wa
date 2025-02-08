const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

// POST /api/messages - Send a WhatsApp message
router.post("/messages", messageController.sendMessage.bind(messageController));

// POST /api/messages/group - Send a message to a WhatsApp group
router.post(
  "/messages/group",
  messageController.sendGroupMessage.bind(messageController)
);

// POST /api/messages/template - Send a template message
router.post(
  "/messages/template",
  messageController.sendTemplateMessage.bind(messageController)
);

// GET /api/groups - Get all WhatsApp groups
router.get("/groups", messageController.getGroups.bind(messageController));

// GET /api/status - Check WhatsApp client status
router.get("/status", messageController.status.bind(messageController));

// PUT /api/messages/:id - Edit a WhatsApp message
router.put(
  "/messages/:id",
  messageController.editMessage.bind(messageController)
);

// DELETE /api/messages/:id - Delete a WhatsApp message
router.delete(
  "/messages/:id",
  messageController.deleteMessage.bind(messageController)
);

// PUT /api/messages/:id/template - Edit a WhatsApp message using template
router.put(
  "/messages/:id/template",
  messageController.editMessageWithTemplate.bind(messageController)
);

module.exports = router;
