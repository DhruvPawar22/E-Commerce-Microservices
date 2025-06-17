const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    
    
    status:{
        type:String,
        default:"pending",
        enum:["pending","completed","cancelled"]
    }
    ,totalAmount:{type:Number, required:true},
    createdAt: { type: Date, default: Date.now }

})