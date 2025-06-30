const mongoose= require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    amount: { type: Number, required: true },

},{timestamps:true})


const Payment = mongoose.model('Payment',paymentSchema)
module.exports = Payment;