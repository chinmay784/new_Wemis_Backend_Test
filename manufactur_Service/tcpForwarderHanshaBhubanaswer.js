const net = require("net");

// const TARGET_IP = "3.6.57.153";
const TARGET_IP = "35.154.241.136"
// const TARGET_PORT = 1642;
const TARGET_PORT = 1538;

let client;

function connect() {
  client = new net.Socket();

  client.connect(TARGET_PORT, TARGET_IP, () => {
    console.log(`✅ Forward Hansha Bhubanaswer TCP connected → ${TARGET_IP}:${TARGET_PORT}`);
  });

  client.on("error", (err) => { 
    console.error("❌ Forward TCP error:", err.message);
    reconnect();
  });

  client.on("close", () => {
    console.warn("⚠️ Forward TCP closed");
    reconnect();
  });
}

function reconnect() {
  setTimeout(() => {
    console.log("🔄 Reconnecting forward TCP...");
    connect();
  }, 5000);
}

function forwardPacketHanshaBhubanaswer(rawPacket) {
  if (!client || !client.writable) {
    console.warn("⚠️ Forward TCP not ready, packet skipped");
    return;
  }

  try {
    client.write(rawPacket + "\n");
  } catch (err) {
    console.error("❌ Forward write failed:", err.message);
  }
}

connect();

module.exports = { forwardPacketHanshaBhubanaswer };
 