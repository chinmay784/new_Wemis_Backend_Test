const mongoose = require("mongoose");


const AddDevicePart = new mongoose.Schema({
    elementName: {
        type: String,
        trim: true,
    },
    elementType: {
        type: String,
        trim: true,
    },
    model_No: {
        type: String,
        trim: true,
    },
    device_Part_No: {
        type: String,
        trim: true,
    }
});


module.exports = mongoose.model("DevicePartNo",AddDevicePart);