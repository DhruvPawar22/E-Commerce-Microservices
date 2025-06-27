const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Cart = require('../models/Cart')
const authenticateToken = require('../middleware/authenticateToken')

//get current users cart get
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error getting cart" });
    }
})
//add products to cart post
router.post('/add', authenticateToken,async (req,res) => {
    try {
        const {products}=req.body;
        let cart = await Cart.findOne({userId:req.user.id})
        if(!cart)//fresh/cart doesnt exist yet
        {
            cart = new Cart({userId:req.user.id,products})
            await cart.save();
        }//else update cart
        else{
            
            products.forEach(({productId,quantity}) => {
                const existingProduct=cart.products.find(
                    (item)=>item.productId==productId
                );
            if(existingProduct){
                existingProduct.quantity+=quantity
            }
            else{
                cart.products.push({productId,quantity})
            }
            });
            await cart.save();
        }
        res.status(200).json(cart)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error adding products",error})
    }
})

//remove singular product from cart 
router.delete('/delete/:id',authenticateToken, async (req,res)=>{
    try {
        const cart = await Cart.findOne({userId:req.user.id});
        if(!cart)
        {
            return res.status(404).json({message:"Cart not found for user"})
        }
        cart.products = cart.products.filter(
            (item)=>item.productId != req.params.id
        )
        await cart.save();
        res.status(200).json({message:"product removed",cart})
    } catch (error) {
        res.status(500).json({ message: "Error removing product", error });
    }
})
//remove all products from cart
router.delete('/deleteall', authenticateToken, async (req,res)=>{
try {
    const cart = await Cart.findOneAndDelete({userId:req.user.id});
    if(!cart){
        return res.status(404).json({message:"Cart not found"});
    }
    res.status(200).json({message:"cart deleted"})
} catch (error) {
            res.status(500).json({ message: "Error removing Cart", error });

}
})


module.exports=router;