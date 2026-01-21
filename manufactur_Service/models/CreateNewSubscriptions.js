const mongoose = require('mongoose');
const { create } = require('./CreateDistributor');



const createSubscription = new mongoose.Schema({
    manuFacturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    wlpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wlp',
    },
    elementName: {
        type: String,
        trim: true,
    },
    elementNameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddCopNo"
    },
    packageType: {
        type: String,
        trim: true,
    },
    billingCycle: {
        type: String,
        trim: true,
    },
    packageName: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true,
    },
    renewal: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("createSubscription", createSubscription);