const mongoose = require('mongoose');

const deliveryManReviewSchema = new mongoose.Schema({
  deliveryManId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryMan',
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },  status:{
    type:String,
    default:"pending",
}
});

const DeliveryManReview = mongoose.model('DeliveryManReview', deliveryManReviewSchema);

module.exports = DeliveryManReview;
