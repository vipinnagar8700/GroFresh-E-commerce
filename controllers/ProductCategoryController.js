const express = require('express');
const ProductCategory = require('../models/productCategory');

// Create a new product category
const createProductCategory = async (req, res) => {
  try {
    const { Category_name } = req.body;

    // Check if Category_name field is provided
    if (!Category_name) {
      return res.status(400).json({ message: 'Category name field is required', status: false });
    }

    // Check if a category with the same name already exists
    const existingCategory = await ProductCategory.findOne({ Category_name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with the same name already exists', status: false });
    }

    let imageUrl;
    const file = req.file;

    if (file) {
      // Store image locally in the public/images directory
      imageUrl = 'images/' + file.filename;
      req.body.image = imageUrl;
    }

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

    let updatedData = req.body;
    let imageUrl;
    const file = req.file;

    if (file) {
      // Store image locally in the public/images directory
      imageUrl = 'images/' + file.filename;
      updatedData.image = imageUrl; // Add the image URL to the updated data
    }

    const updatedCategory = await ProductCategory.findByIdAndUpdate(id, updatedData, { new: true });
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
  
