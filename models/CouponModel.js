// Assuming you're using a database or ORM like Mongoose
const mongoose = require('mongoose');

// Define the schema for the Coupon model
const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  expire_date: {
    type: Date,
    required: true
  },
  min_purchase: {
    type: Number,
    required: true
  },
  max_discount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    required: true
  },
  discount_type: {
    type: String,
    enum: ['amount', 'percent'], // Assuming discount type can be either 'amount' or 'percentage'
    required: true
  },
  status: {
    type: Number,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  coupon_type: {
    type: String,
    enum: ['default'], // Assuming coupon type can be 'default' only
    default: 'default'
  },
  limit: {
    type: Number,
    default: 1
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer' // Assuming there's a Customer model related to this coupon
  }
});

// Create the Coupon model from the schema
const Coupon = mongoose.model('Coupon', couponSchema);

// Export the Coupon model
module.exports = Coupon;
