const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});


const Order = mongoose.model('Order',orderSchema)
module.exports = Order;