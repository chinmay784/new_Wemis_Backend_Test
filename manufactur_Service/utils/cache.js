const NodeCache = require("node-cache");


const liveTrackingCache = new NodeCache({
    stdTTL: 100,        // ⏱ cache for 5 seconds update to 100
    checkperiod: 120,  // cleanup interval update to 120
    useClones: false
});

module.exports = liveTrackingCache;