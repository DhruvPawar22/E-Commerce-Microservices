require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   
const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

//routes
const cartroute = require('./routes/cart_route')
app.use('/api/cart',cartroute)

app.listen(process.env.PORT, () => {
    console.log(`Cart-Service is running on port ${process.env.PORT}`);
});