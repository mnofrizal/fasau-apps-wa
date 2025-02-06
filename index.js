require("dotenv").config();
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const config = require("./config.js");

// Configure Cloudinary
cloudinary.config(config.CLOUDINARY);

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

// Initialize WhatsApp client with LocalAuth
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: config.CLIENT_OPTIONS.puppeteer,
});

// Generate QR Code for authentication (only needed for first time)
client.on("qr", (qr) => {
  console.log("QR Code received. Scan it with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Handle successful authentication
client.on("ready", () => {
  console.log("WhatsApp client is ready!");
  console.log("Session has been saved locally.");
  console.log("Monitoring messages with these prefixes:");
  Object.entries(config.MESSAGE_TYPES).forEach(([prefix, category]) => {
    console.log(`${prefix} -> ${category}`);
  });
  console.log("Messages will be forwarded to:", config.WEBHOOK_URL);
});

// Handle incoming messages
client.on("message", async (message) => {
  try {
    // Ignore messages older than 1 minute
    const messageAge = Date.now() / 1000 - message.timestamp;
    if (messageAge > 60) {
      return;
    }

    // Check if message is from a group (by checking if the "from" contains "@g.us")
    const isGroupMessage = message.from.endsWith("@g.us");
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
      message.body.startsWith(`${p} `)
    );
    if (!prefix) {
      return;
    }

    // Get the category based on the prefix
    const category = config.MESSAGE_TYPES[prefix];

    // Remove the prefix and trim
    const description = message.body.substring(prefix.length + 1).trim();

    // Get contact info for the sender
    const contact = await message.getContact();

    // Use only push name (display name set by user) or "Unknown User" as fallback
    const pelapor = contact.pushname || "Unknown User";

    // Format phone number
    // For group messages, use participant's number, otherwise use sender's number
    const phone = (isGroupMessage ? message.id.participant : message.from)
      .replace("whatsapp:", "")
      .replace("@c.us", "");

    // Log raw message details for debugging
    console.log("\n=== Raw Message Details ===");
    console.log("From:", message.from);
    console.log("Participant:", message.id.participant);
    console.log("Is Group:", isGroupMessage);
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

    // Send random thank you reply with user's name
    const responses = config.RESPONSE_MESSAGES;
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    const personalizedResponse = randomResponse.replace("{name}", pelapor);
    await message.reply(personalizedResponse);

    // Log success with group info if applicable
    const successInfo = {
      status: response.status,
      messageId: message.id,
      category: category,
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
      messageId: message.id,
      body: message.body,
    };

    if (isGroupMessage) {
      try {
        const chat = await message.getChat();
        errorInfo.groupName = chat.name;
        errorInfo.isGroup = true;
      } catch (chatError) {
        errorInfo.groupError = "Failed to get group info";
      }
    }

    console.error("Error forwarding message:", errorInfo);
  }
});

// Handle authentication failures
client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
});

// Handle disconnections
client.on("disconnected", (reason) => {
  console.log("Client was disconnected:", reason);
});

// Initialize client
client.initialize().catch((error) => {
  console.error("Failed to initialize client:", error);
});

// Handle process termination
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  try {
    await client.destroy();
    console.log("Client destroyed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error while shutting down:", error);
    process.exit(1);
  }
});
