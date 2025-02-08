const whatsappService = require("../services/whatsapp.service");

class MessageController {
  // Send message to a group
  async sendGroupMessage(req, res) {
    try {
      // Validate request body
      const { groupId, message } = req.body;

      if (!groupId || !message) {
        return res.status(400).json({
          success: false,
          error: "Group ID and message are required",
        });
      }

      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Send message to group
      const result = await whatsappService.sendGroupMessage(groupId, message);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to send group message",
      });
    }
  }

  async sendMessage(req, res) {
    try {
      // Validate request body
      const { phoneNumber, message } = req.body;

      if (!phoneNumber || !message) {
        return res.status(400).json({
          success: false,
          error: "Phone number and message are required",
        });
      }

      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Send message
      const result = await whatsappService.sendMessage(phoneNumber, message);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to send message",
      });
    }
  }

  // Get all WhatsApp groups
  async getGroups(req, res) {
    try {
      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Get all groups
      const groups = await whatsappService.getAllGroups();

      res.status(200).json({
        success: true,
        data: groups,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get WhatsApp groups",
      });
    }
  }

  // Edit a message with template
  async editMessageWithTemplate(req, res) {
    try {
      const messageId = req.params.id;
      const { templateName, data } = req.body;

      if (!templateName || !data) {
        return res.status(400).json({
          success: false,
          error: "Template name and data are required",
        });
      }

      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Edit message using template
      const result = await whatsappService.editMessageWithTemplate(
        messageId,
        templateName,
        data
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to edit message with template",
      });
    }
  }

  // Delete a message
  async deleteMessage(req, res) {
    try {
      const messageId = req.params.id;

      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Delete message
      const result = await whatsappService.deleteMessage(messageId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete message",
      });
    }
  }

  // Edit a message
  async editMessage(req, res) {
    try {
      // Get message ID from params and new text from body
      const messageId = req.params.id;
      const { newText } = req.body;

      if (!newText) {
        return res.status(400).json({
          success: false,
          error: "New text is required",
        });
      }

      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Edit message
      const result = await whatsappService.editMessage(messageId, newText);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to edit message",
      });
    }
  }

  // Health check endpoint
  async status(req, res) {
    try {
      const isReady = whatsappService.isReady();
      res.status(200).json({
        success: true,
        status: isReady ? "ready" : "initializing",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to get WhatsApp status",
      });
    }
  }

  // Send message using template
  async sendTemplateMessage(req, res) {
    try {
      // Validate request body
      const { templateName, data, groupId } = req.body;

      if (!templateName || !data || !groupId) {
        return res.status(400).json({
          success: false,
          error: "Template name, data, and group ID are required",
        });
      }

      // Check if WhatsApp client is ready
      if (!whatsappService.isReady()) {
        return res.status(503).json({
          success: false,
          error: "WhatsApp client is not ready. Please scan QR code first.",
        });
      }

      // Send template message
      const result = await whatsappService.sendTemplateMessage(
        templateName,
        data,
        groupId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to send template message",
      });
    }
  }
}

const messageController = new MessageController();
module.exports = messageController;
