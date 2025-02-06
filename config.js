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
    ".l1": "CM",
    ".l3": "PM",
  },

  // Default evidence URL
  DEFAULT_EVIDENCE_URL: "",

  // WhatsApp client configuration
  CLIENT_OPTIONS: {
    authStrategy: "local",
    puppeteer: {
      args: ["--no-sandbox"],
    },
  },

  // Response messages - will be randomly selected when replying to users
  RESPONSE_MESSAGES: [
    "Makasih ya Kak {name}! Sudah Aya catat laporannya dengan baik 📝",
    "Oke Kak {name}, informasinya sudah Aya catat ya! Makasih banyak 📋",
    "Siap Kak {name}! Laporan sudah Aya dokumentasikan dengan baik 📓",
    "Noted ya Kak {name}! Makasih banyak atas informasinya 📊",
    "Baik Kak {name}, sudah Aya catat semua informasinya ya 📑",
    "Terima kasih Kak {name}! Aya sudah mencatat laporannya dengan lengkap ✍️",
    "Aya sudah mencatat semua info dari Kak {name}, terima kasih ya 📎",
    "Laporan dari Kak {name} sudah Aya catat dengan baik, makasih banyak 📒",
    "Makasih infonya Kak {name}! Sudah Aya masukkan ke catatan ya 📃",
    "Noted dengan baik ya Kak {name}! Makasih atas laporannya 📘",
    "Aya udah catat ya Kak {name}! Terima kasih infonya 📖",
    "Info dari Kak {name} sudah Aya dokumentasikan dengan rapih 📚",
    "Makasih banyak Kak {name}, Aya udah catat semuanya ya 📜",
    "Oke siap Kak {name}! Aya catat dulu ya laporannya 📋",
    "Noted banget nih Kak {name}! Aya simpan infonya ya 📝",
    "Nuhun Kak {name}! Aya udah catat laporannya dengan lengkap 📓",
    "Wah makasih Kak {name}, sudah Aya masukkan ke catatan nih 📔",
    "Aya catat dulu ya Kak {name}! Makasih banyak infonya 📕",
    "Siap Kak {name}! Aya simpan dulu laporannya ya 📗",
    "Info dari Kak {name} sudah Aya dokumentasikan ya, thank you! 📙",
    "Makasih banyak nih Kak {name}! Aya udah simpan semuanya 📄",
    "Catatan dari Kak {name} sudah Aya terima dengan baik ya ✏️",
    "Oke Kak {name}, Aya udah catat semuanya dengan lengkap 📌",
    "Noted Kak {name}! Aya simpan dulu laporannya ya, makasih 📍",
    "Baik Kak {name}, Aya dokumentasikan dulu ya infonya 📎",
    "Makasih nih Kak {name}! Aya catat semua laporannya ya ✍️",
    "Aya udah terima catatannya ya Kak {name}, thank you! 📝",
    "Info dari Kak {name} sudah Aya catat dengan baik ya 📚",
    "Siap Kak {name}! Aya udah simpan semuanya dengan rapih ✨",
    "Makasih banyak Kak {name}! Aya udah catat semuanya ya 📋",
  ],
};

module.exports = config;
