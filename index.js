const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const config = require("./config.js");

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
  // Check if message starts with any configured prefix
  const prefix = Object.keys(config.MESSAGE_TYPES).find((p) =>
    message.body.startsWith(`${p} `)
  );
  if (!prefix) {
    return;
  }

  try {
    // Get the category based on the prefix
    const category = config.MESSAGE_TYPES[prefix];

    // Remove the prefix and trim
    const description = message.body.substring(prefix.length + 1).trim();

    // Get contact info for the sender
    const contact = await message.getContact();

    // Try to get the name in this order:
    // 1. Contact name (if in contacts)
    // 2. Push name (display name set by user)
    // 3. "Unknown User" as last resort
    const pelapor = contact.name || contact.pushname || "Unknown User";

    // Format phone number (remove "whatsapp:" prefix and any @c.us suffix)
    const phone = message.from.replace("whatsapp:", "").replace("@c.us", "");

    // Prepare message data according to required structure
    const messageData = {
      evidence: config.DEFAULT_EVIDENCE_URL,
      description: description,
      pelapor: pelapor,
      phone: phone,
      category: category,
    };

    // Log the message data before sending
    console.log("\n=== Message Data to be Sent ===");
    console.log("Contact Details:");
    console.log("- Contact Name:", contact.name || "Not in contacts");
    console.log("- Push Name:", contact.pushname || "No push name");
    console.log("- Final Name Used:", pelapor);
    console.log("\nPayload:");
    console.log(JSON.stringify(messageData, null, 2));
    console.log("==============================\n");

    // Send message data to webhook
    const response = await axios.post(config.WEBHOOK_URL, messageData);

    console.log("Message forwarded successfully:", {
      status: response.status,
      messageId: message.id,
      category: category,
      pelapor: pelapor,
      description: description,
    });
  } catch (error) {
    console.error("Error forwarding message:", {
      error: error.message,
      messageId: message.id,
      body: message.body,
    });
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
