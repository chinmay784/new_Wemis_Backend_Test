const express = require('express');
const { connectToDatabase } = require('./dataBase/db');

const app = express();
const port = 4003;

const WlpRouter = require('./routes/wlpRoute');
const SuperAdminRouter = require('./routes/superAdminRoute');

// ✅ Log aborted requests (optional)
app.use((req, res, next) => {
  req.on('aborted', () => {
    console.warn('⚠️ Client aborted request:', req.method, req.url);
  });
  next();
});
// ✅ JSON parser - must come AFTER multer
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ VERY IMPORTANT ✅
// Mount multer routes BEFORE json body parsing
app.use('/', WlpRouter, SuperAdminRouter);



app.listen(port, () => {
  console.log(`✅ WLP Service is running on port ${port}`);
});

connectToDatabase();
