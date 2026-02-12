const mongoose = require("mongoose");

const sendActivationWalletToDistDelerOrOemDeler = new mongoose.Schema({
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor',
    },
    oemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OemModelSchema',
    },
    distDelerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreateDelerUnderDistributor',
    },
    oemDelerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'createDelerUnderOems',
    },
    state: {
        type: String,
        trim: true,
    },
    partnerName: {
        type: String,
        trim: true,
    },
    activationPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wlpActivation',
    },
    sentWalletAmount: {
        type: Number,
        default: 0
    },
    sentStockQuantity: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model("SendWalletToDistDelerAndOemDeler",sendActivationWalletToDistDelerOrOemDeler)