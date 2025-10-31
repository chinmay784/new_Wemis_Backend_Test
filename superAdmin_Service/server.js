const express = require('express');
const { connectToDatabase } = require('./dataBase/db');

const app = express();
const port =  4001;
const superAdminRouter = require('./routes/superAdminRoute');

app.use(express.json());
app.use('/', superAdminRouter);

app.listen(port, () => {
  console.log(`Super Admin Service is running on port ${port} and url http://localhost:${port}`);
});
connectToDatabase(); 
 