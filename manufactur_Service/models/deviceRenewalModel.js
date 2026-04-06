const mongoose = require("mongoose");

const DeviceRenewal = new mongoose.Schema({
    deviceActivationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeviceActivation",
        required: true
    },
    vechileNo: {
        type: String,
        required: true,
    },
    vechileType: {
        type: String,
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // ✅ Changed from Number → Date
    startDate: {
        type: Date,
    },
    expiryDate: {
        type: Date,
    },
    billingCycle: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["UPI", "Net Banking", "Card Payment", "Wallet Payment", "Other"],
        required: true,
    },
    utrNo: {
        type: String,
        required: true,
    },
    // also add Status field to track the renewal status
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
});

module.exports = mongoose.model("DeviceRenewal", DeviceRenewal)