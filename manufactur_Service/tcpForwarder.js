const net = require("net");

const TARGET_IP = "3.6.57.153";
const TARGET_PORT = 1642;

let client;

function connect() {
  client = new net.Socket();

  client.connect(TARGET_PORT, TARGET_IP, () => {
    console.log(`✅ Forward TCP connected → ${TARGET_IP}:${TARGET_PORT}`);
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

function forwardPacket(rawPacket) {
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

module.exports = { forwardPacket };
 