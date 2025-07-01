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
            //Uupdate order status
            await axios.put(orderServiceUrl, { status: "completed" }, {
                headers: { Authorization: req.headers.authorization }
            });
            //get useremail from user service
            const user_url=process.env.USER_SERVICE_URL;
            const get_Email= await axios.get(user_url,{
            headers: { Authorization: req.headers.authorization }//protected route
            })
            const user_email=get_Email.data.email;

            //send email to the respective email
            const email_url=process.env.EMAIL_SERVICE_URL
            await axios.post(email_url,{
                to:user_email,
                subject:'Payment Successful',
                text:`Your Payment was successful for price ${totalAmount}`
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