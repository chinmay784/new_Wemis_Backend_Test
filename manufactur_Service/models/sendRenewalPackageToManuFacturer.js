const mongoose = require("mongoose");

const sendRenewalPackageToManufacturer = new mongoose.Schema({
    state:{
        type:String,
        trim:true,
    },
    wlpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wlp"
    },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManuFactur"
    },
    renewalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReneWalPackage"
    }
})

module.exports = mongoose.model("sendRenewalPackageToManufacturer", sendRenewalPackageToManufacturer)