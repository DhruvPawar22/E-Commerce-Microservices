const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Payment = require('../models/payment-service')
const authenticateToken = require('../middleware/authenticateToken')
const axios = require('axios')
require('dotenv').config()
const Stripe = require('stripe')
const stripe = Stripe(process.env.stripe_key)
//process payment
router.post('/process',authenticateToken, async (req,res)=>
{
    try {
        const {orderId}=req.body
    const orderServiceUrl=process.env.ORDER_SERVICE_URL + `/${orderId}`;
        //to get the total amount from order table
    const order_response = await axios.get(orderServiceUrl,{
            headers: { Authorization: req.headers.authorization }//protected route
    });
    const totalAmount = order_response.data.totalAmount;
    //stripe gateway creating a payment
    const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Stripe expects cents
            currency: 'inr',
            payment_method_types: ['card'], // Only allow card payments
            metadata: { orderId }
        });

    const payment = new Payment({
        userId:req.user.id,
        orderId,
        amount:totalAmount,
        status:'pending',
        paymentIntentId: paymentIntent.id
    });
    await payment.save();
    //stripe gateway here simulate payment
    const confirmedIntent = await stripe.paymentIntents.confirm(
            paymentIntent.id,
            { payment_method: 'pm_card_visa' } // Stripe test card
        );

        // 4. Update payment status based on Stripe response
        if (confirmedIntent.status === 'succeeded') {
            payment.status = 'completed';
            // Optionally update order status
            await axios.put(orderServiceUrl, { status: "completed" }, {
                headers: { Authorization: req.headers.authorization }
            });
        } else {
            payment.status = 'failed';
        }
    await payment.save();
    res.status(200).json(payment)
    } catch (error) {
  console.log(error);
        console.log(error);
        res.status(500).json({ message: "Error processing payment", error: error.message });       
    }
});


module.exports=router;