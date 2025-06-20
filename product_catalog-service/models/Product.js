const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, default: true },
  createdAt: { type: Date, default: Date.now },
  sku: { type: String, unique: true },
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
