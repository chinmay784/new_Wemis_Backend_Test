const mongoose = require('mongoose');

const sendActivationWalletToDistributorOrOemSchema = new mongoose.Schema({
    manufaturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    state:{
        type: String,
        trim: true,
    },
    partnerName:{
        type: String,
        trim: true,
    },
    distributorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor',
    },
    oemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OemModelSchema',
    },
    activationPlanId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wlpActivation',
    },
    sentWalletAmount:{
        type: Number,
        default: 0
    },
    sentStockQuantity:{
        type: Number,
        default: 0
    },
},{ timestamps: true });

module.exports = mongoose.model("sendActivationWalletToDistributorOrOem", sendActivationWalletToDistributorOrOemSchema);