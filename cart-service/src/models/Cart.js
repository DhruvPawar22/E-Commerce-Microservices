const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [
    {
      productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]},
    {timestamps:true}
);
cartSchema.index({userId:1},{unique:true});

const Cart = mongoose.model('Cart',cartSchema)
module.exports = Cart;
