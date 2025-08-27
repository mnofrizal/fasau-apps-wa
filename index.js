require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const config = require("./config.js");
const messageRoutes = require("./src/routes/message.routes");
const cors = require("cors");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config(config.CLOUDINARY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Initialize WhatsApp service
const whatsappService = require("./src/services/whatsapp.service");

// Function to upload media to Cloudinary
async function uploadToCloudinary(mediaBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      })
      .end(mediaBuffer);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle incoming messages
whatsappService.client.on("message", async (message) => {
  // Check if message is from a group (by checking if the "from" contains "@g.us")
  let isGroupMessage = false;

  try {
    // Add safety checks for message object
    if (!message || !message.from || !message.timestamp) {
      console.log("Invalid message object received:", message);
      return;
    }

    // Ignore messages older than 1 minute
    const messageAge = Date.now() / 1000 - message.timestamp;
    if (messageAge > 60) {
      return;
    }

    // Set group message flag
    isGroupMessage = message.from.endsWith("@g.us");
    let groupInfo = null;

    if (isGroupMessage) {
      const chat = await message.getChat();
      groupInfo = {
        name: chat.name,
        id: chat.id._serialized,
      };
      console.log(`Checking message from group: ${chat.name}`);
    }

    // Check if message starts with any configured prefix (for both direct and group messages)
    const prefix = Object.keys(config.MESSAGE_TYPES).find((p) =>
      message.body.toLowerCase().startsWith(`${p} `)
    );
    if (!prefix) {
      return;
    }

    // Get the category and subcategory based on the prefix
    const { category, subCategory } = config.MESSAGE_TYPES[prefix];

    // Remove the prefix and trim
    const description = message.body.substring(prefix.length + 1).trim();

    // Get contact info for the sender
    const contact = await message.getContact();

    // Use only push name (display name set by user) or "Unknown User" as fallback
    const pelapor = contact.pushname || "Unknown User";

    // Format phone number with safety checks
    // For group messages, use participant's number, otherwise use sender's number
    let phone;
    try {
      if (isGroupMessage && message.id && message.id.participant) {
        phone = message.id.participant
          .replace("whatsapp:", "")
          .replace("@c.us", "")
          .replace("@lid", ""); // Remove @lid suffix for group participants
      } else {
        phone = message.from.replace("whatsapp:", "").replace("@c.us", "");
      }
    } catch (phoneError) {
      console.error("Error extracting phone number:", phoneError);
      phone = "unknown";
    }

    // Log raw message details for debugging
    console.log("\n=== Raw Message Details ===");
    console.log("From:", message.from);
    console.log("Message ID:", message.id);
    console.log("Participant:", message.id ? message.id.participant : "N/A");
    console.log("Is Group:", isGroupMessage);
    console.log("Message Type:", typeof message);
    console.log("Message Keys:", Object.keys(message));
    console.log("========================\n");

    let evidence = "";

    // Handle media if present
    if (message.hasMedia) {
      const media = await message.downloadMedia();

      // Check if media is an image
      if (media && media.mimetype.startsWith("image/")) {
        try {
          // Convert base64 to buffer
          const mediaBuffer = Buffer.from(media.data, "base64");

          // Upload to Cloudinary
          evidence = await uploadToCloudinary(mediaBuffer);
          console.log("Media uploaded to Cloudinary:", evidence);
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          // Keep default evidence URL if upload fails
        }
      }
    }

    // Prepare message data according to required structure
    const messageData = {
      evidence: evidence,
      description: description,
      pelapor: pelapor,
      phone: phone,
      category: category,
      subCategory: subCategory,
    };

    // Log the message data before sending
    console.log("\n=== Message Data to be Sent ===");
    console.log("Contact Details:");
    console.log("- Push Name:", contact.pushname || "No push name");
    console.log("- Final Name Used:", pelapor);
    console.log("- Phone Number:", phone);
    console.log(
      "- Message Type:",
      isGroupMessage ? "Group Message" : "Direct Message"
    );
    console.log("\nPayload:");
    console.log(JSON.stringify(messageData, null, 2));
    console.log("==============================\n");

    // Send message data to webhook
    const response = await axios.post(config.WEBHOOK_URL, messageData);

    // Send random thank you reply with user's name based on message type
    let responses;
    if (category === "CM") {
      responses = config.RESPONSE_MESSAGES_CM;
    } else if (category === "PM") {
      responses = config.RESPONSE_MESSAGES_PM;
    } else {
      responses = config.RESPONSE_MESSAGES_CM; // Default to CM responses
    }
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    const personalizedResponse = randomResponse.replace("{name}", pelapor);
    await message.reply(personalizedResponse);

    // Log success with group info if applicable
    const successInfo = {
      status: response.status,
      messageId: message.id,
      category: category,
      subCategory: subCategory,
      pelapor: pelapor,
      description: description,
      source: isGroupMessage ? "group" : "direct",
    };

    if (groupInfo) {
      successInfo.group = groupInfo;
    }

    console.log("Message forwarded successfully:", successInfo);
  } catch (error) {
    const errorInfo = {
      error: error.message,
      stack: error.stack,
      messageId: message && message.id ? message.id : "unknown",
      body: message && message.body ? message.body : "unknown",
      messageType: typeof message,
      messageKeys: message ? Object.keys(message) : [],
    };

    if (isGroupMessage) {
      try {
        const chat = await message.getChat();
        errorInfo.groupName = chat.name;
        errorInfo.isGroup = true;
      } catch (chatError) {
        errorInfo.groupError = "Failed to get group info";
        errorInfo.chatErrorMessage = chatError.message;
      }
    }

    console.error("Error forwarding message:", errorInfo);
  }
});
