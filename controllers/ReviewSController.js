const express = require('express');
const router = express.Router();
const ProductReview = require('../models/ProductReviewModel');
const DeliveryManReview = require('../models/DeliveryManReviewModel');
const product = require('../models/product');

const addReview = async (req, res) => {
    try {
      const { type, status } = req.body;
      if (type === 'product') {
        const review = new ProductReview(req.body);
        await review.save();
  
        // Update product rating and active_reviews
        const productId = req.body.productId;
        const producta = await product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        // Add review to active_reviews if status is 'active'
        if (status === 'active') {
          producta.active_reviews.push(review._id);
        }
        if (status === 'pending') {
            producta.rating.push(review._id);
          }
        // Save the updated product document
        await producta.save();
  
        res.status(201).json({ message: 'Review Successfully added!', status: true });
      } else if (type === 'deliveryman') {
        const review = new DeliveryManReview(req.body);
        await review.save();
        res.status(201).json({ message: 'Review Successfully added!', status: true });
      } else {
        res.status(400).json({ message: 'Invalid review type' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  

// Get all reviews (both product and delivery man)
const AllReviews =  async (req, res) => {
  try {
    const productReviews = await ProductReview.find()
    .populate('productId')
    .populate('customer_id');

    const deliveryManReviews = await DeliveryManReview.find().populate('deliveryManId')
    .populate('customer_id');;
    res.json([
        {
          Product: productReviews,
          length: productReviews.length
        },
        {
          DeliveryMan: deliveryManReviews,
          length: deliveryManReviews.length
        }
      ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {AllReviews,addReview};


