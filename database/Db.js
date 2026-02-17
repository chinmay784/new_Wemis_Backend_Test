const mongoose = require('mongoose');
require('dotenv').config();

exports.connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin_db_user:qRAFrILPKo8LbL2m@cluster0.fn0tntx.mongodb.net/wemis");
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
};
// mongodb+srv://chinmaypuhan420:h6ZifhrYLbD0Ou4L@wemis.qcsdnfy.mongodb.net