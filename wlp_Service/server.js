const express = require('express');
const { connectToDatabase } = require('./dataBase/db');

const app = express();
const port =  4003;
const WlpRouter = require('./routes/wlpRoute');
const SuperAdminRouter = require('./routes/superAdminRoute');

app.use(express.json());
app.use('/', WlpRouter , SuperAdminRouter);

app.listen(port, () => {
  console.log(`Manufacturer Service is running on port ${port} and url http://localhost:${port}`);
});
connectToDatabase(); 
 