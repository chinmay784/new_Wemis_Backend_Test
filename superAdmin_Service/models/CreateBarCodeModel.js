const mongoose = require("mongoose");


const createBarCode = new mongoose.Schema({
    manufacturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    elementName: {
        type: String,
        trim: true,
    },
    elementType: {
        type: String,
        trim: true,
    },
    elementModelNo: {
        type: String,
        trim: true,
    },
    elementPartNo: {
        type: String,
        trim: true,
    },
    elementTacNo: {
        type: String,
        trim: true,
    },
    elementCopNo: {
        type: String,
        trim: true,
    },
    copValid: {
        type: String,
        trim: true,
    },
    voltage: {
        type: String,
        trim: true,
    },
    batchNo: {
        type: String,
        trim: true,
    },
    baecodeCreationType: {
        type: String,
        trim: true,
    },
    barCodeNo: {
        type: String,
        trim: true,
    },
    is_Renew: {
        type: String,
        trim: true,
    },
    deviceSerialNo: {
        type: String,
        trim: true,
    },
    simDetails: [{
        simNo: String,
        iccidNo: String,
        validityDate: String,
        operator: String
    }],
    status: {
        type: String,
        enum: ["used", "active", "allocated"],
        default: "active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model("createBarCode", createBarCode);