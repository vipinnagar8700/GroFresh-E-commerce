const express = require('express');
const Product = require('../models/product');

// Create a new product category
const createProduct = async (req, res) => {
  try {
    const newCategory = await Product.create(req.body);
    res.status(201).json({message:"Product Successfully added!",status:true});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all product categories
const AllProduct = async (req, res) => {
  try {
    const ProductItem = await Product.find().populate('Category_name').populate('Sub_Category_Name').populate('attributes');
    const length = ProductItem.length;
    res.json({data:ProductItem,length:length,status:true});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product category by ID
const singleProduct = async (req, res) => {
  try {
    const ProductItem = await Product.findById(req.params.id);
    if (!ProductItem) {
      return res.status(404).json({ message: 'ProductItem not found' });
    }
    res.json(ProductItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a single product category by ID
const deleteProduct = async (req, res) => {
    try {
      const ProductItem = await Product.findById(req.params.id);
      if (!ProductItem) {
        return res.status(404).json({ message: 'ProductItem not found' });
      }
      res.json(ProductItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update a single product category by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const ProductItem = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!ProductItem) {
      return res.status(404).json({ message: 'ProductItem not found' });
    }
    res.json(ProductItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createProduct,
    AllProduct,
    singleProduct,
    updateProduct,
    deleteProduct
  };
  
