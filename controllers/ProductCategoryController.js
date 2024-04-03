const express = require('express');
const ProductCategory = require('../models/productCategory');

// Create a new product category
const createProductCategory = async (req, res) => {
  try {
    const newCategory = await ProductCategory.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all product categories
const allProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product category by ID
const singleProductCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a single product category by ID
const deleteProductCategory = async (req, res) => {
    try {
      const category = await ProductCategory.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update a single product category by ID
const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createProductCategory,
    allProductCategories,
    singleProductCategory,
    updateProductCategory,
    deleteProductCategory
  };
  
