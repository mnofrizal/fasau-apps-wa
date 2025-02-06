// Load environment variables for Cloudinary
const config = {
  // Webhook configuration
  WEBHOOK_URL: process.env.WEBHOOK_URL || "http://localhost:3900/api/v1/report",

  // Cloudinary configuration
  CLOUDINARY: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

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
