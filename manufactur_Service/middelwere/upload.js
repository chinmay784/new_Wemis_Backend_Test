// // middleware/upload.js
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const Upload = multer({
//   storage: storage,
// });

// module.exports = Upload;




// middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Create uploads folder automatically
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const Upload = multer({
    storage: storage,
});

module.exports = Upload;