require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');       
const e = require('express');

const app = e();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

//routes

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);
module.exports=app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Product Catalog Service is running on port ${PORT}`);
});