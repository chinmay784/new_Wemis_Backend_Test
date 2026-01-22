const mongoose = require("mongoose");

const sendActivationWalletToManuFacturerSchema = new mongoose.Schema({
    state: {
        type: String,
        trim: true,
    },
    manufacturer: {
        type: String,
        trim: true,
    },
    elementType: {
        type: String,
        trim: true,
    },
    element: {
        type: String,
        trim: true,
    },
    noOfActivationWallets: {
        type: Number,
        default: 0
    },
    activationWallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wlpActivation',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("sendActivationWalletToManuFacturer", sendActivationWalletToManuFacturerSchema);