const mongoose = require("mongoose");


const addCopModel = new mongoose.Schema({
    elementName: {
        type: String,
        trim: true,
    },
    elementType: {
        type: String,
        trim: true,
    },
    sim: {
        type: Number,
        default: 0,
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
        type: String,
        trim: true,
    },
    cop_No: {
        type: [String],
        trim: true,
    },
    date: {
        type: [Date],
        trim: true,
    },
});


module.exports = mongoose.model("AddCopNo", addCopModel);