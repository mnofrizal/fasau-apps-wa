// Load environment variables for Cloudinary
const config = {
  // Webhook configuration
  WEBHOOK_URL: process.env.WEBHOOK_URL,

  // Cloudinary configuration
  CLOUDINARY: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  // Message prefixes and their categories
  MESSAGE_TYPES: {
    ".l1": "CM",
    ".l2": "PM",
    ".l3": "AC",
    ".l4": "MK",
    ".l5": "TIJ",
    ".l6": "TDP",
    ".l7": "JSI",
    ".l8": "PMT",
    ".l9": "PST",
  },

  // Default evidence URL
  DEFAULT_EVIDENCE_URL: "",

  // WhatsApp client configuration
  CLIENT_OPTIONS: {
    authStrategy: "local",
    puppeteer: {
      args: ["--no-sandbox"],
      userDataDir: "./whatsapp-sessions/browser", // Chrome user data directory
    },
    dataPath: "./whatsapp-sessions/auth", // Directory to store auth data
    restartOnAuthFail: true, // Restart client on auth failure
    takeoverOnConflict: false, // Don't take over existing sessions
    ffmpegPath: null, // For media handling
  },

  // Message templates for different use cases
  MESSAGE_TEMPLATES: {
    fasauSendTaskToGrup2: {
      title: "🎯 *TUGAS BARU*",
      format: `
🎯 *TUGAS BARU*
------------------
📋 *Task*: {title}
📝 *Detail*: {keterangan}
👤 *PIC*: {pic}
⏰ *Due Date*: {dueDate}
------------------
_Mohon segera ditindaklanjuti. Terima kasih!_`,
    },
    fasauSendTaskToGrup: {
      title: "🎯 *LAPORAN BARU*",
      format: `
🎯 *LAPORAN BARU {count}*
----------------------------------
➡️ *Tugas*: {title}
ℹ️ *Detail*: {keterangan}
----------------------------------
_Mohon segera ditindaklanjuti. Terima kasih!_`,
    },
  },

  // Response messages - will be randomly selected when replying to users
  RESPONSE_MESSAGES_CM: [
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
    "Laporan dari Kak {name} sudah Aya simpan dengan baik, terima kasih 📂",
    "Terima kasih Kak {name}! Informasi sudah Aya catat dengan lengkap 📜",
    "Oke Kak {name}, semua sudah tercatat dengan baik ya! Makasih 📒",
    "Siap Kak {name}! Laporan sudah masuk ke catatan Aya 📑",
    "Noted Kak {name}! Terima kasih atas informasinya 📊",
    "Baik Kak {name}, semua sudah tercatat dengan lengkap 📋",
    "Terima kasih Kak {name}! Laporan sudah Aya simpan dengan baik 📎",
    "Aya sudah mencatat semua info dari Kak {name}, makasih banyak 📓",
    "Laporan dari Kak {name} sudah Aya dokumentasikan dengan baik 📘",
    "Makasih infonya Kak {name}! Sudah Aya catat dengan lengkap 📃",
    "Noted dengan baik ya Kak {name}! Makasih atas laporannya 📚",
    "Aya udah catat ya Kak {name}! Terima kasih infonya 📖",
    "Info dari Kak {name} sudah Aya dokumentasikan dengan rapih 📜",
    "Makasih banyak Kak {name}, Aya udah catat semuanya ya 📂",
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
    "Laporan dari Kak {name} sudah Aya simpan dengan baik, terima kasih 📂",
    "Terima kasih Kak {name}! Informasi sudah Aya catat dengan lengkap 📜",
    "Oke Kak {name}, semua sudah tercatat dengan baik ya! Makasih 📒",
    "Siap Kak {name}! Laporan sudah masuk ke catatan Aya 📑",
    "Noted Kak {name}! Terima kasih atas informasinya 📊",
    "Baik Kak {name}, semua sudah tercatat dengan lengkap 📋",
    "Terima kasih Kak {name}! Laporan sudah Aya simpan dengan baik 📎",
    "Aya sudah mencatat semua info dari Kak {name}, makasih banyak 📓",
    "Laporan dari Kak {name} sudah Aya dokumentasikan dengan baik 📘",
    "Makasih infonya Kak {name}! Sudah Aya catat dengan lengkap 📃",
    "Noted dengan baik ya Kak {name}! Makasih atas laporannya 📚",
    "Aya udah catat ya Kak {name}! Terima kasih infonya 📖",
    "Info dari Kak {name} sudah Aya dokumentasikan dengan rapih 📜",
    "Makasih banyak Kak {name}, Aya udah catat semuanya ya 📂",
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

  // Response messages for Preventive Maintenance - will be randomly selected when replying to users
  RESPONSE_MESSAGES_PM: [
    "Terima kasih Kak {name}! Laporan _Preventive Maintenance_ (PM) sudah Aya catat 🛠️",
    "Oke Kak {name}, informasi _Preventive Maintenance_ (PM) sudah Aya catat ya! Makasih banyak 📝",
    "Siap Kak {name}! Laporan _Preventive Maintenance_ (PM) sudah Aya dokumentasikan dengan baik 📋",
    "Noted ya Kak {name}! Makasih banyak atas informasi terkait _Preventive Maintenance_nya (PM) 📊",
    "Baik Kak {name}, sudah Aya catat semua informasi _Preventive Maintenance_ (PM) ya 📑",
    "Terima kasih Kak {name}! Aya sudah mencatat laporan _Preventive Maintenance_ (PM) dengan lengkap ✍️",
    "Aya sudah mencatat semua info _Preventive Maintenance_ (PM) dari Kak {name}, terima kasih ya 📎",
    "Laporan _Preventive Maintenance_ (PM) dari Kak {name} sudah Aya catat dengan baik, makasih banyak 📒",
    "Makasih infonya Kak {name}! Sudah Aya masukkan ke catatan _Preventive Maintenance_ (PM) ya 📃",
    "Noted dengan baik ya Kak {name}! Makasih atas laporannya terkait _Preventive Maintenance_ (PM) 📘",
    "Aya udah catat ya Kak {name}! Terima kasih infonya tentang _Preventive Maintenance_ (PM) 📖",
    "Info _Preventive Maintenance_ (PM) dari Kak {name} sudah Aya dokumentasikan dengan rapih 📚",
    "Makasih banyak Kak {name}, Aya udah catat semua laporan _Preventive Maintenance_nya (PM) 📜",
    "Oke siap Kak {name}! Aya catat dulu ya laporannya tentang _Preventive Maintenance_ (PM) 📋",
    "Noted banget nih Kak {name}! Aya simpan infonya ya tentang _Preventive Maintenance_ (PM) 📝",
    "Nuhun Kak {name}! Aya udah catat laporan terkait _Preventive Maintenance_ (PM) dengan lengkap 📓",
    "Wah makasih Kak {name}, sudah Aya masukkan ke catatan _Preventive Maintenance_ (PM) nih 📔",
    "Aya catat dulu ya Kak {name}! Makasih banyak info tentang _Preventive Maintenancenya_ (PM) 📕",
    "Siap Kak {name}! Laporan _Preventive Maintenance_ (PM) sudah Aya simpan 📗",
    "Informasi dari Kak {name} terkait _Preventive Maintenance_ (PM) sudah Aya dokumentasikan, terima kasih! 📙",
    "Terima kasih banyak Kak {name}! Semua data terkait _Preventive Maintenance_ (PM) sudah Aya simpan 📄",
    "Catatan dari Kak {name} sudah Aya terima dengan baik terkait _Preventive Maintenance_ (PM) ✏️",
    "Oke Kak {name}, semua informasi terkait _Preventive Maintenance_ (PM) sudah Aya catat dengan lengkap 📌",
    "Noted Kak {name}! Laporan terkait _Preventive Maintenance_ (PM) sudah Aya simpan, terima kasih 📍",
    "Baik Kak {name}, informasi terkait _Preventive Maintenance_ (PM) sudah Aya dokumentasikan 📎",
    "Terima kasih Kak {name}! Semua laporan terkait _Preventive Maintenance_ (PM) sudah Aya catat ✍️",
    "Catatan terkait _Preventive Maintenance_ (PM) dari Kak {name} sudah Aya terima, terima kasih! 📝",
    "Informasi terkait _Preventive Maintenance_ (PM) dari Kak {name} sudah Aya catat dengan baik!  📚",
    "Siap Kak {name}! Semua data terkait  _Preventive Maintenance_ (PM) sudah Aya simpan dengan rapi ✨",
    "Terima kasih banyak Kak {name}! Semua catatan terkait _Preventive Maintenance_ (PM) sudah Aya catat 📋",
  ],
};

module.exports = config;
