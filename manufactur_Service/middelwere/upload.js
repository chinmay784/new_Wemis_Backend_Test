




// // middleware/upload.js

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // ✅ Create uploads folder automatically
// if (!fs.existsSync("uploads")) {
//     fs.mkdirSync("uploads");
// }

// const storage = multer.diskStorage({

//     destination: function (req, file, cb) {

//         cb(null, "uploads/");
//     },

//     filename: function (req, file, cb) {

//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const Upload = multer({
//     storage: storage,
// });

// module.exports = Upload;






const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Create uploads folder automatically
const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const Upload = multer({
    storage: storage,
});

module.exports = Upload;