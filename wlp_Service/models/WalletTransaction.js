const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({

    // 🔗 ENTITY REFERENCES (only ONE will be present)
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManuFactur",
        default: null
    },

    wlpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wlp",
        default: null
    },

    oemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Oem",
        default: null
    },

    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor",
        default: null
    },

    dealerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dealer",
        default: null
    },

    // 💰 TRANSACTION DETAILS
    type: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    balanceAfter: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    reason: {
        type: String,
        trim: true // Recharge, Subscription, Activation, Penalty
    },

    referenceId: {
        type: String // invoiceId, orderId, txnId
    },

    createdBy: {
        type: String, // Admin / System / Auto
        default: "System"
    }

}, { timestamps: true });

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
