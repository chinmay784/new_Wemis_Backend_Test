const mongoose = require('mongoose');


const allocateBarCodeSchema = new mongoose.Schema({
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    checkBoxValue: { type: String },
    // distributor: { type: String, trim: true },
    // oem: { type: String, trim: true },
    // deler: { type: String, trim: true },
    element: { type: String, trim: true },
    elementType: { type: String, trim: true },
    modelNo: { type: String, trim: true },
    Voltege: { type: String, trim: true },
    partNo: { type: String, trim: true },
    type: { type: String, trim: true },
    avaliableBarCode: [
        {
            type: String,
            trim: true,
        }
    ],
    allocatedBarCode: [
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
        // {trim:true}
    ],
    status: { type: String, trim: true, default: 'used' },
    createdAt: { type: Date, default: Date.now },
    manufacturAllocateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManuFactur' },
    allocatedDistributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' },
    allocatedOemId: { type: mongoose.Schema.Types.ObjectId, ref: 'OemModelSchema' },
    allocatedDelerId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'delerModelType'
    },
    delerModelType: {
        type: String,
        enum: ['CreateDelerUnderDistributor', 'createDelerUnderOems'], // possible models
    },
    delerName: {
        type: String, trim: true,
    }

});
module.exports = mongoose.model('AllocateBarCode', allocateBarCodeSchema);