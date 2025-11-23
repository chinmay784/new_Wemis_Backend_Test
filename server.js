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
// const superAdminRoutes = require("./routes/superAdminRoute");
// const adminRoutes = require("./routes/adminRoute");
// const wlpRoutes = require("./routes/wlpRoute");
// const manufacturRoutes = require("./routes/manuFacturRoute");

const app = express();
// const _dirname = path.resolve();

app.set("trust proxy", 1);
app.use(helmet());


const expressProxy = require('express-http-proxy');


const proxyOptions = {
   parseReqBody: false,
   limit: '100mb',
   memoizeHost: false,

   // This is extra add in pdf and jpeg and png
   proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // forward headers properly
      proxyReqOpts.headers = srcReq.headers;

      // required for file uploads
      delete proxyReqOpts.headers["content-length"];
      delete proxyReqOpts.headers["transfer-encoding"];

      return proxyReqOpts;
   },

   proxyReqBodyDecorator: (bodyContent, srcReq) => {
      return bodyContent;  // do NOT modify multipart/form-data
   },
}


app.use('/api/superadmin', expressProxy('http://127.0.0.1:4001', proxyOptions));
app.use('/api/admin', expressProxy('http://127.0.0.1:4002', proxyOptions));
app.use('/api/wlp', expressProxy('http://127.0.0.1:4003', proxyOptions));
app.use('/api/manufactur', expressProxy('http://127.0.0.1:4004', proxyOptions));

// ✅ CORS   
app.use(
   cors({
      origin: ["https://websave.in", "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
   })
);

app.options("*", cors());
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// ✅ Rate limiter
const limiter = rateLimit({
   windowMs: 1 * 60 * 1000,  // 1 minute
   max: 20000,               // allow 20,000 requests per IP per minute
   standardHeaders: true,
   legacyHeaders: false,
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
// app.use("/api/superadmin", superAdminRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/wlp", wlpRoutes);
// app.use("/api/manufactur", manufacturRoutes);

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




connectToDatabase();
// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
   console.log(`✅ Server running on http://localhost:${PORT}`);
});




// const express = require("express");
// const { connectToDatabase } = require("./database/Db");
// require("dotenv").config();
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const morgan = require("morgan");
// const fs = require("fs");
// const path = require("path");
// const expressProxy = require("express-http-proxy");

// const app = express();
// app.set("trust proxy", 1);

// /* ------------------------------------------------------------------
//    ✅ CORS MUST BE FIRST (BEFORE ANY PROXY OR ROUTES)
// ------------------------------------------------------------------ */
// app.use(
//   cors({
//     origin: [
//       "https://websave.in",
//       "https://api.websave.in",
//       "http://localhost:3000",
//       "http://localhost:5173",
//       "http://localhost:5174",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // Handle OPTIONS for all routes
// app.options("*", cors());

// /* ------------------------------------------------------------------
//    SECURITY HEADERS
// ------------------------------------------------------------------ */
// app.use(helmet());

// /* ------------------------------------------------------------------
//    BODY PARSER
// ------------------------------------------------------------------ */
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// /* ------------------------------------------------------------------
//    RATE LIMITER
// ------------------------------------------------------------------ */
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 20000,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// /* ------------------------------------------------------------------
//    REQUEST LOGGING
// ------------------------------------------------------------------ */
// app.use(morgan("dev"));

// /* ------------------------------------------------------------------
//    PROXY SETTINGS
// ------------------------------------------------------------------ */
// const proxyOptions = {
//   parseReqBody: false,
//   limit: "100mb",
//   memoizeHost: false,

//   proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//     proxyReqOpts.headers = srcReq.headers;
//     delete proxyReqOpts.headers["content-length"];
//     delete proxyReqOpts.headers["transfer-encoding"];
//     return proxyReqOpts;
//   },

//   proxyReqBodyDecorator: (bodyContent) => bodyContent,
// };

// /* ------------------------------------------------------------------
//    BACKEND MICROSERVICES (Proxies)
// ------------------------------------------------------------------ */
// app.use("/api/superadmin", expressProxy("http://127.0.0.1:4001", proxyOptions));
// app.use("/api/admin", expressProxy("http://127.0.0.1:4002", proxyOptions));
// app.use("/api/wlp", expressProxy("http://127.0.0.1:4003", proxyOptions));
// app.use("/api/manufactur", expressProxy("http://127.0.0.1:4004", proxyOptions));

// /* ------------------------------------------------------------------
//    HEALTH CHECK
// ------------------------------------------------------------------ */
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
// });

// /* ------------------------------------------------------------------
//    ERROR HANDLER
// ------------------------------------------------------------------ */
// app.use((err, req, res, next) => {
//   console.error("❌ Error:", err.message);
//   res.status(500).json({ success: false, message: "Internal Server Error" });
// });

// /* ------------------------------------------------------------------
//    START SERVER
// ------------------------------------------------------------------ */
// connectToDatabase();

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Gateway running on http://localhost:${PORT}`);
// });