const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
    superAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name_of_business: {
        type: String,
    },
    Regd_Address: {
        type: String,
    },
    Gstin_No: {
        type: String,
    },
    Pan_no: {
        type: String,
    },
    Name_of_Business_owner: {
        type: String,
    },
    Email: {
        type: String,
        unique: true
    },
    Contact_No: {
        type: String,
    },
    GST_Certificate: {
        type: String,
    },
    Pan_Card: {
        type: String,
    },
    Incorporation_Certificate: {
        type: String,
    },
    Company_Logo: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    assign_element_list: {
        type: [
            {
                elementName: { type: String, trim: true },
                elementType: { type: String, trim: true },
                sim:{type: Number,default:0},
                model_No: { type: String, trim: true },
                device_Part_No: { type: String, trim: true },
                tac_No: { type: String, trim: true },
                cop_No: [{ type: String, trim: true }],
                voltage: { type: String, trim: true },
                copValidity: { type: String, trim: true},
            }
        ],
        default: []
    }
});

module.exports = mongoose.model("Admin", AdminSchema)