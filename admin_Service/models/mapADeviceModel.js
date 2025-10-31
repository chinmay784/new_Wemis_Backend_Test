const mongoose = require("mongoose");

const mapDeviceSchema = new mongoose.Schema({
    manufacturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManuFactur"
    },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    distributorName: { type: String, trim: true },
    delerName: { type: String, trim: true },

    // Device Info
    deviceType: { type: String, trim: true },
    deviceNo: { type: String, trim: true },
    voltage: { type: String, trim: true },
    elementType: { type: String, trim: true },
    batchNo: { type: String, trim: true },

    // SIM Info
    simDetails: [{
        simNo: String,
        iccidNo: String,
        validityDate: String,
        operator: String
    }],

    // Vehicle Info
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

    // Customer Info
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    mobileNo: { type: String, trim: true },
    GstinNo: { type: String, trim: true },
    Customercountry: { type: String, trim: true },
    Customerstate: { type: String, trim: true },
    Customerdistrict: { type: String, trim: true },
    Rto: { type: String, trim: true },
    PinCode: { type: String, trim: true },
    CompliteAddress: { type: String, trim: true },
    AdharNo: { type: String, trim: true },
    PanNo: { type: String, trim: true },

    // ✅ Packages (Array of Subdocuments)
    // Packages:
    // {
    //     packageId: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "createSubscription", // reference to your Package model
    //         // required: true
    //     },
    //     packageName: { type: String, trim: true },
    //     packageType: { type: String, trim: true },
    //     billingCycle: { type: String, trim: true }, // e.g. "30 days"
    //     price: { type: Number, default: 0 },
    //     // startDate: { type: String, trim: true },
    //     // endDate: { type: String, trim: true },
    //     // status: { type: String, enum: ["active", "expired", "pending"], default: "active" }
    // },

    // ✅ Packages (embedded object)
    Packages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "createSubscription",
    },

    // Installation Detail
    InvoiceNo: { type: String, trim: true },
    VehicleKMReading: { type: Number, default: 0 },
    DriverLicenseNo: { type: String, trim: true },
    MappedDate: { type: String, trim: true },
    NoOfPanicButtons: { type: Number, default: 0 },

    // Vehicle Document (* document)
    VechileIDocument: {
        type: String, trim: true
    },
    RcDocument: { type: String, trim: true },
    DeviceDocument: { type: String, trim: true },
    PanCardDocument: { type: String, trim: true },
    AdharCardDocument: { type: String, trim: true },
    InvoiceDocument: { type: String, trim: true },
    SignatureDocument: { type: String, trim: true },
    PanicButtonWithSticker: { type: String, trim: true },
});

module.exports = mongoose.model("MapDevice", mapDeviceSchema);
