const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'wlp', 'manufacturer', 'distibutor', 'oem', 'dealer-distributor', 'technicien', 'coustmer', 'dealer-oem'],
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    wlpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wlp',
    },
    manufacturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor',
    },
    oemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OemModelSchema',
    },
    distributorDelerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreateDelerUnderDistributor',
    },
    oemsDelerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'createDelerUnderOems',
    },
    technicienId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technicien',
    },
    coustmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoustmerDevice',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('User', UserSchema);