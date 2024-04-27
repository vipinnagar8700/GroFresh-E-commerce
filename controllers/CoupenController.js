const express = require('express');
const router = express.Router();
const Coupon = require('../models/CouponModel');

// Create a new coupon
const addCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({message:"Successfully added",status:true});
  } catch (error) {
    res.status(400).json({ message: error.message ,status:false});
  }
};

// Get all coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({coupons,message:"Successfully Retrived",length:coupons.length,status:true});
  } catch (error) {
    res.status(500).json({ message: error.message ,status:true});
  }
};

// Get a single coupon by ID
const getSingleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a coupon by ID
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a coupon by ID
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addCoupon, getCoupons, getSingleCoupon,updateCoupon ,deleteCoupon};
