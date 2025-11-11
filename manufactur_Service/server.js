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

const express = require("express");
const net = require("net");
const { connectToDatabase } = require("./dataBase/db");

// ✅ IMPORT: The shared data store
const devices = require("./devicesStore");

// --- Router Imports (assuming these paths are correct) ---
const manufacturerRouter = require("./routes/manuFacturRoute");
const SuperAdminRouter = require("./routes/superAdminRoute");

const app = express();
const HTTP_PORT = 4004;
const TCP_PORT = 5000;

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routes
app.use("/", manufacturerRouter, SuperAdminRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    connectedDevices: Object.keys(devices).length,
    uptime: process.uptime()
  });
});

// ============================================
// 🔹 TCP SERVER (GPS Device Listener)
// ============================================
const tcpServer = net.createServer(socket => {
  console.log("📡 GPS Device Connected:", socket.remoteAddress);
  // Use Buffer for raw TCP data to prevent binary corruption
  let buffer = Buffer.alloc(0);

  socket.on("data", (data) => {
    // 1. Append to buffer
    buffer = Buffer.concat([buffer, data]);

    const asciiStart = buffer.slice(0, 100).toString("utf8");
    const hex = data.toString("hex").toUpperCase();

    console.log("📥 RAW ASCII Start:", asciiStart.split('\n')[0]);
    console.log("📥 RAW HEX:", hex);

    // ✅ Block HTTP scanners 
    if (asciiStart.startsWith("GET") || asciiStart.startsWith("POST") || asciiStart.includes("HTTP")) {
      console.log("❌ HTTP scanner blocked");
      socket.destroy();
      return;
    }

    // 2. Try to parse packet from the buffer
    const parsed = parseTraxoPacket(buffer);

    if (parsed && parsed.deviceId) {
      // ✅ WRITE: Update the *shared* devices object
      devices[parsed.deviceId] = {
        ...parsed,
        lastUpdate: new Date().toISOString(),
        connectionInfo: {
          ip: socket.remoteAddress,
          port: socket.remotePort
        }
      };

      console.log("✅ Device Updated:", parsed.deviceId);
      // Clear buffer after successful parse (assuming successful parse means the entire buffer was consumed)
      buffer = Buffer.alloc(0);
    } else {
      console.log("⚠️ Unrecognized GPS packet, keeping in buffer");
      if (buffer.length > 4096) {
        console.log("❌ Buffer overflow, clearing");
        buffer = Buffer.alloc(0);
      }
    }
  });

  socket.on("end", () => {
    console.log("❌ Device Disconnected:", socket.remoteAddress);
  });
  socket.on("error", (err) => {
    console.error("🚨 TCP Socket Error:", err.message);
  });
  socket.on("timeout", () => {
    console.log("⏱️ Socket timeout:", socket.remoteAddress);
    socket.destroy();
  });

  socket.setTimeout(300000); // 5 minutes timeout
});

tcpServer.listen(TCP_PORT, "0.0.0.0", () => {
  console.log(`🚀 GPS TCP Server running on port ${TCP_PORT}`);
});

app.listen(HTTP_PORT, () => {
  console.log(`🌍 HTTP Server running on port ${HTTP_PORT}`);
});

connectToDatabase();

// ============================================
// 🔹 PARSER FUNCTION LOGIC
// ============================================
function parseTraxoPacket(data) {
  const ascii = data.toString("utf8").trim();

  // 1. Check for standard ASCII packet
  if (ascii.startsWith("$PVT")) {
    // Find the full packet line
    const fullPacketMatch = ascii.match(/\$PVT.*?\r?\n/);
    if (fullPacketMatch) {
      return parseAsciiPacket(fullPacketMatch[0]);
    }
    return parseAsciiPacket(ascii); // Fallback for single packet without newline
  }

  // 2. Check for other ASCII packets (e.g., just comma-separated data)
  if (ascii.includes(",")) {
    return parseAsciiPacket(ascii);
  }

  // 3. Fallback for Binary (Must be implemented based on protocol)
  return parseBinaryPacket(data);
}

function parseAsciiPacket(msg) {
  try {
    const parts = msg.trim().split(/[,\s]+/);
    // console.log("📦 ASCII Parts:", parts); // Uncomment for debugging

    if (parts.length < 32) { // 32 is roughly the minimum complete set
      return null;
    }

    const deviceId = parts[6];

    if (!deviceId || deviceId === "unknown") return null;

    return {
      deviceId,
      packetType: "ASCII",
      packetHeader: parts[0] || null,
      vendorId: parts[1] || null,
      firmware: parts[2] || null,
      packetTypeCode: parts[3] || null,
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
      speed: parseFloat(parts[15]) || 0,
      heading: parts[16] || null,
      satellites: parseInt(parts[17]) || 0,
      altitude: parseFloat(parts[18]) || null,
      pdop: parts[19] || null,
      hdop: parts[20] || null,
      networkOperator: parts[21] || null,
      ignition: parts[22] || null,
      mainsPowerStatus: parts[23] || null,
      mainsVoltage: parseFloat(parts[24]) || null,
      batteryVoltage: parseFloat(parts[25]) || null,
      sosStatus: parts[26] || null,
      tamperAlert: parts[27] || null,
      gsmSignal: parseInt(parts[28]) || 0,
      mcc: parts[29] || null,
      mnc: parts[30] || null,
      lac: parts[31] || null,
      cellId: parts[32] || null,
      rawPacket: msg,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("❌ ASCII Parse Error:", err.message);
    return null;
  }
}

function parseBinaryPacket(data) {
  // Placeholder - implement your specific binary protocol here
  // Example: Check for a header like 0x7878
  // if (data.length > 2 && data[0] === 0x78 && data[1] === 0x78) { ... }
  return null;
}

// ============================================
// 🔹 CLEANUP: Remove stale devices (Essential for Memory)
// ============================================
setInterval(() => {
  const now = Date.now();
  const timeout = 10 * 60 * 1000; // 10 minutes

  for (const [deviceId, data] of Object.entries(devices)) {
    if (now - new Date(data.lastUpdate).getTime() > timeout) {
      console.log(`🧹 Removing stale device: ${deviceId}`);
      delete devices[deviceId];
    }
  }
}, 60000); // Check every minute