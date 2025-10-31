const mongoose = require('mongoose');


const RollBackAlloCatedBarCodeSchema = new mongoose.Schema({
    state: {
        type: String,
        trim: true,
    },
    distributor: {
        type: String,
        trim: true,
    },
    deler: {
        type: String,
        trim: true,
    },
    element: {
        type: String,
        trim: true,
    },
    barCode_Type: {
        type: String,
        trim: true,
    },
    rollbackManuFacturId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManuFactur',
    },
    rollBackDelerId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RollBackAlloCatedBarCodeSchema', RollBackAlloCatedBarCodeSchema);