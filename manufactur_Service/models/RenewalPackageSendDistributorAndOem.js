const mongoose = require('mongoose');

const RenewalPackageSendDistributorAndOem = new mongoose.Schema({
    senderManufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiverDistributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor"
    },
    receiverOemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OemModelSchema"
    },
    state: {
        type: String,
        trim: true,
    },
    NoOfPackageWallet: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    renewalPackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReneWalPackage"
    }
});

module.exports = mongoose.model("RenewalPackageSendDistributorAndOem", RenewalPackageSendDistributorAndOem)