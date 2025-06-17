require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


//routes
const orderRoutes = require('./routes/orders')
app.use('/api/orders',orderRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Order-Service is running on port ${process.env.PORT}`);
});