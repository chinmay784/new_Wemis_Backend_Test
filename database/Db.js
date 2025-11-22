const mongoose = require('mongoose');
require('dotenv').config();

exports.connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://chinmaypuhan420:h6ZifhrYLbD0Ou4L@wemis.qcsdnfy.mongodb.net/wemis");
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
};