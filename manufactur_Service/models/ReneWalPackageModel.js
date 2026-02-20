const mongoose = require("mongoose");

const ReneWalPackage = new mongoose.Schema({
    wlpCreatedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wlp"
    },
    elementName: {
        type: String,
        trim: true,
    },
    packageName: {
        type: String,
        trim: true,
    },
    packageType: {
        type: String,
        trim: true,
    },
    billingCycle: {
        type: Number,
        // trim: true,
    },
    price: {
        type: Number,
        default: 0
    },
    // Some Changes On price related fields
    distributorAndOemMarginPrice: {
        type: Number,
        default: 0
    },
    delerMarginPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("ReneWalPackage", ReneWalPackage)