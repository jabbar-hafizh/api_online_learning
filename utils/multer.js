const multer = require('multer');
const path = require('path');

const response = require('./response');

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    ext = ext.toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
