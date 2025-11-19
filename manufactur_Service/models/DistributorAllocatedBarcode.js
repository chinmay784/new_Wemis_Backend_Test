const mongoose = require('mongoose');

const DistributorAllocatedBarcodeSchema = new mongoose.Schema({
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    element: { type: String, trim: true },

    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor",
        required: true
    },

    allocatedDelerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreateDelerUnderDistributor",
        required: true
    },

    status: { type: String, default: "active" },

    // FULL BARCODE OBJECT STORED HERE
    allocatedBarcode: [
        {
            manufacturId: { type: mongoose.Schema.Types.ObjectId },
            elementName: String,
            elementType: String,
            elementModelNo: String,
            elementPartNo: String,
            elementTacNo: String,
            elementCopNo: String,
            copValid: String,
            voltage: String,
            batchNo: String,
            baecodeCreationType: String,
            barCodeNo: String,
            is_Renew: String,
            deviceSerialNo: String,
            simDetails: Array,
            status: String
        }
    ],

    delerName: { type: String, trim: true },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DistributorAllocateBarcode", DistributorAllocatedBarcodeSchema);
