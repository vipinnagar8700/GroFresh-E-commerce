const express = require('express');
const multer = require('multer');
const path = require('path');
const ProductCategory = require('../models/productCategory');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dlkvhcuux",
  api_key: "966965831223668",
  api_secret: "a-rZ3B3TrnXeA5Qh3hAU0mWr5-8",
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: './public/images', // Specify the destination folder
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (optional)
});

// Create a new product category
const createProductCategory = asyncHandler(async (req, res) => {
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
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'product_categories', // Optional: specify a folder in Cloudinary
      });
      imageUrl = result.secure_url;
      req.body.image = imageUrl;
    }

    const newCategory = await ProductCategory.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all product categories
const allProductCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product category by ID
const singleProductCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a single product category by ID
const deleteProductCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.remove();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a single product category by ID
const updateProductCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    let updatedData = req.body;
    let imageUrl;
    const file = req.file;

    if (file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'product_categories', // Optional: specify a folder in Cloudinary
      });
      imageUrl = result.secure_url;
      updatedData.image = imageUrl;
    }

    const updatedCategory = await ProductCategory.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  createProductCategory,
  allProductCategories,
  singleProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
