const mongoose = require("mongoose");

const requestForActivationWalletSchema = new mongoose.Schema({
    manufaturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    distributorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor',
    },
    oemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OemModelSchema',
    },
    DistributordelerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreateDelerUnderDistributor',
    },
    oemDelerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'createDelerUnderOems',
    },
    requestedWalletCount: {
        type: Number,
        default: 0
    },
    requestStatus: {
        type: String,
        trim: true,
        default: "pending"
    },
    // partnerType:{
    //     type: String,
    //     trim: true,
    // },
    activationPlanId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wlpActivation',
    }
});

module.exports = mongoose.model("requestForActivationWallet", requestForActivationWalletSchema);