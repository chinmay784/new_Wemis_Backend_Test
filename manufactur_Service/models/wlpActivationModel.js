const mongoose = require('mongoose');

const wlpActivationSchema = new mongoose.Schema({
    wlpCreatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wlp',
    },
    activationStatus: {
        type: Boolean,
        default: false
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
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        default: 0
    },
    // Some Changes On price related fields
    distributorAndOemMarginPrice:{
        type: Number,
        default: 0
    },
    delerMarginPrice:{
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("wlpActivation", wlpActivationSchema);