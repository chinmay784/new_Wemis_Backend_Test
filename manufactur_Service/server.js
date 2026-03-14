
// // ============================================
// // 📁 server.js (Main Entry Point)
// /// File: server.js

// // manufacturer/server.js

// const express = require("express");
// const net = require("net");
// const { connectToDatabase } = require("./dataBase/db");
// const { connectProducer, sendRoutePoint } = require("./KAFKA/producer")

// // ✅ Shared In-Memory Store
// const devices = require("./devicesStore");

// // Routers
// const manufacturerRouter = require("./routes/manuFacturRoute");
// const superAdminRouter = require("./routes/superAdminRoute");

// // Mongo Model for Route Playback
// const RouteHistory = require("./models/RouteHistory");


// const app = express();
// const HTTP_PORT = 4004;
// const TCP_PORT = 4005;

// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// app.use("/", manufacturerRouter, superAdminRouter);

// let buffer = ""; // global streaming buffer


// // ================================
// //  AUTO SAVE ROUTE HISTORY FUNCTION
// // ================================
// async function saveToRouteHistory(parsed) {
//   try {
//     if (!parsed || !parsed.deviceId) return;

//     await RouteHistory.create({
//       imei: parsed.deviceId,
//       latitude: parsed.lat,
//       longitude: parsed.lng,
//       speed: parsed.speed,
//       raw: parsed,
//       timestamp: parsed.lastUpdate || new Date()
//     });

//     console.log(`📍 Route point saved for IMEI: ${parsed.deviceId}`);
//   } catch (err) {
//     console.log("❌ Route Save Error:", err.message);
//   }
// }

// // (async () => {
// //   await connectProducer();
// // })();

// // =========================================
// // ✅ TCP SERVER (Traxo GPS Devices)
// // =========================================
// const tcpServer = net.createServer(socket => {
//   console.log("📡 Device Connected:", socket.remoteAddress);

//   socket.on("data", (data) => {
//     const ascii = data.toString("utf8");

//     console.log("====================================");
//     console.log("📥 RAW ASCII:", data.toString("utf8"));
//     console.log("📥 RAW HEX:", data.toString("hex").toUpperCase());
//     console.log("📥 BUFFER LENGTH:", data.length);
//     console.log("====================================");

//     // 🔥 BLOCK HTTP SCANNERS
//     if (ascii.includes("GET") || ascii.includes("HTTP")) {
//       console.log("❌ HTTP Scanner Blocked");
//       return socket.destroy();
//     }

//     // ✅ Append to buffer (device sends without newline)
//     buffer += ascii;

//     // ✅ Check if buffer contains a PVT packet
//     if (buffer.includes("$PVT")) {
//       const start = buffer.indexOf("$PVT");
//       let end = buffer.indexOf("\n", start);

//       if (end === -1) {
//         // No newline — maybe single full packet
//         end = buffer.length;
//       }

//       const packet = buffer.slice(start, end).trim();

//       console.log("📥 RAW PACKET:", packet);
//       console.log("Time -", new Date().toLocaleString());


//       const parsed = parsePvtPacket(packet);

//       if (parsed && parsed.deviceId) {
//         devices[parsed.deviceId] = parsed;
//         console.log("✅ UPDATED DEVICE:", parsed.deviceId);


//         // 🔥 AUTO SAVE TO DB FOR ROUTE PLAYBACK
//         saveToRouteHistory(parsed);
//         // sendRoutePoint(parsed);
//         console.log("Time -", new Date().toLocaleString());

//       }

//       // ✅ Remove processed packet from buffer
//       buffer = buffer.slice(end);
//     }

//     // ✅ Prevent buffer overflow
//     if (buffer.length > 5000) buffer = "";
//   });

//   socket.on("end", () => console.log("❌ Device Disconnected"));
//   socket.on("error", (err) => console.log("🚨 TCP ERROR:", err.message));
// });

// tcpServer.listen(TCP_PORT, () => {
//   console.log(`🚀 TCP Server running on port ${TCP_PORT}`);
// });

// app.listen(HTTP_PORT, () => {
//   console.log(`🌍 HTTP Server running on port ${HTTP_PORT}`);
// });

// connectToDatabase();

// // =========================================
// // ✅ PARSER FOR ASCII PVT PACKET
// // =========================================
// function parsePvtPacket(packet) {
//   try {
//     const parts = packet.split(",");

//     if (parts.length < 10) return null; // not enough fields
//     console.log("speed For Normal", parseFloat(parts[15]) || 0);
//     console.log("speed for Trunc", Math.trunc(parseFloat(parts[15])) || 0);

//     return {
//       deviceId: parts[6] || "unknown",     // IMEI
//       packetHeader: parts[0] || null,
//       vendorId: parts[1] || null,
//       firmware: parts[2] || null,
//       packetType: parts[3] || null,
//       alertId: parts[4] || null,
//       packetStatus: parts[5] || null,
//       imei: parts[6] || null,
//       vehicleNo: parts[7] || null,
//       gpsFix: parts[8] || null,
//       date: parts[9] || null,
//       time: parts[10] || null,
//       lat: parseFloat(parts[11]) || null,
//       latDir: parts[12] || null,
//       lng: parseFloat(parts[13]) || null,
//       lngDir: parts[14] || null,
//       speed: Math.trunc(parseFloat(parts[15])) || 0,
//       headDegree: parts[16] || null,
//       satellites: parts[17] || null,
//       altitude: parts[18] || null,
//       pdop: parts[19] || null,
//       hdop: parts[20] || null,
//       networkOperator: parts[21] || null,
//       ignition: parts[22] || null,
//       mainsPowerStatus: parts[23] || null,
//       mainsVoltage: parts[24] || null,
//       batteryVoltage: parts[25] || null,
//       sosStatus: parts[26] || null,
//       tamperAlert: parts[27] || null,
//       gsmSignal: parts[28] || null,
//       mcc: parts[29] || null,
//       mnc: parts[30] || null,
//       lac: parts[31] || null,
//       cellId: parts[32] || null,
//       // add more indexes if your packet has them
//       timestamp: new Date().toISOString(),
//       lastUpdate: new Date()
//     };
//   } catch (e) {
//     console.log("❌ PVT Parse Error:", e.message);
//     return null;
//   }
// }




// ============================================
// 📁 server.js (Updated for per-user live tracking)
// ============================================

// ============================================
// SERVER.JS - LIVE GPS TRACKING
// ============================================
// This is 2 nd after fix the socket.io issue

// const express = require("express");
// const http = require("http");
// const net = require("net");
// const { connectToDatabase } = require("./dataBase/db");
// const RouteHistory = require("./models/RouteHistory");
// const User = require("./models/UserModel");
// const CoustmerDevice = require("./models/coustmerDeviceModel");
// const devicesStore = require("./devicesStore"); // in-memory store

// const app = express();
// const HTTP_PORT = 4004;
// const TCP_PORT = 4005;

// // ================= IN-MEMORY STORES =================
// const devices = devicesStore; // deviceId -> latest parsed packet
// const vehicleState = {};      // deviceId -> stop info
// const parkedState = {};       // deviceId -> park info
// let userDeviceMap = {};       // userId -> [deviceId, deviceId, ...]

// // ================= EXPRESS SETUP =================
// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// // Routers
// const manufacturerRouter = require("./routes/manuFacturRoute");
// const superAdminRouter = require("./routes/superAdminRoute");
// app.use("/", manufacturerRouter, superAdminRouter);

// // ================= SOCKET.IO SETUP =================
// const httpServer = http.createServer(app);
// const { Server } = require("socket.io");

// const io = new Server(httpServer, {
//   cors: { origin: ["https://websave.in", "http://localhost:5173"], methods: ["GET", "POST"], credentials: true },
// });

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   if (!userId) return socket.disconnect();

//   console.log(`🟢 User connected: ${userId} | socket: ${socket.id}`);
//   socket.join(userId);

//   socket.on("disconnect", () => {
//     console.log(`🔴 User disconnected: ${userId}`);
//   });
// });

// // ================= INITIALIZE USER-DEVICE MAPPING =================
// const initializeUserDeviceMap = async () => {
//   try {
//     const users = await User.find().populate("coustmerId");
//     userDeviceMap = {};
//     users.forEach((user) => {
//       if (user.coustmerId && user.coustmerId.devicesOwened) {
//         userDeviceMap[user._id] = user.coustmerId.devicesOwened.map(d => d.deviceNo);
//       }
//     });
//     console.log("✅ User-Device Map initialized:", userDeviceMap);
//   } catch (err) {
//     console.log("❌ Error initializing user-device map:", err.message);
//   }
// };
// initializeUserDeviceMap();

// // ================= PARSE $PVT PACKET =================
// function parsePvtPacket(packet) {
//   try {
//     const parts = packet.split(",");
//     if (parts.length < 10) return null;

//     return {
//       deviceId: parts[6] || "unknown",
//       packetHeader: parts[0] || null,
//       vendorId: parts[1] || null,
//       firmware: parts[2] || null,
//       packetType: parts[3] || null,
//       alertId: parts[4] || null,
//       packetStatus: parts[5] || null,
//       imei: parts[6] || null,
//       vehicleNo: parts[7] || null,
//       gpsFix: parts[8] || null,
//       date: parts[9] || null,
//       time: parts[10] || null,
//       lat: parseFloat(parts[11]) || null,
//       latDir: parts[12] || null,
//       lng: parseFloat(parts[13]) || null,
//       lngDir: parts[14] || null,
//       speed: Math.trunc(parseFloat(parts[15])) || 0,
//       headDegree: parts[16] || null,
//       satellites: parts[17] || null,
//       altitude: parts[18] || null,
//       pdop: parts[19] || null,
//       hdop: parts[20] || null,
//       networkOperator: parts[21] || null,
//       ignition: parts[22] || null,
//       mainsPowerStatus: parts[23] || null,
//       mainsVoltage: parts[24] || null,
//       batteryVoltage: parts[25] || null,
//       sosStatus: parts[26] || null,
//       tamperAlert: parts[27] || null,
//       gsmSignal: parts[28] || null,
//       mcc: parts[29] || null,
//       mnc: parts[30] || null,
//       lac: parts[31] || null,
//       cellId: parts[32] || null,
//       timestamp: new Date().toISOString(),
//       lastUpdate: new Date()
//     };
//   } catch (e) {
//     console.log("❌ PVT Parse Error:", e.message);
//     return null;
//   }
// }

// // ================= BUILD LIVE TRACKING OBJECT =================
// function buildLiveTrackingObject(parsed, dev) {
//   const imei = parsed.deviceId;

//   if (!vehicleState[imei]) vehicleState[imei] = { isStopped: false, stopStartTime: null, totalStoppedSeconds: 0 };
//   if (!parkedState[imei]) parkedState[imei] = { isParked: false, parkStartTime: null, totalParkedSeconds: 0 };

//   // Movement
//   let movementStatus = "stopped";
//   const speed = parsed.speed || 0;
//   const ignition = parsed.ignition || "0";
//   if (speed > 5) movementStatus = "moving";
//   else if (speed > 0) movementStatus = "slow moving";

//   // Stop info
//   if (speed === 0 && !vehicleState[imei].isStopped) {
//     vehicleState[imei].isStopped = true;
//     vehicleState[imei].stopStartTime = Date.now();
//   }
//   if (speed > 0 && vehicleState[imei].isStopped) {
//     vehicleState[imei].isStopped = false;
//     vehicleState[imei].totalStoppedSeconds += Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000);
//     vehicleState[imei].stopStartTime = null;
//   }

//   // Park info
//   const ignitionOn = ignition === "1" || ignition === 1 || ignition === true;
//   if (!ignitionOn && speed === 0 && !parkedState[imei].isParked) {
//     parkedState[imei].isParked = true;
//     parkedState[imei].parkStartTime = Date.now();
//   }
//   if (ignitionOn && parkedState[imei].isParked) {
//     parkedState[imei].isParked = false;
//     parkedState[imei].totalParkedSeconds += Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000);
//     parkedState[imei].parkStartTime = null;
//   }

//   // Format lat/lng
//   let lat = parsed.lat;
//   let lng = parsed.lng;
//   if (parsed.latDir === "S" && lat > 0) lat = -lat;
//   if (parsed.lngDir === "W" && lng > 0) lng = -lng;

//   return {
//     dev,
//     deviceNo: dev.deviceNo,
//     deviceType: dev.deviceType,
//     RegistrationNo: dev.RegistrationNo,
//     MakeModel: dev.MakeModel,
//     ModelYear: dev.ModelYear,
//     batchNo: dev.batchNo,
//     date: dev.date,
//     simDetails: dev.simDetails || [],
//     liveTracking: parsed || null,
//     status: speed > 0 ? "online" : "offline",
//     lat,
//     lng,
//     speed,
//     ignition,
//     gpsFix: parsed.gpsFix,
//     satellites: parsed.satellites,
//     lastUpdate: parsed.lastUpdate,
//     movementStatus,
//     stopInfo: {
//       isStopped: vehicleState[imei].isStopped,
//       stopStartTime: vehicleState[imei].stopStartTime,
//       totalStoppedSeconds: vehicleState[imei].totalStoppedSeconds,
//       currentStopSeconds: vehicleState[imei].isStopped
//         ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
//         : 0
//     },
//     parkInfo: {
//       isParked: parkedState[imei].isParked,
//       parkStartTime: parkedState[imei].parkStartTime,
//       totalParkedSeconds: parkedState[imei].totalParkedSeconds,
//       currentParkedSeconds: parkedState[imei].isParked
//         ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
//         : 0
//     }
//   };
// }

// // ================= TCP SERVER =================
// let buffer = "";
// const tcpServer = net.createServer((socket) => {
//   console.log("📡 Device Connected:", socket.remoteAddress);

//   socket.on("data", async (data) => {
//     const ascii = data.toString("utf8");
//     if (ascii.includes("GET") || ascii.includes("HTTP")) return socket.destroy();

//     buffer += ascii;

//     while (buffer.includes("$PVT")) {
//       const start = buffer.indexOf("$PVT");
//       let end = buffer.indexOf("\n", start);
//       if (end === -1) end = buffer.length;

//       const packet = buffer.slice(start, end).trim();
//       const parsed = parsePvtPacket(packet);

//       if (parsed && parsed.deviceId) {
//         devices[parsed.deviceId] = parsed;

//         // Save to DB
//         saveToRouteHistory(parsed);


//         console.log("Before Push Live datanto relevant user:")
//         // Push live to relevant users
//         for (const [userId, deviceIds] of Object.entries(userDeviceMap)) {
//           if (deviceIds.includes(parsed.deviceId)) {

//             // Get device metadata from CoustmerDevice
//             const userDevices = getDevicesForUser(userId);
//             const dev = userDevices.find(d => d.deviceNo === parsed.deviceId);

//             if (dev) {
//               const enrichedData = buildLiveTrackingObject(parsed, dev);
//               io.to(userId).emit("gps-update", enrichedData);
//               console.log(`📡 Sent enriched GPS of ${parsed.deviceId} to user ${userId}`);
//             }
//           }
//         }
//         console.log("After Push Live datanto relevant user:")
//       }

//       buffer = buffer.slice(end);
//     }

//     if (buffer.length > 5000) buffer = ""; // prevent overflow
//   });

//   socket.on("end", () => console.log("❌ Device Disconnected"));
//   socket.on("error", (err) => console.log("🚨 TCP ERROR:", err.message));
// });

// tcpServer.listen(TCP_PORT, () => console.log(`🚀 TCP Server running on port ${TCP_PORT}`));

// // ================= HELPER: GET USER DEVICES =================
// function getDevicesForUser(userId) {
//   const userDevices = [];
//   const deviceNos = userDeviceMap[userId] || [];
//   deviceNos.forEach(imei => {
//     // You could fetch full metadata from DB if needed
//     const dev = devices[imei]; // in-memory metadata
//     if (dev) userDevices.push(dev);
//   });
//   return userDevices;
// }

// // ================= SAVE ROUTE HISTORY =================
// async function saveToRouteHistory(parsed) {
//   try {
//     if (!parsed || !parsed.deviceId) return;
//     await RouteHistory.create({
//       imei: parsed.deviceId,
//       latitude: parsed.lat,
//       longitude: parsed.lng,
//       speed: parsed.speed,
//       raw: parsed,
//       timestamp: parsed.lastUpdate || new Date(),
//     });
//     console.log(`📍 Route point saved for IMEI: ${parsed.deviceId}`);
//   } catch (err) {
//     console.log("❌ Route Save Error:", err.message);
//   }
// }

// // ================= START SERVER =================
// httpServer.listen(HTTP_PORT, () => {
//   console.log(`🌍 HTTP + Socket.IO Server running on port ${HTTP_PORT}`);
// });

// connectToDatabase();






// This is 3 rd code shshi will give me now
// ============================================
// 📁 server.js (Manufacturer Service) - FIXED
// ============================================

const express = require("express");
const http = require("http");
const net = require("net");
const { connectToDatabase } = require("./dataBase/db");
const RouteHistory = require("./models/RouteHistory");
const User = require("./models/UserModel");
const CoustmerDevice = require("./models/coustmerDeviceModel");
const devicesStore = require("./devicesStore"); // in-memory store
const { connectProducer, sendRoutePoint } = require("./KAFKA/producer");
const { forwardPacket } = require("./tcpForwarder");
const { forwardPacketHanshaRoulKela } = require("./tcpForwarderHanshaRoulKela")


// corn 
require("./corn/expirePackages");

const app = express();
const HTTP_PORT = 4004;
const TCP_PORT = 4005;

// ================= IN-MEMORY STORES =================
const devices = devicesStore; // deviceId -> latest parsed packet
const vehicleState = {};      // deviceId -> stop info
const parkedState = {};       // deviceId -> park info
let userDeviceMap = {};       // userId -> [deviceId, deviceId, ...]

// ================= EXPRESS SETUP =================
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routers
const manufacturerRouter = require("./routes/manuFacturRoute");
const superAdminRouter = require("./routes/superAdminRoute");
app.use("/", manufacturerRouter, superAdminRouter);

// ================= SOCKET.IO SETUP =================
const httpServer = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    // Allow both your domain and localhost
    origin: ["https://websave.in", "https://wemis.in", "https://api.websave.in", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return socket.disconnect();

  console.log(`🟢 User connected: ${userId} | socket: ${socket.id}`);
  socket.join(userId);


  // ✅ LOG & SEND LAST GPS DATA ON SOCKET CONNECT
  const deviceIds = userDeviceMap[userId] || [];

  deviceIds.forEach((deviceObj) => {
    const deviceId = deviceObj.deviceNo;
    const parsed = devices[deviceId]; // last GPS stored in memory
    console.log("PARSED",parsed);

    if (parsed) {
      const enrichedData = buildLiveTrackingObject(parsed, deviceObj);

      // 🔥 CONSOLE LOG GPS RESPONSE
      console.log("📡 GPS DATA ON SOCKET CONNECT:");
      console.log(
        "📦 ENRICHED GPS DATA:\n",
        JSON.stringify(enrichedData, null, 2)
      );

      // 🔥 SEND TO FRONTEND
      socket.emit("gps-update", enrichedData);
    } else {
      console.log(`⚠️ No GPS data yet for device: `);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${userId}`);
  });
});

// ================= INITIALIZE USER-DEVICE MAPPING =================
const initializeUserDeviceMap = async () => {
  try {
    const users = await User.find().populate("coustmerId");
    userDeviceMap = {};
    users.forEach((user) => {
      if (user.coustmerId && user.coustmerId.devicesOwened) {
        // userDeviceMap[user._id] = user.coustmerId.devicesOwened.map(d => d.deviceNo);

        // Map over the devices array to store the full details we need
        userDeviceMap[user._id] = user.coustmerId.devicesOwened.map(d => ({
          deviceNo: d.deviceNo,
          vechileNo: d.vechileNo,     // Match your DB spelling 'vechile'
          VehicleType: d.VehicleType, // Match your DB spelling 'VehicleType'
          RegistrationNo: d.RegistrationNo,
          MakeModel: d.MakeModel,
          ModelYear: d.ModelYear,
          batchNo: d.batchNo,
          deviceSendTo: d.deviceSendTo
        }));
      }
    });
    //console.log("✅ User-Device Map initialized:", userDeviceMap);
  } catch (err) {
    console.log("❌ Error initializing user-device map:", err.message);
  }
};
// Run initially and refresh every 10 minutes to catch new users
initializeUserDeviceMap();
setInterval(initializeUserDeviceMap, 10 * 60 * 1000);

// ================= PARSE $PVT PACKET (FIXED) =================
function parsePvtPacket(packet) {
  try {
    const parts = packet.split(",");
    if (parts.length < 10) return null;

    return {
      deviceId: parts[6] || "unknown",

      // 👇 CRITICAL FIX: Added deviceNo so your loop can match it
      deviceNo: parts[6] || "unknown",

      packetHeader: parts[0] || null,
      vendorId: parts[1] || null,
      firmware: parts[2] || null,
      packetType: parts[3] || null,
      alertId: parts[4] || null,
      packetStatus: parts[5] || null,
      imei: parts[6] || null,
      vehicleNo: parts[7] || null,
      gpsFix: parts[8] || null,
      date: parts[9] || null,
      time: parts[10] || null,
      lat: parseFloat(parts[11]) || null,
      latDir: parts[12] || null,
      lng: parseFloat(parts[13]) || null,
      lngDir: parts[14] || null,
      speed: Math.trunc(parseFloat(parts[15])) || 0,
      headDegree: parts[16] || null,
      satellites: parts[17] || null,
      altitude: parts[18] || null,
      pdop: parts[19] || null,
      hdop: parts[20] || null,
      networkOperator: parts[21] || null,
      ignition: parts[22] || null,
      mainsPowerStatus: parts[23] || null,
      mainsVoltage: parts[24] || null,
      batteryVoltage: parts[25] || null,
      sosStatus: parts[26] || null,
      tamperAlert: parts[27] || null,
      gsmSignal: parts[28] || null,
      mcc: parts[29] || null,
      mnc: parts[30] || null,
      lac: parts[31] || null,
      cellId: parts[32] || null,
      timestamp: new Date().toISOString(),
      lastUpdate: new Date()
    };
  } catch (e) {
    console.log("❌ PVT Parse Error:", e.message);
    return null;
  }
}

// ================= BUILD LIVE TRACKING OBJECT =================
function buildLiveTrackingObject(parsed, dev) {
  const imei = parsed.deviceId;

  if (!vehicleState[imei]) vehicleState[imei] = { isStopped: false, stopStartTime: null, totalStoppedSeconds: 0 };
  if (!parkedState[imei]) parkedState[imei] = { isParked: false, parkStartTime: null, totalParkedSeconds: 0 };

  // Movement Logic
  let movementStatus = "stopped";
  const speed = parsed.speed || 0;
  const ignition = parsed.ignition || "0";
  if (speed > 5) movementStatus = "moving";
  else if (speed > 0) movementStatus = "slow moving";

  // Stop Logic
  if (speed === 0 && !vehicleState[imei].isStopped) {
    vehicleState[imei].isStopped = true;
    vehicleState[imei].stopStartTime = Date.now();
  }
  if (speed > 0 && vehicleState[imei].isStopped) {
    vehicleState[imei].isStopped = false;
    vehicleState[imei].totalStoppedSeconds += Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000);
    vehicleState[imei].stopStartTime = null;
  }

  // Park Logic
  const ignitionOn = ignition === "1" || ignition === 1 || ignition === true;
  if (!ignitionOn && speed === 0 && !parkedState[imei].isParked) {
    parkedState[imei].isParked = true;
    parkedState[imei].parkStartTime = Date.now();
  }
  if (ignitionOn && parkedState[imei].isParked) {
    parkedState[imei].isParked = false;
    parkedState[imei].totalParkedSeconds += Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000);
    parkedState[imei].parkStartTime = null;
  }

  // Lat/Lng formatting
  let lat = parsed.lat;
  let lng = parsed.lng;
  if (parsed.latDir === "S" && lat > 0) lat = -lat;
  if (parsed.lngDir === "W" && lng > 0) lng = -lng;

  // Safe Fallback if 'dev' is missing (prevents crashes)
  const safeDev = dev || { deviceNo: parsed.deviceId, deviceType: "Unknown", RegistrationNo: "Unknown" };
  const dataAge = Date.now() - new Date(parsed.lastUpdate).getTime();

  const metaData = {
    dev: safeDev,
    // deviceNo: safeDev.deviceNo,
    // deviceType: safeDev.deviceType,
    // RegistrationNo: safeDev.RegistrationNo,
    // MakeModel: safeDev.MakeModel,
    // ModelYear: safeDev.ModelYear,
    // batchNo: safeDev.batchNo,
    // date: safeDev.date,
    // simDetails: safeDev.simDetails || [],
    liveTracking: parsed || null,
    status: dataAge < 120000 ? "online" : "stale", // online if data is less than 2 min old
    lat,
    lng,
    speed,
    ignition,
    gpsFix: parsed.gpsFix,
    satellites: parsed.satellites,
    lastUpdate: parsed.lastUpdate,
    movementStatus,
    // stopInfo: {
    //   isStopped: vehicleState[imei].isStopped,
    //   stopStartTime: vehicleState[imei].stopStartTime,
    //   totalStoppedSeconds: vehicleState[imei].totalStoppedSeconds,
    //   currentStopSeconds: vehicleState[imei].isStopped
    //     ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
    //     : 0
    // },
    // parkInfo: {
    //   isParked: parkedState[imei].isParked,
    //   parkStartTime: parkedState[imei].parkStartTime,
    //   totalParkedSeconds: parkedState[imei].totalParkedSeconds,
    //   currentParkedSeconds: parkedState[imei].isParked
    //     ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
    //     : 0
    // }

    stopInfo: {
      isStopped: vehicleState[imei].isStopped,
      stopStartTime: vehicleState[imei].stopStartTime,
      totalStoppedMinutes: Math.floor(vehicleState[imei].totalStoppedSeconds / 60),
      currentStopMinutes: vehicleState[imei].isStopped
        ? Number(((Date.now() - vehicleState[imei].stopStartTime) / 1000 / 60).toFixed(2))
        : 0
    },

    parkInfo: {
      isParked: parkedState[imei].isParked,
      parkStartTime: parkedState[imei].parkStartTime,
      totalParkedMinutes: Math.floor(parkedState[imei].totalParkedSeconds / 60),
      currentParkedMinutes: parkedState[imei].isParked
        ? Math.floor(((Date.now() - parkedState[imei].parkStartTime) / 1000 / 60).toFixed(2))
        : 0
    }

  }

  console.log(metaData);

  return {
    ...metaData
  };
}

// ================= TCP SERVER =================
const lastSavedTime = {}; // deviceId -> last save timestamp
let buffer = "";
const tcpServer = net.createServer((socket) => {
  console.log("📡 Device Connected:", socket.remoteAddress);

  socket.on("data", async (data) => {
    const ascii = data.toString("utf8");
    if (ascii.includes("GET") || ascii.includes("HTTP")) {
      return socket.destroy();
    }

    buffer += ascii;

    while (buffer.includes("$PVT")) {
      const start = buffer.indexOf("$PVT");
      let end = buffer.indexOf("\n", start);
      if (end === -1) end = buffer.length;

      const packet = buffer.slice(start, end).trim();
      const parsed = parsePvtPacket(packet);

      if (parsed && parsed.deviceId) {
        // Update global store
        devices[parsed.deviceId] = parsed;

        // // Save to DB
        // saveToRouteHistory(parsed);



        // Send to Kafka (No DB write here)
        // try {
        //   await sendRoutePoint(parsed);
        // } catch (error) {
        //   console.log("❌ Kafka Send Error:", error.message);
        // }

        console.log("Before Push Live datanto relevant user:");



        // 3. Updated Loop: Iterate through the new object-based userDeviceMap
        for (const [userId, deviceObjects] of Object.entries(userDeviceMap)) {

          // Use .find() because deviceObjects is now [{deviceNo, vechileNo, ...}]
          const devMetadata = deviceObjects.find(d => d.deviceNo === parsed.deviceId);

          if (devMetadata) {

            /////////////////////////////////////////////  Update Code Start/////////////////////////////



            // ❌ Skip DB save for Hansa devices
            if (
              devMetadata.deviceSendTo !== "Hansa Sambalpur" &&
              devMetadata.deviceSendTo !== "Hansa rourkela"
            ) {
              const now = Date.now();
              const lastTime = lastSavedTime[parsed.deviceId] || 0;

              // ✅ Save only every 30 seconds
              if (now - lastTime >= 30000) {
                saveToRouteHistory(parsed);
                lastSavedTime[parsed.deviceId] = now;

                console.log(`💾 Route saved for ${parsed.deviceId}`);
              }
              console.log(`💾 Saved route history for ${parsed.deviceId}`);
            } else {
              console.log(`🚫 DB save skipped for ${parsed.deviceId}`);
            }








            // ✅ FORWARD ONLY IF deviceSendTo === "Hansa Sambalpur"
            if (devMetadata.deviceSendTo === "Hansa Sambalpur") {
              forwardPacket(packet);
              console.log(
                `📤 Packet forwarded for device ${parsed.deviceId} to Hansa Sambalpur`
              );
            } else {
              console.log(
                `🚫 Packet NOT forwarded for device ${parsed.deviceId}, deviceSendTo: ${devMetadata.deviceSendTo}`
              );
            }



            if (devMetadata.deviceSendTo === "Hansa rourkela") {
              forwardPacketHanshaRoulKela(packet);
              console.log(
                `📤 Packet forwarded for device ${parsed.deviceId} to Hansa rourkela`
              );
            } else {
              console.log(
                `🚫 Packet NOT forwarded for device ${parsed.deviceId}, deviceSendTo: ${devMetadata.deviceSendTo}`
              );
            }




            /////////////////////////////////////////////  Update Code End /////////////////////////////

            // ✅ SUCCESS: Pass the real metadata (including VehicleType and vechileNo)
            const enrichedData = buildLiveTrackingObject(parsed, devMetadata);

            io.to(userId).emit("gps-update", enrichedData);

            console.log(`📡 Sent enriched GPS for ${devMetadata.vechileNo} to user ${userId}`);
          }
        }

      }

      buffer = buffer.slice(end);
    }

    if (buffer.length > 5000) buffer = ""; // prevent overflow
  });

  socket.on("end", () => console.log("❌ Device Disconnected"));
  socket.on("error", (err) => console.log("🚨 TCP ERROR:", err.message));
});

tcpServer.listen(TCP_PORT, () => console.log(`🚀 TCP Server running on port ${TCP_PORT}`));

// ================= HELPER: GET USER DEVICES =================
function getDevicesForUser(userId) {
  const userDevices = [];
  const deviceNos = userDeviceMap[userId] || [];
  deviceNos.forEach(imei => {
    const dev = devices[imei]; // in-memory metadata
    if (dev) userDevices.push(dev);
  });
  return userDevices;
}

// ================= SAVE ROUTE HISTORY =================
async function saveToRouteHistory(parsed) {
  try {
    if (!parsed || !parsed.deviceId) return;
    await RouteHistory.create({
      imei: parsed.deviceId,
      latitude: parsed.lat,
      longitude: parsed.lng,
      speed: parsed.speed,
      raw: parsed,
      timestamp: parsed.lastUpdate || new Date(),
    });
    console.log(`📍 Route point saved for IMEI: ${parsed.deviceId}`);
  } catch (err) {
    console.log("❌ Route Save Error:", err.message);
  }
}

// ================= START SERVER =================
httpServer.listen(HTTP_PORT, () => {
  console.log(`🌍 HTTP + Socket.IO Server running on port ${HTTP_PORT}`);
});

connectToDatabase();
