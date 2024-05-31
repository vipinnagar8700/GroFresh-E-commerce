const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    order_id:{
        type:String,
        default:null,
    },
    order_amount:{
        type:String,
        default:null,
        
    },
    coupon_discount_amount:{
        type:String,
        default:null,
        
    },
    coupon_discount_title:{
        type:String,
        default:null,
    },
    payment_status:{
        type:String,
        default:null,
    },
    order_status:{
        type: String,
        enum: ['pending', 'confirmed', 'packaging', 'out_for_delivery', 'delivered', 'returned', 'failed', 'cancelled'],
        default: 'pending'
    },
    total_tax_amount:{
        type:String,
        default:null,
        
    },
    payment_method:{
        type:String,
        default:null,
    },
    transaction_reference:{
        type:String,
        default:null,
    },
    delivery_address_id:{
        type:String,
        default:null,
    },
    checked:{
        type:String,
        default:null,
        
    },
    delivery_man_id:{
        type:String,
        default:null,
    },
    delivery_charge:{
        type:String,
        default:null,
    },
    order_note:{
        type:String,
        default:null,
        
    },
    coupon_code:{
        type:String,
        default:null,
        
    },
    order_type:{
        type:String,
        default:null,
    },branch_id:{
        type:String,
        default:null,
    },
    time_slot_id:{
        type:String,
        default:null,
        
    },
    date:{
        type:String,
        default:null,
    },
    delivery_date:{
        type:String,
        default:null,
    },
    callback:{
        type:String,
        default:null,
    },
    extra_discount:{
        type:String,
        default:null,
    },
    delivery_address: {
        id: { type: String }, // Assuming id is a string
    address_type: { type: String },
    contact_person_number: { type: String },
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    },
    payment_by:{
        type:String,
        default:null,
    },
    payment_note:{
        type:String,
        default:null,
        index:true,
    },
    free_delivery_amount:{
        type:String,
        default:null,
        
    },
    total_quantity:{
        type:String,
        default:null,
        
    },
    deliveryman_review_count:{
        type:String,
        default:null,
    },
    cart_data: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: []
    },
});

//Export the model
module.exports = mongoose.model('Order', OrderSchema);