
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

const express = require("express");
const http = require("http");
const net = require("net");
const { connectToDatabase } = require("./dataBase/db");
const RouteHistory = require("./models/RouteHistory");
const User = require("./models/UserModel");
const CoustmerDevice = require("./models/coustmerDeviceModel");
const devicesStore = require("./devicesStore"); // in-memory store

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
  cors: { origin: ["https://websave.in", "http://localhost:5173"], methods: ["GET", "POST"], credentials: true },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return socket.disconnect();

  console.log(`🟢 User connected: ${userId} | socket: ${socket.id}`);
  socket.join(userId);

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
        userDeviceMap[user._id] = user.coustmerId.devicesOwened.map(d => d.deviceNo);
      }
    });
    console.log("✅ User-Device Map initialized:", userDeviceMap);
  } catch (err) {
    console.log("❌ Error initializing user-device map:", err.message);
  }
};
initializeUserDeviceMap();

// ================= PARSE $PVT PACKET =================
function parsePvtPacket(packet) {
  try {
    const parts = packet.split(",");
    if (parts.length < 10) return null;

    return {
      deviceId: parts[6] || "unknown",
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

  // Movement
  let movementStatus = "stopped";
  const speed = parsed.speed || 0;
  const ignition = parsed.ignition || "0";
  if (speed > 5) movementStatus = "moving";
  else if (speed > 0) movementStatus = "slow moving";

  // Stop info
  if (speed === 0 && !vehicleState[imei].isStopped) {
    vehicleState[imei].isStopped = true;
    vehicleState[imei].stopStartTime = Date.now();
  }
  if (speed > 0 && vehicleState[imei].isStopped) {
    vehicleState[imei].isStopped = false;
    vehicleState[imei].totalStoppedSeconds += Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000);
    vehicleState[imei].stopStartTime = null;
  }

  // Park info
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

  // Format lat/lng
  let lat = parsed.lat;
  let lng = parsed.lng;
  if (parsed.latDir === "S" && lat > 0) lat = -lat;
  if (parsed.lngDir === "W" && lng > 0) lng = -lng;

  return {
    dev,
    deviceNo: dev.deviceNo,
    deviceType: dev.deviceType,
    RegistrationNo: dev.RegistrationNo,
    MakeModel: dev.MakeModel,
    ModelYear: dev.ModelYear,
    batchNo: dev.batchNo,
    date: dev.date,
    simDetails: dev.simDetails || [],
    liveTracking: parsed || null,
    status: speed > 0 ? "online" : "offline",
    lat,
    lng,
    speed,
    ignition,
    gpsFix: parsed.gpsFix,
    satellites: parsed.satellites,
    lastUpdate: parsed.lastUpdate,
    movementStatus,
    stopInfo: {
      isStopped: vehicleState[imei].isStopped,
      stopStartTime: vehicleState[imei].stopStartTime,
      totalStoppedSeconds: vehicleState[imei].totalStoppedSeconds,
      currentStopSeconds: vehicleState[imei].isStopped
        ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
        : 0
    },
    parkInfo: {
      isParked: parkedState[imei].isParked,
      parkStartTime: parkedState[imei].parkStartTime,
      totalParkedSeconds: parkedState[imei].totalParkedSeconds,
      currentParkedSeconds: parkedState[imei].isParked
        ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
        : 0
    }
  };
}

// ================= TCP SERVER =================
let buffer = "";
const tcpServer = net.createServer((socket) => {
  console.log("📡 Device Connected:", socket.remoteAddress);

  socket.on("data", async (data) => {
    const ascii = data.toString("utf8");
    if (ascii.includes("GET") || ascii.includes("HTTP")) return socket.destroy();

    buffer += ascii;

    while (buffer.includes("$PVT")) {
      const start = buffer.indexOf("$PVT");
      let end = buffer.indexOf("\n", start);
      if (end === -1) end = buffer.length;

      const packet = buffer.slice(start, end).trim();
      const parsed = parsePvtPacket(packet);

      if (parsed && parsed.deviceId) {
        devices[parsed.deviceId] = parsed;

        // Save to DB
        saveToRouteHistory(parsed);


        console.log("Before Push Live datanto relevant user:")
        // Push live to relevant users
        for (const [userId, deviceIds] of Object.entries(userDeviceMap)) {
          if (deviceIds.includes(parsed.deviceId)) {

            // Get device metadata from CoustmerDevice
            const userDevices = getDevicesForUser(userId);
            const dev = userDevices.find(d => d.deviceNo === parsed.deviceId);

            if (dev) {
              const enrichedData = buildLiveTrackingObject(parsed, dev);
              io.to(userId).emit("gps-update", enrichedData);
              console.log(`📡 Sent enriched GPS of ${parsed.deviceId} to user ${userId}`);
            }
          }
        }
        console.log("After Push Live datanto relevant user:")
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
    // You could fetch full metadata from DB if needed
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
