const mongoose = require('mongoose');

const coustmerDeviceSchema = new mongoose.Schema({
    manufacturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    delerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreateDelerUnderDistributor',
        default: null
    },
    fullName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    mobileNo: {
        type: String,
        trim: true,
    },
    GstinNo: {
        type: String,
        trim: true,
    },
    Customercountry: {
        type: String,
        trim: true,
    },
    Customerstate: {
        type: String,
        trim: true,
    },
    Customerdistrict: {
        type: String,
        trim: true,
    },
    Rto: {
        type: String,
        trim: true,
    },
    PinCode: {
        type: String,
        trim: true,
    },
    CompliteAddress: {
        type: String,
        trim: true,
    },
    AdharNo: {
        type: String,
        trim: true,
    },
    PanNo: {
        type: String,
        trim: true,
    },
    devicesOwened: [
        {
            deviceType: { type: String, trim: true },
            deviceNo: { type: String, trim: true },
            voltage: { type: String, trim: true },
            elementType: { type: String, trim: true },
            batchNo: { type: String, trim: true },

            simDetails: [{
                simNo: String,
                iccidNo: String,
                validityDate: String,
                operator: String
            }],

            Packages: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "createSubscription",
            },
            
            VechileBirth: { type: String, trim: true },
            RegistrationNo: { type: String, trim: true },
            date: { type: String, trim: true },
            ChassisNumber: { type: String, trim: true },
            EngineNumber: { type: String, trim: true },
            VehicleType: { type: String, trim: true },
            MakeModel: { type: String, trim: true },
            ModelYear: { type: String, trim: true },
            InsuranceRenewDate: { type: String, trim: true },
            PollutionRenewdate: { type: String, trim: true },
        }
    ],
});

module.exports = mongoose.model('CoustmerDevice', coustmerDeviceSchema);