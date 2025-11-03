const express = require('express');
const { connectToDatabase } = require('./dataBase/db');

const app = express();
const port =  4003;
const WlpRouter = require('./routes/wlpRoute');
const SuperAdminRouter = require('./routes/superAdminRoute');

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use('/', WlpRouter , SuperAdminRouter);

app.listen(port, () => {
  console.log(`Manufacturer Service is running on port ${port} and url http://localhost:${port}`);
});
connectToDatabase(); 
 