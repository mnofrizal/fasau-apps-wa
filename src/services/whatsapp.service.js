const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("../../config.js");
const path = require("path");

class WhatsAppService {
  constructor() {
    // Ensure session directories exist
    const fs = require("fs");

    // Auth data directory
    const authDir = path.resolve(process.cwd(), config.CLIENT_OPTIONS.dataPath);
    if (!fs.existsSync(authDir)) {
      console.log("Creating auth directory:", authDir);
      fs.mkdirSync(authDir, { recursive: true });
    }

    // Browser data directory
    const browserDir = path.resolve(
      process.cwd(),
      config.CLIENT_OPTIONS.puppeteer.userDataDir
    );
    if (!fs.existsSync(browserDir)) {
      console.log("Creating browser directory:", browserDir);
      fs.mkdirSync(browserDir, { recursive: true });
    }

    console.log("Session directories initialized:", {
      auth: authDir,
      browser: browserDir,
    });

    const clientOptions = {
      authStrategy: new LocalAuth({
        clientId: "fasau-bot",
        dataPath: path.resolve(process.cwd(), config.CLIENT_OPTIONS.dataPath),
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      },
      qrMaxRetries: 3,
    };

    console.log("Initializing WhatsApp client with options:", {
      dataPath: clientOptions.authStrategy.dataPath,
      clientId: clientOptions.authStrategy.clientId,
    });

    this.client = new Client(clientOptions);
    this.initialize();
  }

  initialize() {
    // Generate QR Code for authentication
    this.client.on("qr", (qr) => {
      console.log("QR Code received. Scan it with WhatsApp:");
      qrcode.generate(qr, { small: true });
    });

    // Handle successful authentication
    this.client.on("ready", () => {
      console.log("WhatsApp client is ready!");
      console.log(
        "Session has been saved locally in:",
        config.CLIENT_OPTIONS.dataPath
      );
      console.log("Monitoring messages with these prefixes:");
      Object.entries(config.MESSAGE_TYPES).forEach(
        ([prefix, { category, subCategory }]) => {
          console.log(
            `${prefix} -> Category: ${category}, SubCategory: ${subCategory}`
          );
        }
      );
    });

    // Handle authentication failures
    this.client.on("auth_failure", (msg) => {
      console.error("Authentication failed:", msg);
    });

    // Handle disconnections
    this.client.on("disconnected", (reason) => {
      console.log("Client was disconnected:", reason);
    });

    // Handle authenticated event
    this.client.on("authenticated", (session) => {
      console.log("Client authenticated, session saved");
    });

    // Initialize the client
    this.client.initialize().catch((error) => {
      console.error("Failed to initialize client:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    });

    // Handle process termination and cleanup
    process.on("SIGINT", async () => {
      console.log("Shutting down and cleaning up...");
      try {
        // Save session before destroying
        console.log("Saving session state...");
        await this.client.destroy();
        console.log("Client destroyed successfully");

        // Clean up browser data if needed
        if (process.env.CLEANUP_ON_EXIT === "true") {
          console.log("Cleaning up browser data...");
          if (fs.existsSync(browserDir)) {
            fs.rmSync(browserDir, { recursive: true, force: true });
            console.log("Browser data cleaned up");
          }
        }

        process.exit(0);
      } catch (error) {
        console.error("Error during cleanup:", error);
        process.exit(1);
      }
    });
  }
  async sendMessage(phoneNumber, message) {
    try {
      // Format phone number
      const formattedNumber = phoneNumber.replace(/\D/g, ""); // Remove non-digits
      const chatId = `${formattedNumber}@c.us`;

      // Send message
      const response = await this.client.sendMessage(chatId, message);
      return {
        success: true,
        messageId: response.id._serialized,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send WhatsApp message");
    }
  }

  // Send message to a group
  async sendGroupMessage(groupId, message) {
    try {
      // Validate group ID format
      if (!groupId.endsWith("@g.us")) {
        groupId = `${groupId}@g.us`;
      }

      // Send message to group
      const response = await this.client.sendMessage(groupId, message);
      return {
        success: true,
        messageId: response.id._serialized,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error("Error sending group message:", error);
      throw new Error("Failed to send WhatsApp group message");
    }
  }

  // Send message using template
  async sendTemplateMessage(templateName, data, groupId) {
    try {
      // Get template from config
      const template = config.MESSAGE_TEMPLATES[templateName];
      if (!template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      // Replace placeholders in template with actual data
      let message = template.format;
      Object.keys(data).forEach((key) => {
        message = message.replace(new RegExp(`{${key}}`, "g"), data[key]);
      });

      // Send message
      const response = await this.client.sendMessage(groupId, message);
      return {
        success: true,
        messageId: response.id._serialized,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error("Error sending template message:", error);
      throw new Error("Failed to send template message");
    }
  }

  // Get all WhatsApp groups
  async getAllGroups() {
    try {
      const groups = [];

      // Search for messages in group chats (this forces loading of group list)
      console.log("Searching for group chats...");
      await this.client.searchMessages("", {
        page: 1,
        limit: 1,
        chatId: "@g.us",
      });

      // Now get all loaded chats
      const chats = await this.client.getChats();
      console.log(`Total chats found: ${chats.length}`);

      // Process group chats
      for (const chat of chats) {
        if (chat.id.server === "g.us") {
          try {
            console.log(`Found group: ${chat.name}`);

            // Basic group info
            const groupInfo = {
              id: chat.id._serialized,
              name: chat.name || "Unknown Group",
              participantsCount: chat.groupMetadata?.participants?.length || 0,
              description: chat.groupMetadata?.desc || "",
              owner: chat.groupMetadata?.owner || "",
              createdAt: chat.groupMetadata?.creation || null,
            };

            groups.push(groupInfo);
          } catch (err) {
            console.error(
              `Error processing group: ${chat.id._serialized}`,
              err.message
            );
          }
        }
      }

      console.log(`Successfully found ${groups.length} groups`);
      return groups;
    } catch (error) {
      console.error("Error getting groups:", error);
      throw new Error("Failed to get WhatsApp groups");
    }
  }

  // Method to check if client is ready
  isReady() {
    return this.client && this.client.pupPage ? true : false;
  }

  // Edit message
  async editMessage(messageId, newText) {
    try {
      const message = await this.client.getMessageById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      const editedMessage = await message.edit(newText);
      return {
        success: true,
        messageId: editedMessage.id._serialized,
        timestamp: editedMessage.timestamp,
        newText: editedMessage.body,
      };
    } catch (error) {
      console.error("Error editing message:", error);
      throw new Error("Failed to edit WhatsApp message");
    }
  }

  // Delete message
  async deleteMessage(messageId) {
    try {
      const message = await this.client.getMessageById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      await message.delete(true); // true for everyone
      return {
        success: true,
        messageId: messageId,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new Error("Failed to delete WhatsApp message");
    }
  }

  // Edit message using template
  async editMessageWithTemplate(messageId, templateName, data) {
    try {
      // Get template from config
      const template = config.MESSAGE_TEMPLATES[templateName];
      if (!template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      // Get the message to edit
      const message = await this.client.getMessageById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      // Replace placeholders in template with actual data
      let newText = template.format;
      Object.keys(data).forEach((key) => {
        newText = newText.replace(new RegExp(`{${key}}`, "g"), data[key]);
      });

      // Edit the message
      const editedMessage = await message.edit(newText);
      return {
        success: true,
        messageId: editedMessage.id._serialized,
        timestamp: editedMessage.timestamp,
        newText: editedMessage.body,
        templateUsed: templateName,
      };
    } catch (error) {
      console.error("Error editing message with template:", error);
      throw new Error("Failed to edit WhatsApp message with template");
    }
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService();
module.exports = whatsappService;
