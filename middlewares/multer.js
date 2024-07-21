
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: './public' })


console.log(__dirname , "inside multer");
const uploadDir = path.join(__dirname, "../public");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const uploadFile = multer({ storage: storage });

module.exports = uploadFile;