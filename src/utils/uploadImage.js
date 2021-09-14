const multer = require("multer");

let fileStorage = multer.diskStorage({
  destination: "./src/uploader",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
let upload = multer({ storage: fileStorage }).single("image");

module.exports = upload;
