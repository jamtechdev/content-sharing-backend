const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Received file: ", file.originalname);
  console.log("MIME type: ", file.mimetype);
  const acceptedMimeTypes = [
    "video/mp4",
    "video/mov",
    "video/mpeg",
    "video/webm",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/quicktime"
  ];
  if (acceptedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb("Supported file formats: .jpg, .jpeg, .png", false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = { upload };
