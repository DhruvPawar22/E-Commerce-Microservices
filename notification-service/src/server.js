require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

//routes
const mailRoutes = require('./routes/notify')
app.use('/api/notify',mailRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Mail-Service is running on port ${process.env.PORT}`);
});