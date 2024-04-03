const Banner = require('../models/BannerModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});



const createBanner = asyncHandler(async (req, res) => {
  try {
    let imageUrl;
    const file = req.file;
    if (file) {
      // Assuming 'filename' is the property containing the name of the uploaded file
      imageUrl = file.filename; // Assuming 'filename' is the property containing the name of the uploaded file
    }

    const newBanner = await Banner.create({ image: imageUrl });
    console.log('Banner created successfully:', newBanner);
    res.status(201).json({ message: "Banner added Successfully!", status: true, data: newBanner });
  } catch (err) {
    console.error('Error creating banner:', err);
    res.status(400).json({ message: err.message, status: false });
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
    const file = req.file;

    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'Banner', // Specify your Cloudinary folder
          resource_type: 'auto',
        });
        updatedData.imageUrl = result.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).json({
          message: 'Internal Server Error',
          success: false,
        });
      }
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
  
