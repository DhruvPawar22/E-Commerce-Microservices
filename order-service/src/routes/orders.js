const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const authenticateToken = require('../middleware/authenticateToken')
const Order = require('../models/Order');
const axios = require('axios');
//Create a new order

router.post('/',authenticateToken, async (req, res)=>{
    try {
        const products = req.body.products
        let totalAmount = 0
        //calculate total amount for order
        for (const item of products)
        {
            const response = await axios.get(`http://localhost:5000/api/products/${item.productId}`);
            const product = response.data
            totalAmount += item.quantity*product.price
        }

        const order = new Order({
            userId:req.user.id,
            status:"completed",
            products,
            totalAmount
        })
        await order.save();
        res.status(500).json({message:"Order has been placed"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error Creating Order"})
    }
})


module.exports=router