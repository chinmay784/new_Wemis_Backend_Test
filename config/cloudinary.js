// const cloudinary = require('cloudinary').v2;
// const dotenv = require('dotenv');   
// dotenv.config();
// const {CloudinaryStorage} = require('multer-storage-cloudinary');
// const multer = require("multer");

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'profile_pics',
//         allowed_formats: ['jpg', 'png', 'jpeg'],
//     },
// });


// const upload = multer({ storage });

// module.exports = { cloudinary, upload };
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');   
dotenv.config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = 'profile_pics';
        let allowed_formats = ['jpg', 'png', 'jpeg', 'pdf'];

        // Auto-detect resource type: 'image' for images, 'raw' for PDFs
        let resource_type = file.mimetype === 'application/pdf' ? 'raw' : 'image';

        return {
            folder,
            allowed_formats,
            resource_type
        };
    },
});

// File filter for safety
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and PDF files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = { cloudinary, upload };
