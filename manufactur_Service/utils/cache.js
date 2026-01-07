const NodeCache = require("node-cache");


const liveTrackingCache = new NodeCache({
    stdTTL: 5,        // ⏱ cache for 5 seconds
    checkperiod: 10,  // cleanup interval
    useClones: false
});

module.exports = liveTrackingCache;