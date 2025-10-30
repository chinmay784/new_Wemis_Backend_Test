const express = require("express");
const { connectToDatabase } = require("./database/Db");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Import routes
const superAdminRoutes = require("./routes/superAdminRoute");
const adminRoutes = require("./routes/adminRoute");
const wlpRoutes = require("./routes/wlpRoute");
const manufacturRoutes = require("./routes/manuFacturRoute");

const app = express();
// const _dirname = path.resolve();

app.set("trust proxy", 1);
app.use(helmet());

// ✅ CORS
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ✅ Logging
// const logStream = fs.createWriteStream(path.join(_dirname, "access.log"), {
//   flags: "a",
// });
// app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev"));

// ✅ API routes
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wlp", wlpRoutes);
app.use("/api/manufactur", manufacturRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});



// ✅ Serve React build only if exists
// const frontendPath = path.join(_dirname, "Frontend", "dist");
// if (fs.existsSync(frontendPath)) {
//   app.use(express.static(frontendPath));
//   app.get("/*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// } else {
//   console.warn("⚠️ Frontend build folder not found:", frontendPath);
// }

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

connectToDatabase();
