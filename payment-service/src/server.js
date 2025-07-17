require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected to MongoDB");
})
.catch(err=>{
        console.error('MongoDB connection error:', err);
})
//routes
const paymentRoutes= require('./routes/payment-route')
app.use('/api/payment',paymentRoutes)
module.exports=app;
app.listen(process.env.PORT,()=>{
    console.log(`Payment-Service is running on port ${process.env.PORT}`);
})
