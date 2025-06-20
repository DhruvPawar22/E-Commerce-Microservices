const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose')

// Create a new product
router.post('/',async(req,res)=>{
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
})

// Get all products
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
        }
})
//get a product by id/

router.get('/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }

})

// update a product by id
router.put('/:id', async(req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
})

// Delete a product by id
router.delete('/:id', async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
})
// update a product by id when order is placed ie reduce stock by number of things bought
router.put('/success/:id', async(req, res) => {
    try {
        const decrementBy = Number(req.body.decrementBy);

        /*const product = await Product.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(req.params.id) }, // No stock filter
          { $inc: { stock: -decrementBy } },
          { new: true }
        );*/
 const product = await Product.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.params.id), stock: { $gte: decrementBy } },
            { $inc: { stock: -decrementBy } },
            { new: true }
        );
        console.log(product);

        if (!product) {
          return res.status(409).json({ message: 'Product not found/ theres not enough stock' });
        }
        res.status(200).json({ message: 'Product stock updated successfully', product });

    } catch (error) {
        console.log(error)
         res.status(500).json({ 
        message: "Error updating product"    });
    }
});
module.exports = router;