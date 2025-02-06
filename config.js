const config = {
  // Webhook configuration
  WEBHOOK_URL: process.env.WEBHOOK_URL || "http://localhost:3000/webhook",

  // Message prefixes and their categories
  MESSAGE_TYPES: {
    ".l2": "CM",
    ".l3": "PM",
  },

  // Default evidence URL
  DEFAULT_EVIDENCE_URL: "http://fwf.fwf/image.jpg",

  // WhatsApp client configuration
  CLIENT_OPTIONS: {
    authStrategy: "local",
    puppeteer: {
      args: ["--no-sandbox"],
    },
  },
};

module.exports = config;
