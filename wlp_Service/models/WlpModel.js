const mongoose = require('mongoose');


const WlpSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    country: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    defaultLanguage: {
        type: String,
        trim: true,
    },
    organizationName: {
        type: String,
        trim: true,
    },
    mobileNumber: {
        type: String,
        trim: true,
    },
    salesMobileNumber: {
        type: String,
        trim: true,
    },
    landLineNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    appPackage: {
        type: String,
        trim: true,
    },
    showPoweredBy: {
        type: String,
        default: "yes",
    },
    accountLimit: {
        type: Number,
        default: 0,
    },
    smsGatewayUrl: {
        type: String,
        trim: true,
    },
    smsGatewayMethod: {
        type: String,
        trim: true,
    },
    gstinNumber: {
        type: String,
        trim: true,
    },
    billingEmail: {
        type: String,
        trim: true,
    },
    websiteUrl: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
    },
    address: {
        type: String,
        trim: true,
    },
    // wallet logic Model reference
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "INR"
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    assign_element_list: {
        type: [
            {
                elementName: { type: String, trim: true },
                elementType: { type: String, trim: true },
                sim: { type: Number, default: 0 },
                model_No: { type: String, trim: true },
                device_Part_No: { type: String, trim: true },
                tac_No: { type: String, trim: true },
                cop_No: [{ type: String, trim: true }],
                voltage: { type: String, trim: true },
                copValidity: { type: String, trim: true },
                adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        },
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});
module.exports = mongoose.model('Wlp', WlpSchema);