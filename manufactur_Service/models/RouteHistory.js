const mongoose = require("mongoose");

const RouteHistorySchema = new mongoose.Schema({
    imei: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    speed: Number,
    // raw: Object,
    raw: {
        headDegree: {
            type: Number,
            default: 0
        },
        ignition: {
            type: String,
            default: "0"
        },
        sosStatus: {
            type: String,
            default: "0"
        }
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: { expires: '2d' } // auto-delete after 2 days
    }
});

module.exports = mongoose.model("RouteHistory", RouteHistorySchema);
