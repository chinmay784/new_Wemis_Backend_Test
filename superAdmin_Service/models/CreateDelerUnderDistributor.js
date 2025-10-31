const mongoose = require("mongoose");


const CreateDelerUnderDistributor = new mongoose.Schema({
    manufacturId: {
        type: mongoose.Types.ObjectId,
        ref: "ManuFactur"
    },
    distributorId: {
        type: mongoose.Types.ObjectId,
        ref: "Distributor"
    },
    select_Distributor_Name: {
        type: String,
        trim: true,
    },
    business_Name: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    date_of_birth: {
        type: String,
        trim: true,
    },
    age: {
        type: String,
        trim: true,
    },
    Is_Map_Device_Edit: {
        type: Boolean,
        default: false,
    },
    pan_Number: {
        type: String,
        trim: true,
    },
    occupation: {
        type: String,
        trim: true,
    },
    Advance_Payment: {
        type: Number,
        default: 0
    },
    languages_Known: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    district: {
        type: String,
        trim: true,
    },
    RTO_Division: {
        type: String,
        trim: true,
    },
    Pin_Code: {
        type: String,
        trim: true,
    },
    area: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    allocateBarcodes: [
        {
            manufacturId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ManuFactur"
            },
            elementName: { type: String, trim: true },
            elementType: { type: String, trim: true },
            elementModelNo: { type: String, trim: true },
            elementPartNo: { type: String, trim: true },
            elementTacNo: { type: String, trim: true },
            elementCopNo: { type: String, trim: true },
            copValid: { type: String, trim: true },
            voltage: { type: String, trim: true },
            batchNo: { type: String, trim: true },
            baecodeCreationType: { type: String, trim: true },
            barCodeNo: { type: String, trim: true },
            is_Renew: { type: String, trim: true },
            deviceSerialNo: { type: String, trim: true },
            status: { type: String },

            simDetails: [
                {
                    simNo: { type: String, trim: true },
                    iccidNo: { type: String, trim: true },
                    validityDate: { type: String, trim: true },
                    operator: { type: String, trim: true },
                }
            ]
        }
    ]
});


module.exports = mongoose.model("CreateDelerUnderDistributor", CreateDelerUnderDistributor)