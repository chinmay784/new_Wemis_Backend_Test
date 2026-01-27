const mongoose = require('mongoose');


const ManuFacturSchema = new mongoose.Schema({
    wlpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wlp',
    },
    country: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    manufactur_code: {
        type: String,
        trim: true
    },
    business_Name: {
        type: String,
        trim: true
    },
    gst_Number: {
        type: String,
        trim: true
    },
    Parent_WLP: {
        type: String,
        trim: true
    },
    manufacturer_Name: {
        type: String,
        trim: true
    },
    mobile_Number: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    toll_Free_Number: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    assign_element_list: {
        type: [
            {
                elementName: { type: String, trim: true },
                elementType: { type: String, trim: true },
                model_No: { type: String, trim: true },
                sim: { type: Number, default: 0 },
                device_Part_No: { type: String, trim: true },
                tac_No: { type: String, trim: true },
                cop_No: [{ type: String, trim: true }],
                voltage: { type: String, trim: true },
                copValidity: { type: String, trim: true },
                wlpId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wlp' },
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        },
        default: []
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

    // Activation Wallet reference
    activationWallets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "wlpActivation",
        }
    ],

    // ✅ Add ticket issues here
    ticketIssues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TicketIssue",
        }
    ],
});

module.exports = mongoose.model('ManuFactur', ManuFacturSchema);