// const express = require('express');
// const { connectToDatabase } = require('./dataBase/db');

// const app = express();
// const port = 4004;
// const manufacturerRouter = require('./routes/manuFacturRoute');
// const SuperAdminRouter = require('./routes/superAdminRoute');

// // ✅ Increase request body size limit (VERY IMPORTANT FOR AWS)
// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "100mb" }));;
// app.use('/', manufacturerRouter, SuperAdminRouter);


// connectToDatabase();
// app.listen(port, "0.0.0.0", () => {
//   console.log(`Manufacturer Service is running on port ${port} and url http://localhost:${port}`);
// });





// const express = require("express");
// const net = require("net");
// const { connectToDatabase } = require("./dataBase/db");

// const manufacturerRouter = require("./routes/manuFacturRoute");
// const SuperAdminRouter = require("./routes/superAdminRoute");
// const { devices } = require("./devicesStore");


// const app = express();
// const HTTP_PORT = 4004;
// const TCP_PORT = 5000;

// // ✅ Increase request body size limit (VERY IMPORTANT FOR AWS)
// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// // Combine Existing Routes
// app.use("/", manufacturerRouter, SuperAdminRouter);

// // ===============================
// // ✅ In-Memory Devices Store
// // ===============================
// // let devices = {};

// // ===============================
// // ✅ TCP SERVER (GPS Devices)
// // ===============================
// const tcpServer = net.createServer(socket => {
//   console.log("📡 GPS Device Connected:", socket.remoteAddress);

//   let buffer = "";

//   socket.on("data", (data) => {
//     console.log("📥 RAW ASCII:", data.toString("utf8"));
//     console.log("📥 RAW HEX:", data.toString("hex"));
//     buffer += data.toString();

//     let messages = buffer.split(/\r?\n/);
//     buffer = messages.pop(); // Handle incomplete buffer

//     for (const msg of messages) {
//       if (!msg.trim()) continue;

//       console.log("📥 RAW PACKET:", msg);

//       const parsed = parseTraxoPacket(msg);

//       if (parsed && parsed.deviceId) {
//         devices[parsed.deviceId] = parsed;
//         console.log("✅ Parsed Device:", parsed);
//       } else {
//         console.log("⚠️ Failed to parse packet:", msg);
//       }
//     }
//   });

//   socket.on("end", () => {
//     console.log("❌ Device Disconnected:", socket.remoteAddress);
//   });

//   socket.on("error", (err) => {
//     console.error("🚨 TCP Socket Error:", err.message);
//   });
// });

// // Start TCP Server
// tcpServer.listen(TCP_PORT, "0.0.0.0", () => {
//   console.log(`🚀 GPS TCP Server running on port ${TCP_PORT}`);
// });

// // ===============================
// // ✅ HTTP Routes for Device Data
// // ===============================


// // Start Express HTTP Server
// app.listen(HTTP_PORT, () => {
//   console.log(`🌍 ManuFactur Server running on port ${HTTP_PORT} http://localhost:${HTTP_PORT}`);
// });

// // Connect DB
// connectToDatabase();


// // ===============================
// // ✅ GPS Packet Parser Function
// // ===============================
// function parseTraxoPacket(msg) {
//   const parts = msg.trim().split(/[,\s]+/);
//   console.log("📦 Packet Parts:", parts);

//   try {
//     return {
//       deviceId: parts[6] || null,
//       packetHeader: parts[0],
//       vendorId: parts[1],
//       firmware: parts[2],
//       packetType: parts[3],
//       alertId: parts[4],
//       packetStatus: parts[5],
//       imei: parts[6],
//       vehicleNo: parts[7],
//       gpsFix: parts[8],
//       date: parts[9],
//       time: parts[10],
//       lat: parseFloat(parts[11]) || null,
//       latDir: parts[12],
//       lng: parseFloat(parts[13]) || null,
//       lngDir: parts[14],
//       speed: parseFloat(parts[15]) || 0,
//       satellites: parts[17],
//       batteryVoltage: parts[25],
//       gsmSignal: parts[28],
//       timestamp: new Date().toISOString()
//     };
//   } catch (err) {
//     console.error("❌ Parsing Error:", err.message);
//     return null;
//   }
// }



// server.js
// const express = require("express");
// const net = require("net");
// const { connectToDatabase } = require("./dataBase/db");

// const manufacturerRouter = require("./routes/manuFacturRoute");
// const SuperAdminRouter = require("./routes/superAdminRoute");

// // ✅ Shared memory object
// const devices = require("./devicesStore");

// const app = express();
// const HTTP_PORT = 4004;
// const TCP_PORT = 5000;

// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// app.use("/", manufacturerRouter, SuperAdminRouter);

// // ✅ TCP Server
// const tcpServer = net.createServer(socket => {
//   console.log("📡 GPS Device Connected:", socket.remoteAddress);

//   socket.on("data", (data) => {

//     const ascii = data.toString("utf8");
//     const hex = data.toString("hex").toUpperCase();

//     console.log("📥 RAW ASCII:", ascii);
//     console.log("📥 RAW HEX:", hex);

//     // ✅ Block HTTP scanners
//     if (ascii.startsWith("GET") || ascii.startsWith("POST") || ascii.includes("HTTP")) {
//       console.log("❌ HTTP scanner blocked");
//       return socket.destroy();
//     }

//     if (data.length < 10) {
//       console.log("❌ Invalid short packet blocked");
//       return;
//     }

//     // ✅ Parse ASCII + Binary packets
//     const parsed = parseTraxoPacket(data);

//     if (parsed && parsed.deviceId) {
//       devices[parsed.deviceId] = { ...parsed, lastUpdate: new Date() };
//       console.log("✅ Device Updated:", parsed.deviceId);
//     } else {
//       console.log("⚠️ Unrecognized GPS packet");
//     }
//   });

//   socket.on("end", () => {
//     console.log("❌ Device Disconnected:", socket.remoteAddress);
//   });

//   socket.on("error", (err) => {
//     console.error("🚨 TCP Socket Error:", err.message);
//   });
// });

// tcpServer.listen(TCP_PORT, "0.0.0.0", () => {
//   console.log(`🚀 GPS TCP Server running on port ${TCP_PORT}`);
// });

// app.listen(HTTP_PORT, () => {
//   console.log(`🌍 ManuFactur HTTP Server running on port ${HTTP_PORT}`);
// });

// connectToDatabase();


// // ✅ PARSER (ASCII + binary fallback)
// function parseTraxoPacket(data) {
//   const ascii = data.toString("utf8").trim();

//   // ✅ If ASCII packet ($PVT)
//   if (ascii.startsWith("$PVT")) {
//     const parts = ascii.split(",");

//     return {
//       deviceId: parts[6],
//       imei: parts[6],
//       packetType: "ASCII",
//       raw: ascii
//     };
//   }

//   // ✅ Otherwise treat as binary — IMEI needed
//   const hex = data.toString("hex").toUpperCase();

//   // ❌ TEMPORARY until you give full packet
//   return {
//     deviceId: null,   // must be extracted
//     packetType: "BINARY",
//     rawHex: hex
//   };
// }




// ============================================
// 📁 server.js (Main Entry Point)
/// File: server.js

// manufacturer/server.js

const express = require("express");
const net = require("net");
const { connectToDatabase } = require("./dataBase/db");

// ✅ Shared In-Memory Store
const devices = require("./devicesStore");

// Routers
const manufacturerRouter = require("./routes/manuFacturRoute");
const superAdminRouter = require("./routes/superAdminRoute");

const app = express();
const HTTP_PORT = 4004;
const TCP_PORT = 4005;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use("/", manufacturerRouter, superAdminRouter);

let buffer = ""; // global streaming buffer

// =========================================
// ✅ TCP SERVER (Traxo GPS Devices)
// =========================================
const tcpServer = net.createServer(socket => {
  console.log("📡 Device Connected:", socket.remoteAddress);

  socket.on("data", (data) => {
    const ascii = data.toString("utf8");

    console.log("====================================");
    console.log("📥 RAW ASCII:", data.toString("utf8"));
    console.log("📥 RAW HEX:", data.toString("hex").toUpperCase());
    console.log("📥 BUFFER LENGTH:", data.length);
    console.log("====================================");

    // 🔥 BLOCK HTTP SCANNERS
    if (ascii.includes("GET") || ascii.includes("HTTP")) {
      console.log("❌ HTTP Scanner Blocked");
      return socket.destroy();
    }

    // ✅ Append to buffer (device sends without newline)
    buffer += ascii;

    // ✅ Check if buffer contains a PVT packet
    if (buffer.includes("$PVT")) {
      const start = buffer.indexOf("$PVT");
      let end = buffer.indexOf("\n", start);

      if (end === -1) {
        // No newline — maybe single full packet
        end = buffer.length;
      }

      const packet = buffer.slice(start, end).trim();

      console.log("📥 RAW PACKET:", packet);

      const parsed = parsePvtPacket(packet);

      if (parsed && parsed.deviceId) {
        devices[parsed.deviceId] = parsed;
        console.log("✅ UPDATED DEVICE:", parsed.deviceId);
      }

      // ✅ Remove processed packet from buffer
      buffer = buffer.slice(end);
    }

    // ✅ Prevent buffer overflow
    if (buffer.length > 5000) buffer = "";
  });

  socket.on("end", () => console.log("❌ Device Disconnected"));
  socket.on("error", (err) => console.log("🚨 TCP ERROR:", err.message));
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`🚀 TCP Server running on port ${TCP_PORT}`);
});

app.listen(HTTP_PORT, () => {
  console.log(`🌍 HTTP Server running on port ${HTTP_PORT}`);
});

connectToDatabase();

// =========================================
// ✅ PARSER FOR ASCII PVT PACKET
// =========================================
function parsePvtPacket(packet) {
  try {
    const parts = packet.split(",");

    if (parts.length < 10) return null; // not enough fields
    console.log("speed For Normal", parseFloat(parts[15]) || 0);
    console.log("speed for Trunc", Math.trunc(parseFloat(parts[15])) || 0);
    // return {
    //   deviceId: parts[6],       // IMEI
    //   imei: parts[6],
    //   packetHeader: parts[0],
    //   vendorId: parts[1],
    //   firmware: parts[2],
    //   packetType: parts[3],
    //   alertId: parts[4],
    //   packetStatus: parts[5],
    //   vehicleNo: parts[7],
    //   gpsFix: parts[8],
    //   date: parts[9],
    //   time: parts[10],
    //   lat: parseFloat(parts[11]) || null,
    //   latDir: parts[12],
    //   lng: parseFloat(parts[13]) || null,
    //   lngDir: parts[14],
    //   // speed: parseFloat(parts[15]) || 0,
    //   speed: Math.trunc(parseFloat(parts[15])) || 0,
    //   satellites: parts[17] || "",
    //   batteryVoltage: parts[25] || "",
    //   gsmSignal: parts[28] || "",
    //   timestamp: new Date().toISOString(),
    //   lastUpdate: new Date()
    // };


    return {
      deviceId: parts[6] || "unknown",     // IMEI
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
      // add more indexes if your packet has them
      timestamp: new Date().toISOString(),
      lastUpdate: new Date()
    };
  } catch (e) {
    console.log("❌ PVT Parse Error:", e.message);
    return null;
  }
}
