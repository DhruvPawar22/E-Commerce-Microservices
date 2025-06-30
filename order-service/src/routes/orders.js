const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const authenticateToken = require('../middleware/authenticateToken')
const Order = require('../models/Order');
const axios = require('axios');
//Create a new order

router.post('/', authenticateToken, async (req, res) => {
    try {
        const products = req.body.products;
        let totalAmount = 0;

        for (const item of products) {
            try {
                const response = await axios.put(
                    `http://localhost:5000/api/products/success/${item.productId}`,
                    { decrementBy: item.quantity }
                );
                const updatedProduct = response.data.product;
                totalAmount += item.quantity * updatedProduct.price;
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    return res.status(409).json({
                        message: `Insufficient stock for product ${item.productId}`,
                        currentStock: error.response.data.currentStock
                    });
                } else if (error.response && error.response.status === 404) {
                    return res.status(404).json({
                        message: `Product not found for ID ${item.productId}`
                    });
                } else {
                    return res.status(500).json({
                        message: "Error contacting product service",
                        error: error.message
                    });
                }
            }
        }

        const order = new Order({
            userId: req.user.id,
            status: "pending",
            products,
            totalAmount
        });
        await order.save();
        res.status(200).json({ message: "Order has been placed" });
    } catch (error) {
        res.status(500).json({ message: "Error Creating Order", error: error.message });
    }
})
//Get details of a specific Order
router.get('/:id',authenticateToken, async(req,res)=>
{
    try {
        const order = await Order.findById(req.params.id)

        if(order.userId.toString()!=req.user.id){
            return res.status(403).json({ message: "Access denied" });
        }
        if(!order){
            return res.status(404).json({message:"Cant find order"})

        }
        res.status(200).json(order)

    } catch (error) {
        res.status(500).json({message:"Error fetching Order"})
    }
});
//get all orders for a user
router.get('/user/me', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        console.log(orders)
        // No need to check for !orders; just return the array (could be empty)
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders for user", error: error.message });
    }
});

//update order status
router.put('/:id', authenticateToken, async (req,res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});
        if(!order){
            return res.status(404).json({message:"Error finding order"})
        }
        res.status(200).json({message:"status updated"})
    } catch (error) {
           res.status(500).json({message:"Error fetching Order"})     
    }
});


module.exports=router