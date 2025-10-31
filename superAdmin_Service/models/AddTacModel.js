const mongoose = require('mongoose');

const AddTacNoSchema = new mongoose.Schema({
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
    },
    tac_No: {
        type: [String],   // <-- allows single or multiple strings
        trim: true,
    }
});

module.exports = mongoose.model("AddTacNo", AddTacNoSchema);