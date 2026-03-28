// This is 3 rd code shshi will give me now
// ============================================
// 📁 server.js (Manufacturer Service) - FIXED
// ============================================

// const express = require("express");
// const http = require("http");
// const net = require("net");
// const { connectToDatabase } = require("./dataBase/db");
// const RouteHistory = require("./models/RouteHistory");
// const User = require("./models/UserModel");
// const CoustmerDevice = require("./models/coustmerDeviceModel");
// const devicesStore = require("./devicesStore"); // in-memory store
// const { connectProducer, sendRoutePoint } = require("./KAFKA/producer");
// const { forwardPacket } = require("./tcpForwarder");
// const { forwardPacketHanshaRoulKela } = require("./tcpForwarderHanshaRoulKela")


// // corn 
// require("./corn/expirePackages");

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
//   cors: {
//     // Allow both your domain and localhost
//     origin: ["https://websave.in", "https://wemis.in", "https://api.websave.in", "http://localhost:5173"],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   if (!userId) return socket.disconnect();

//   console.log(`🟢 User connected: ${userId} | socket: ${socket.id}`);
//   socket.join(userId);


//   // ✅ LOG & SEND LAST GPS DATA ON SOCKET CONNECT
//   const deviceIds = userDeviceMap[userId] || [];

//   deviceIds.forEach((deviceObj) => {
//     const deviceId = deviceObj.deviceNo;
//     const parsed = devices[deviceId]; // last GPS stored in memory


//     if (parsed) {
//       const enrichedData = buildLiveTrackingObject(parsed, deviceObj);

//       // 🔥 CONSOLE LOG GPS RESPONSE
//       console.log("📡 GPS DATA ON SOCKET CONNECT:");
//       console.log(
//         "📦 ENRICHED GPS DATA:\n",
//         JSON.stringify(enrichedData, null, 2)
//       );

//       // 🔥 SEND TO FRONTEND
//       socket.emit("gps-update", enrichedData);
//     } else {
//       console.log(`⚠️ No GPS data yet for device: `);
//     }
//   });

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
//         // userDeviceMap[user._id] = user.coustmerId.devicesOwened.map(d => d.deviceNo);

//         // Map over the devices array to store the full details we need
//         userDeviceMap[user._id] = user.coustmerId.devicesOwened.map(d => ({
//           deviceNo: d.deviceNo,
//           vechileNo: d.vechileNo,     // Match your DB spelling 'vechile'
//           VehicleType: d.VehicleType, // Match your DB spelling 'VehicleType'
//           RegistrationNo: d.RegistrationNo,
//           MakeModel: d.MakeModel,
//           ModelYear: d.ModelYear,
//           batchNo: d.batchNo,
//           deviceSendTo: d.deviceSendTo
//         }));
//       }
//     });
//     //console.log("✅ User-Device Map initialized:", userDeviceMap);
//   } catch (err) {
//     console.log("❌ Error initializing user-device map:", err.message);
//   }
// };
// // Run initially and refresh every 10 minutes to catch new users
// initializeUserDeviceMap();
// setInterval(initializeUserDeviceMap, 10 * 60 * 1000);

// // ================= PARSE $PVT PACKET (FIXED) =================
// function parsePvtPacket(packet) {
//   try {
//     const parts = packet.split(",");
//     if (parts.length < 10) return null;

//     return {
//       deviceId: parts[6] || "unknown",

//       // 👇 CRITICAL FIX: Added deviceNo so your loop can match it
//       deviceNo: parts[6] || "unknown",

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




// // ==================  PARSE NON-AIS-140 PACKET DATA ==================
// function parseTraxoPacket(packet) {
//   try {
//     const clean = packet.replace("#", "");
//     const parts = clean.split(",");

//     const imei = parts[1];
//     const lat = parseFloat(parts[2]) || 0;
//     const lng = parseFloat(parts[3]) || 0;
//     const speed = parseFloat(parts[4]) || 0;

//     const timeStr = parts[5];

//     let timestamp = new Date();
//     if (timeStr && timeStr.length === 14) {
//       timestamp = new Date(
//         `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}T${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}Z`
//       );
//     }

//     return {
//       deviceId: imei,

//       lat,
//       lng,
//       speed,

//       gpsFix: "A",

//       // 🔥 SAME NORMALIZATION
//       ignition: speed > 0 ? "1" : "0",
//       satellites: 0,

//       lastUpdate: timestamp,
//       timestamp
//     };

//   } catch (e) {
//     console.log("❌ Traxo Parse Error:", e.message);
//     return null;
//   }
// }


// // ==================  PARSE NON-AIS-140 PACKET DATA ==================
// function parseImeiPacket(packet) {
//   try {
//     const parts = packet.split(",");

//     const imei = parts[1]?.split(":")[1] || null;
//     const gpsFix = parts[2] || "V";

//     const lat = parseFloat(parts[3]) || 0;
//     const lng = parseFloat(parts[4]) || 0;
//     const speed = parseFloat(parts[5]) || 0;

//     const timeStr = parts[6];

//     let timestamp = new Date();
//     if (timeStr && timeStr.length === 14) {
//       timestamp = new Date(
//         `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}T${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}Z`
//       );
//     }

//     return {
//       deviceId: imei,

//       lat,
//       lng,
//       speed,

//       gpsFix,

//       // 🔥 SMART DEFAULTS
//       ignition: speed > 0 ? "1" : "0",   // infer from speed
//       satellites: 0,                     // not available

//       lastUpdate: timestamp,
//       timestamp
//     };

//   } catch (err) {
//     console.log("❌ IMEI Parse Error:", err.message);
//     return null;
//   }
// }




// // ================= BUILD LIVE TRACKING OBJECT =================
// function buildLiveTrackingObject(parsed, dev) {
//   const imei = parsed.deviceId;

//   if (!vehicleState[imei]) vehicleState[imei] = { isStopped: false, stopStartTime: null, totalStoppedSeconds: 0 };
//   if (!parkedState[imei]) parkedState[imei] = { isParked: false, parkStartTime: null, totalParkedSeconds: 0 };

//   // Movement Logic
//   let movementStatus = "stopped";
//   const speed = parsed.speed || 0;
//   const ignition = parsed.ignition || "0";
//   if (speed > 5) movementStatus = "moving";
//   else if (speed > 0) movementStatus = "slow moving";

//   // Stop Logic
//   if (speed === 0 && !vehicleState[imei].isStopped) {
//     vehicleState[imei].isStopped = true;
//     vehicleState[imei].stopStartTime = Date.now();
//   }
//   if (speed > 0 && vehicleState[imei].isStopped) {
//     vehicleState[imei].isStopped = false;
//     vehicleState[imei].totalStoppedSeconds += Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000);
//     vehicleState[imei].stopStartTime = null;
//   }

//   // Park Logic
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

//   // Lat/Lng formatting
//   let lat = parsed.lat;
//   let lng = parsed.lng;
//   if (parsed.latDir === "S" && lat > 0) lat = -lat;
//   if (parsed.lngDir === "W" && lng > 0) lng = -lng;

//   // Safe Fallback if 'dev' is missing (prevents crashes)
//   const safeDev = dev || { deviceNo: parsed.deviceId, deviceType: "Unknown", RegistrationNo: "Unknown" };
//   const dataAge = Date.now() - new Date(parsed.lastUpdate).getTime();

//   const metaData = {
//     dev: safeDev,
//     // deviceNo: safeDev.deviceNo,
//     // deviceType: safeDev.deviceType,
//     // RegistrationNo: safeDev.RegistrationNo,
//     // MakeModel: safeDev.MakeModel,
//     // ModelYear: safeDev.ModelYear,
//     // batchNo: safeDev.batchNo,
//     // date: safeDev.date,
//     // simDetails: safeDev.simDetails || [],
//     liveTracking: parsed || null,
//     status: dataAge < 120000 ? "online" : "stale", // online if data is less than 2 min old
//     lat,
//     lng,
//     speed,
//     ignition,
//     gpsFix: parsed.gpsFix,
//     satellites: parsed.satellites,
//     lastUpdate: parsed.lastUpdate,
//     movementStatus,
//     // stopInfo: {
//     //   isStopped: vehicleState[imei].isStopped,
//     //   stopStartTime: vehicleState[imei].stopStartTime,
//     //   totalStoppedSeconds: vehicleState[imei].totalStoppedSeconds,
//     //   currentStopSeconds: vehicleState[imei].isStopped
//     //     ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
//     //     : 0
//     // },
//     // parkInfo: {
//     //   isParked: parkedState[imei].isParked,
//     //   parkStartTime: parkedState[imei].parkStartTime,
//     //   totalParkedSeconds: parkedState[imei].totalParkedSeconds,
//     //   currentParkedSeconds: parkedState[imei].isParked
//     //     ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
//     //     : 0
//     // }

//     stopInfo: {
//       isStopped: vehicleState[imei].isStopped,
//       stopStartTime: vehicleState[imei].stopStartTime,
//       totalStoppedMinutes: Math.floor(vehicleState[imei].totalStoppedSeconds / 60),
//       currentStopMinutes: vehicleState[imei].isStopped
//         ? Number(((Date.now() - vehicleState[imei].stopStartTime) / 1000 / 60).toFixed(2))
//         : 0
//     },

//     parkInfo: {
//       isParked: parkedState[imei].isParked,
//       parkStartTime: parkedState[imei].parkStartTime,
//       totalParkedMinutes: Math.floor(parkedState[imei].totalParkedSeconds / 60),
//       currentParkedMinutes: parkedState[imei].isParked
//         ? Math.floor(((Date.now() - parkedState[imei].parkStartTime) / 1000 / 60).toFixed(2))
//         : 0
//     }

//   }

//   console.log(metaData);

//   return {
//     ...metaData
//   };
// }

// // ================= TCP SERVER =================
// const lastSavedTime = {}; // deviceId -> last save timestamp
// let buffer = "";
// const tcpServer = net.createServer((socket) => {
//   console.log("📡 Device Connected:", socket.remoteAddress);

//   socket.on("data", async (data) => {
//     const ascii = data.toString("utf8");
//     if (ascii.includes("GET") || ascii.includes("HTTP")) {
//       return socket.destroy();
//     }

//     buffer += ascii;

//     while (buffer.includes("$PVT") ||
//       buffer.includes("$TRAXO") ||
//       buffer.includes("##")) {
//       // const start = buffer.indexOf("$PVT");
//       // let end = buffer.indexOf("\n", start);
//       // if (end === -1) end = buffer.length;
//       // console.log(start)

//       // const packet = buffer.slice(start, end).trim();


//       // New Added for Both Ais-140 and Non-Ais-140
//       let start = -1;
//       let header = null;

//       const pvtIndex = buffer.indexOf("$PVT");
//       const traxoIndex = buffer.indexOf("$TRAXO");
//       const imeiIndex = buffer.indexOf("##");

//       // Find the earliest header in the buffer
//       const indexes = [pvtIndex, traxoIndex, imeiIndex].filter(i => i !== -1);
//       if (indexes.length === 0) break;

//       start = Math.min(...indexes);

//       if (start === pvtIndex) header = "$PVT";
//       else if (start === traxoIndex) header = "$TRAXO";
//       else if (start === imeiIndex) header = "##";

//       let end = -1;

//       if (header === "$TRAXO") {
//         end = buffer.indexOf("#", start);
//         if (end !== -1) end += 1;
//       } else {
//         end = buffer.indexOf("\n", start);
//       }

//       if (end === -1) break; // wait for full packet

//       const packet = buffer.slice(start, end).trim();

//       let parsed = null;

//       if (header === "$PVT") {
//         parsed = parsePvtPacket(packet);
//       }
//       else if (header === "$TRAXO") {
//         parsed = parseTraxoPacket(packet);
//       }
//       else if (header === "##") {
//         parsed = parseImeiPacket(packet);
//       }



//       // const parsed = parsePvtPacket(packet);

//       if (parsed && parsed.deviceId) {
//         // Update global store
//         devices[parsed.deviceId] = parsed;

//         // // Save to DB
//         // saveToRouteHistory(parsed);



//         // Send to Kafka (No DB write here)
//         // try {
//         //   await sendRoutePoint(parsed);
//         // } catch (error) {
//         //   console.log("❌ Kafka Send Error:", error.message);
//         // }

//         console.log("Before Push Live datanto relevant user:");



//         // 3. Updated Loop: Iterate through the new object-based userDeviceMap
//         for (const [userId, deviceObjects] of Object.entries(userDeviceMap)) {

//           // Use .find() because deviceObjects is now [{deviceNo, vechileNo, ...}]
//           const devMetadata = deviceObjects.find(d => d.deviceNo === parsed.deviceId);

//           if (devMetadata) {

//             /////////////////////////////////////////////  Update Code Start/////////////////////////////



//             // ❌ Skip DB save for Hansa devices
//             // if (
//             //   devMetadata.deviceSendTo !== "Hansa Sambalpur" &&
//             //   devMetadata.deviceSendTo !== "Hansa rourkela"
//             // ) {
//             //   const now = Date.now();
//             //   const lastTime = lastSavedTime[parsed.deviceId] || 0;

//             //   // ✅ Save only every 30 seconds
//             //   if (now - lastTime >= 30000) {
//             //     saveToRouteHistory(parsed);
//             //     lastSavedTime[parsed.deviceId] = now;

//             //     console.log(`💾 Route saved for ${parsed.deviceId}`);
//             //   }
//             //   console.log(`💾 Saved route history for ${parsed.deviceId}`);
//             // } else {
//             //   console.log(`🚫 DB save skipped for ${parsed.deviceId}`);
//             // }









//             const now = Date.now();
//             const lastTime = lastSavedTime[parsed.deviceId] || 0;

//             // ✅ Save only every 30 seconds
//             if (parsed.speed > 0 && now - lastTime >= 60000) {
//               saveToRouteHistory(parsed);
//               lastSavedTime[parsed.deviceId] = now;

//               console.log(`💾 Route saved for ${parsed.deviceId}`);
//             }














//             // ✅ FORWARD ONLY IF deviceSendTo === "Hansa Sambalpur"
//             if (devMetadata.deviceSendTo === "Hansa Sambalpur") {
//               forwardPacket(packet);
//               console.log(
//                 `📤 Packet forwarded for device ${parsed.deviceId} to Hansa Sambalpur`
//               );
//             } else {
//               console.log(
//                 `🚫 Packet NOT forwarded for device ${parsed.deviceId}, deviceSendTo: ${devMetadata.deviceSendTo}`
//               );
//             }



//             if (devMetadata.deviceSendTo === "Hansa rourkela") {
//               forwardPacketHanshaRoulKela(packet);
//               console.log(
//                 `📤 Packet forwarded for device ${parsed.deviceId} to Hansa rourkela`
//               );
//             } else {
//               console.log(
//                 `🚫 Packet NOT forwarded for device ${parsed.deviceId}, deviceSendTo: ${devMetadata.deviceSendTo}`
//               );
//             }




//             /////////////////////////////////////////////  Update Code End /////////////////////////////

//             // ✅ SUCCESS: Pass the real metadata (including VehicleType and vechileNo)
//             const enrichedData = buildLiveTrackingObject(parsed, devMetadata);

//             io.to(userId).emit("gps-update", enrichedData);

//             console.log(`📡 Sent enriched GPS for ${devMetadata.vechileNo} to user ${userId}`);
//           }
//         }

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
//       // raw: parsed,
//       raw: {
//         headDegree: parsed.headDegree || 0,
//         ignition: parsed.ignition || parsed.ignition || "0",
//         sosStatus: parsed.sosStatus || "0"
//       },
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



function decodeIMEI(buffer) {
  let imei = "";

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    const high = (byte & 0xF0) >> 4;
    const low = byte & 0x0F;

    imei += high.toString();
    imei += low.toString();
  }

  return imei.replace(/^0+/, "").substring(0, 15);
}

function parseHexPacket(data, socket) {
  try {
    const hex = data.toString("hex");

    console.log("\n📡 HEX:", hex);

    // LOGIN
    if (hex.startsWith("78781101")) {
      const imeiBuffer = data.slice(4, 12);
      const imei = decodeIMEI(imeiBuffer);

      socket.imei = imei;

      console.log("🔐 LOGIN IMEI:", imei);

      socket.write(Buffer.from("787805010001d9dc0d0a", "hex"));
      return null;
    }

    // HEARTBEAT
    if (hex.startsWith("78780a13")) {
      socket.write(Buffer.from("787805130001d9dc0d0a", "hex"));
      return null;
    }

    // GPS
    if (
      hex.startsWith("787822") ||
      hex.startsWith("787812") ||
      hex.startsWith("787824")
    ) {
      if (!socket.imei) {
        console.log("⚠️ IMEI not set yet");
        return null;
      }

      const lat = data.readUInt32BE(11) / 1800000;
      const lng = data.readUInt32BE(15) / 1800000;
      const speed = data.readUInt8(19);

      const courseStatus = data.readUInt16BE(20);
      const heading = courseStatus & 0x03ff;

      return {
        deviceId: socket.imei,
        lat,
        lng,
        speed,
        headDegree: heading,
        ignition: speed > 0 ? "1" : "0",
        gpsFix: "A",
        satellites: 0,
        lastUpdate: new Date(),
        timestamp: new Date(),
      };
    }

    return null;
  } catch (err) {
    console.log("❌ HEX Parse Error:", err.message);
    return null;
  }
}



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




// ==================  PARSE NON-AIS-140 PACKET DATA ==================
function parseTraxoPacket(packet) {
  try {
    const clean = packet.replace("#", "");
    const parts = clean.split(",");

    const imei = parts[1];
    const lat = parseFloat(parts[2]) || 0;
    const lng = parseFloat(parts[3]) || 0;
    const speed = parseFloat(parts[4]) || 0;

    const timeStr = parts[5];

    let timestamp = new Date();
    if (timeStr && timeStr.length === 14) {
      timestamp = new Date(
        `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}T${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}Z`
      );
    }

    return {
      deviceId: imei,

      lat,
      lng,
      speed,

      gpsFix: "A",

      // 🔥 SAME NORMALIZATION
      ignition: speed > 0 ? "1" : "0",
      satellites: 0,

      lastUpdate: timestamp,
      timestamp
    };

  } catch (e) {
    console.log("❌ Traxo Parse Error:", e.message);
    return null;
  }
}


// ==================  PARSE NON-AIS-140 PACKET DATA ==================
function parseImeiPacket(packet) {
  try {
    const parts = packet.split(",");

    const imei = parts[1]?.split(":")[1] || null;
    const gpsFix = parts[2] || "V";

    const lat = parseFloat(parts[3]) || 0;
    const lng = parseFloat(parts[4]) || 0;
    const speed = parseFloat(parts[5]) || 0;

    const timeStr = parts[6];

    let timestamp = new Date();
    if (timeStr && timeStr.length === 14) {
      timestamp = new Date(
        `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}T${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}Z`
      );
    }

    return {
      deviceId: imei,

      lat,
      lng,
      speed,

      gpsFix,

      // 🔥 SMART DEFAULTS
      ignition: speed > 0 ? "1" : "0",   // infer from speed
      satellites: 0,                     // not available

      lastUpdate: timestamp,
      timestamp
    };

  } catch (err) {
    console.log("❌ IMEI Parse Error:", err.message);
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

  // socket.on("data", async (data) => {
  //   const ascii = data.toString("utf8");
  //   if (ascii.includes("GET") || ascii.includes("HTTP")) {
  //     return socket.destroy();
  //   }

  //   buffer += ascii;

  //   while (buffer.includes("$PVT") ||
  //     buffer.includes("$TRAXO") ||
  //     buffer.includes("##")) {
  //     // const start = buffer.indexOf("$PVT");
  //     // let end = buffer.indexOf("\n", start);
  //     // if (end === -1) end = buffer.length;
  //     // console.log(start)

  //     // const packet = buffer.slice(start, end).trim();


  //     // New Added for Both Ais-140 and Non-Ais-140
  //     let start = -1;
  //     let header = null;

  //     const pvtIndex = buffer.indexOf("$PVT");
  //     const traxoIndex = buffer.indexOf("$TRAXO");
  //     const imeiIndex = buffer.indexOf("##");

  //     // Find the earliest header in the buffer
  //     const indexes = [pvtIndex, traxoIndex, imeiIndex].filter(i => i !== -1);
  //     if (indexes.length === 0) break;

  //     start = Math.min(...indexes);

  //     if (start === pvtIndex) header = "$PVT";
  //     else if (start === traxoIndex) header = "$TRAXO";
  //     else if (start === imeiIndex) header = "##";

  //     let end = -1;

  //     if (header === "$TRAXO") {
  //       end = buffer.indexOf("#", start);
  //       if (end !== -1) end += 1;
  //     } else {
  //       end = buffer.indexOf("\n", start);
  //     }

  //     if (end === -1) break; // wait for full packet

  //     const packet = buffer.slice(start, end).trim();

  //     let parsed = null;

  //     if (header === "$PVT") {
  //       parsed = parsePvtPacket(packet);
  //     }
  //     else if (header === "$TRAXO") {
  //       parsed = parseTraxoPacket(packet);
  //     }
  //     else if (header === "##") {
  //       parsed = parseImeiPacket(packet);
  //     }



  //     // const parsed = parsePvtPacket(packet);

  //     if (parsed && parsed.deviceId) {
  //       // Update global store
  //       devices[parsed.deviceId] = parsed;

  //       // // Save to DB
  //       // saveToRouteHistory(parsed);



  //       // Send to Kafka (No DB write here)
  //       // try {
  //       //   await sendRoutePoint(parsed);
  //       // } catch (error) {
  //       //   console.log("❌ Kafka Send Error:", error.message);
  //       // }

  //       console.log("Before Push Live datanto relevant user:");



  //       // 3. Updated Loop: Iterate through the new object-based userDeviceMap
  //       for (const [userId, deviceObjects] of Object.entries(userDeviceMap)) {

  //         // Use .find() because deviceObjects is now [{deviceNo, vechileNo, ...}]
  //         const devMetadata = deviceObjects.find(d => d.deviceNo === parsed.deviceId);

  //         if (devMetadata) {

  //           /////////////////////////////////////////////  Update Code Start/////////////////////////////



  //           // ❌ Skip DB save for Hansa devices
  //           // if (
  //           //   devMetadata.deviceSendTo !== "Hansa Sambalpur" &&
  //           //   devMetadata.deviceSendTo !== "Hansa rourkela"
  //           // ) {
  //           //   const now = Date.now();
  //           //   const lastTime = lastSavedTime[parsed.deviceId] || 0;

  //           //   // ✅ Save only every 30 seconds
  //           //   if (now - lastTime >= 30000) {
  //           //     saveToRouteHistory(parsed);
  //           //     lastSavedTime[parsed.deviceId] = now;

  //           //     console.log(`💾 Route saved for ${parsed.deviceId}`);
  //           //   }
  //           //   console.log(`💾 Saved route history for ${parsed.deviceId}`);
  //           // } else {
  //           //   console.log(`🚫 DB save skipped for ${parsed.deviceId}`);
  //           // }









  //           const now = Date.now();
  //           const lastTime = lastSavedTime[parsed.deviceId] || 0;

  //           // ✅ Save only every 30 seconds
  //           if (parsed.speed > 0 && now - lastTime >= 60000) {
  //             saveToRouteHistory(parsed);
  //             lastSavedTime[parsed.deviceId] = now;

  //             console.log(`💾 Route saved for ${parsed.deviceId}`);
  //           }














  //           // ✅ FORWARD ONLY IF deviceSendTo === "Hansa Sambalpur"
  //           if (devMetadata.deviceSendTo === "Hansa Sambalpur") {
  //             forwardPacket(packet);
  //             console.log(
  //               `📤 Packet forwarded for device ${parsed.deviceId} to Hansa Sambalpur`
  //             );
  //           } else {
  //             console.log(
  //               `🚫 Packet NOT forwarded for device ${parsed.deviceId}, deviceSendTo: ${devMetadata.deviceSendTo}`
  //             );
  //           }



  //           if (devMetadata.deviceSendTo === "Hansa rourkela") {
  //             forwardPacketHanshaRoulKela(packet);
  //             console.log(
  //               `📤 Packet forwarded for device ${parsed.deviceId} to Hansa rourkela`
  //             );
  //           } else {
  //             console.log(
  //               `🚫 Packet NOT forwarded for device ${parsed.deviceId}, deviceSendTo: ${devMetadata.deviceSendTo}`
  //             );
  //           }




  //           /////////////////////////////////////////////  Update Code End /////////////////////////////

  //           // ✅ SUCCESS: Pass the real metadata (including VehicleType and vechileNo)
  //           const enrichedData = buildLiveTrackingObject(parsed, devMetadata);

  //           io.to(userId).emit("gps-update", enrichedData);

  //           console.log(`📡 Sent enriched GPS for ${devMetadata.vechileNo} to user ${userId}`);
  //         }
  //       }

  //     }

  //     buffer = buffer.slice(end);
  //   }

  //   if (buffer.length > 5000) buffer = ""; // prevent overflow
  // });


  socket.on("data", async (data) => {
    const ascii = data.toString("utf8");
    const hex = data.toString("hex");

    // ================= HEX PROTOCOL (NEW 🔥) =================
    if (hex.startsWith("7878") || hex.startsWith("7979")) {
      const parsed = parseHexPacket(data, socket);

      if (parsed && parsed.deviceId) {
        devices[parsed.deviceId] = parsed;

        for (const [userId, deviceObjects] of Object.entries(userDeviceMap)) {
          const devMetadata = deviceObjects.find(
            (d) => d.deviceNo === parsed.deviceId
          );

          if (devMetadata) {
            const now = Date.now();
            const lastTime = lastSavedTime[parsed.deviceId] || 0;

            // Save every 60 sec when moving
            if (parsed.speed > 0 && now - lastTime >= 60000) {
              saveToRouteHistory(parsed);
              lastSavedTime[parsed.deviceId] = now;
            }

            // Forwarding (if needed)
            if (devMetadata.deviceSendTo === "Hansa Sambalpur") {
              forwardPacket(data);
            }

            if (devMetadata.deviceSendTo === "Hansa rourkela") {
              forwardPacketHanshaRoulKela(data);
            }

            const enrichedData = buildLiveTrackingObject(parsed, devMetadata);
            io.to(userId).emit("gps-update", enrichedData);

            console.log(
              `📡 HEX GPS sent for ${devMetadata.vechileNo} to user ${userId}`
            );
          }
        }
      }

      return; // ⛔ VERY IMPORTANT (stop here)
    }

    // ================= EXISTING ASCII PROTOCOL =================
    if (ascii.includes("GET") || ascii.includes("HTTP")) {
      return socket.destroy();
    }

    buffer += ascii;

    while (
      buffer.includes("$PVT") ||
      buffer.includes("$TRAXO") ||
      buffer.includes("##")
    ) {
      let start = -1;
      let header = null;

      const pvtIndex = buffer.indexOf("$PVT");
      const traxoIndex = buffer.indexOf("$TRAXO");
      const imeiIndex = buffer.indexOf("##");

      const indexes = [pvtIndex, traxoIndex, imeiIndex].filter(i => i !== -1);
      if (indexes.length === 0) break;

      start = Math.min(...indexes);

      if (start === pvtIndex) header = "$PVT";
      else if (start === traxoIndex) header = "$TRAXO";
      else if (start === imeiIndex) header = "##";

      let end = -1;

      if (header === "$TRAXO") {
        end = buffer.indexOf("#", start);
        if (end !== -1) end += 1;
      } else {
        end = buffer.indexOf("\n", start);
      }

      if (end === -1) break;

      const packet = buffer.slice(start, end).trim();

      let parsed = null;

      if (header === "$PVT") parsed = parsePvtPacket(packet);
      else if (header === "$TRAXO") parsed = parseTraxoPacket(packet);
      else if (header === "##") parsed = parseImeiPacket(packet);

      if (parsed && parsed.deviceId) {
        devices[parsed.deviceId] = parsed;

        for (const [userId, deviceObjects] of Object.entries(userDeviceMap)) {
          const devMetadata = deviceObjects.find(
            (d) => d.deviceNo === parsed.deviceId
          );

          if (devMetadata) {
            const now = Date.now();
            const lastTime = lastSavedTime[parsed.deviceId] || 0;

            if (parsed.speed > 0 && now - lastTime >= 60000) {
              saveToRouteHistory(parsed);
              lastSavedTime[parsed.deviceId] = now;
            }

            if (devMetadata.deviceSendTo === "Hansa Sambalpur") {
              forwardPacket(packet);
            }

            if (devMetadata.deviceSendTo === "Hansa rourkela") {
              forwardPacketHanshaRoulKela(packet);
            }

            const enrichedData = buildLiveTrackingObject(parsed, devMetadata);
            io.to(userId).emit("gps-update", enrichedData);

            console.log(
              `📡 Sent GPS for ${devMetadata.vechileNo} to user ${userId}`
            );
          }
        }
      }

      buffer = buffer.slice(end);
    }

    if (buffer.length > 5000) buffer = "";
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
      // raw: parsed,
      raw: {
        headDegree: parsed.headDegree || 0,
        ignition: parsed.ignition || parsed.ignition || "0",
        sosStatus: parsed.sosStatus || "0"
      },
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