const express = require('express');
const multer = require('multer');
const path = require('path');
const Banner = require('../models/BannerModel');
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

// Create Banner
const createBanner = asyncHandler(async (req, res) => {
  const { tittle, Item_type, Product_name, Category_name } = req.body;

  try {
    // Check if all required fields are provided
    if (!tittle || !Item_type || !Product_name || !Category_name) {
      return res.status(400).json({ message: 'All fields are required', status: false });
    }

    // Check if a banner with the same title already exists
    const existingBanner = await Banner.findOne({ tittle });
    if (existingBanner) {
      return res.status(400).json({ message: 'Banner with the same title already exists', status: false });
    }

    let imageUrl;
    const file = req.file;

    if (file) {
      // Store image locally in the public/images directory
      imageUrl = 'images/' + file.filename;
    }

    // Create a new banner with image URL
    const newBanner = await Banner.create({ tittle, Item_type, Product_name, Category_name, image: imageUrl });
    console.log('Banner created successfully:', newBanner);

    // Return success response
    res.status(201).json({ message: 'Banner added successfully!', status: true, data: newBanner });
  } catch (err) {
    // Handle different types of errors
    if (err.name === 'ValidationError') {
      // Validation error
      res.status(400).json({ message: err.message, status: false });
    } else {
      // Other errors
      console.error('Error creating banner:', err);
      res.status(500).json({ message: 'Internal Server Error', status: false });
    }
  }
});

// Get all product categories
const allProductBanner = async (req, res) => {
  try {
    const categories = await Banner.find().sort({ _id: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product category by ID
const singleBanner = async (req, res) => {
  try {
    const category = await Banner.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a single product category by ID
const deleteBanner = async (req, res) => {
    try {
      const category = await Banner.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Banner not found' });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update a single product banner by ID
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    let updatedData = req.body;
    let imageUrl;
    const file = req.file;

    if (file) {
      // Store image locally in the public/images directory
      imageUrl = 'images/' + file.filename;
      updatedData.image = imageUrl; 
    }
    const updatedBanner = await Banner.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(updatedBanner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createBanner,
    allProductBanner,
    singleBanner,
    updateBanner,
    deleteBanner
  };
  
