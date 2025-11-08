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





const express = require("express");
const net = require("net");
const { connectToDatabase } = require("./dataBase/db");

const manufacturerRouter = require("./routes/manuFacturRoute");
const SuperAdminRouter = require("./routes/superAdminRoute");

const app = express();
const HTTP_PORT = 4004;
const TCP_PORT = 5000;

// ✅ Increase request body size limit (VERY IMPORTANT FOR AWS)
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Combine Existing Routes
app.use("/", manufacturerRouter, SuperAdminRouter);

// ===============================
// ✅ In-Memory Devices Store
// ===============================
let devices = {};

// ===============================
// ✅ TCP SERVER (GPS Devices)
// ===============================
const tcpServer = net.createServer(socket => {
  console.log("📡 GPS Device Connected:", socket.remoteAddress);

  let buffer = "";

  socket.on("data", (data) => {
    buffer += data.toString();

    let messages = buffer.split(/\r?\n/);
    buffer = messages.pop(); // Handle incomplete buffer

    for (const msg of messages) {
      if (!msg.trim()) continue;

      console.log("📥 RAW PACKET:", msg);

      const parsed = parseTraxoPacket(msg);

      if (parsed && parsed.deviceId) {
        devices[parsed.deviceId] = parsed;
        console.log("✅ Parsed Device:", parsed);
      } else {
        console.log("⚠️ Failed to parse packet:", msg);
      }
    }
  });

  socket.on("end", () => {
    console.log("❌ Device Disconnected:", socket.remoteAddress);
  });

  socket.on("error", (err) => {
    console.error("🚨 TCP Socket Error:", err.message);
  });
});

// Start TCP Server
tcpServer.listen(TCP_PORT, "0.0.0.0", () => {
  console.log(`🚀 GPS TCP Server running on port ${TCP_PORT}`);
});

// ===============================
// ✅ HTTP Routes for Device Data
// ===============================


// Start Express HTTP Server
app.listen(HTTP_PORT, () => {
  console.log(`🌍 ManuFactur Server running on port ${HTTP_PORT} http://localhost:${HTTP_PORT}`);
});

// Connect DB
connectToDatabase();


// ===============================
// ✅ GPS Packet Parser Function
// ===============================
function parseTraxoPacket(msg) {
  const parts = msg.trim().split(/[,\s]+/);
  console.log("📦 Packet Parts:", parts);

  try {
    return {
      deviceId: parts[6] || null,
      packetHeader: parts[0],
      vendorId: parts[1],
      firmware: parts[2],
      packetType: parts[3],
      alertId: parts[4],
      packetStatus: parts[5],
      imei: parts[6],
      vehicleNo: parts[7],
      gpsFix: parts[8],
      date: parts[9],
      time: parts[10],
      lat: parseFloat(parts[11]) || null,
      latDir: parts[12],
      lng: parseFloat(parts[13]) || null,
      lngDir: parts[14],
      speed: parseFloat(parts[15]) || 0,
      satellites: parts[17],
      batteryVoltage: parts[25],
      gsmSignal: parts[28],
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("❌ Parsing Error:", err.message);
    return null;
  }
}


module.exports = {devices};