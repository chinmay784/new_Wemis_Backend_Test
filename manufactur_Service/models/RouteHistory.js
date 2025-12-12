const mongoose = require("mongoose");

const RouteHistorySchema = new mongoose.Schema({
    imei: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    speed: Number,
    raw: Object,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RouteHistory", RouteHistorySchema);
