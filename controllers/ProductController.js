const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
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

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, category_ids,Sub_Category_Name } = req.body;

    // Check if name and category_ids fields are provided
    if (!name) {
      return res.status(400).json({ message: 'Product name field is required', status: false });
  } else if (!category_ids) {
      return res.status(400).json({ message: 'Category IDs field is required', status: false });
  } else if(!Sub_Category_Name){
    return res.status(400).json({ message: 'Sub Category IDs field is required', status: false });
  }
  

    // Check if a product with the same name and category already exists
    const existingProduct = await Product.findOne({ name, category_ids,Sub_Category_Name });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with the same name and category already exists', status: false });
    }

    let imageUrl;
    const file = req.file;

    if (file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products', // Optional: specify a folder in Cloudinary
      });
      imageUrl = result.secure_url;
      req.body.image = imageUrl; // Add the image URL to the request body
    }

    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: "Product successfully added!", status: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ message: err.message, status: false });
  }
});

// Get all products
const AllProduct = asyncHandler(async (req, res) => {
  try {
    const ProductItem = await Product.find()
      .populate('category_ids')
      .populate('Sub_Category_Name')
      .populate('attributes')
      .populate({
        path: 'active_reviews',
        model: 'ProductReview', // Assuming 'ProductReview' is the name of the review model
        populate: {
          path: 'customer_id', // Assuming 'customer_id' is the reference field for the customer
          model: 'Customer' // Assuming 'Customer' is the name of the customer model
        }
      })
      .populate({
        path: 'rating',
        model: 'ProductReview', // Assuming 'ProductReview' is the name of the review model
        populate: {
          path: 'customer_id', // Assuming 'customer_id' is the reference field for the customer
          model: 'Customer' // Assuming 'Customer' is the name of the customer model
        }
      }).sort({ _id: -1 });;

    const length = ProductItem.length;
    res.json({ products: ProductItem, total_size: length, status: true, limit: 10, offset: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter Product Api
const ProductFilter = asyncHandler(async (req, res) => {
  try {
    // Extract the category name from the request query
    const categoryName = req.query.categoryName;

    // Construct the filter based on the category name
    const filter = {};
    if (categoryName) {
      filter.Category_name = categoryName;
    }

    // Find products based on the filter and populate related fields
    const ProductItem = await Product.find(filter)
      .populate('category_ids')
      .populate('Sub_Category_Name')
      .populate('attributes');

    const length = ProductItem.length;
    res.json({ data: ProductItem, length: length, status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Featured all products
const AllFeaturedProduct = asyncHandler(async (req, res) => {
  try {
    const ProductItem = await Product.find({ is_featured: 1 })
      .populate('category_ids')
      .populate('Sub_Category_Name')
      .populate('attributes').sort({ _id: -1 });;
    const length = ProductItem.length;
    res.json({ products: ProductItem, total_size: length, status: true, limit: 10, offset: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const AllCategoryClilds = asyncHandler(async (req, res) => {
  console.log(req.params.id, "id");
  try {
    // Assuming category_ids is an array field in the Product model
    const ProductItems = await Product.find({ category_ids: req.params.id, is_featured: 1 })
      .populate('category_ids')
      .populate('Sub_Category_Name')
      .populate('attributes');
    const length = ProductItems.length;
    res.json({ data: ProductItems, length: length, status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const AllSubCategoryClilds = asyncHandler(async (req, res) => {
  console.log(req.params.id, "id");
  try {
    // Assuming category_ids is an array field in the Product model
    const ProductItems = await Product.find({ Sub_Category_Name: req.params.id, is_featured: 1 })
      .populate('category_ids')
      .populate('Sub_Category_Name')
      .populate('attributes').sort({ _id: -1 });;
    const length = ProductItems.length;
    res.json({ data: ProductItems, length: length, status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get Daily Need products
const AllDailyNeedProduct = asyncHandler(async (req, res) => {
  try {
    const ProductItem = await Product.find({ daily_needs: 1 })
      .populate('category_ids')
      .populate('Sub_Category_Name')
      .populate('attributes').sort({ _id: -1 });;
    const length = ProductItem.length;
    res.json({ products: ProductItem, total_size: length, status: true, limit: 10, offset: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product by ID
const singleProduct = asyncHandler(async (req, res) => {
  try {
    const ProductItem = await Product.findById(req.params.id);
    if (!ProductItem) {
      return res.status(404).json({ message: 'ProductItem not found' });
    }
    res.json(ProductItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a single product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const ProductItem = await Product.findByIdAndDelete(req.params.id);
    if (!ProductItem) {
      return res.status(404).json({ message: 'ProductItem not found' });
    }
    res.json(ProductItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a single product by ID
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = req.body;
    let imageUrl;
    const file = req.file;

    if (file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products', // Optional: specify a folder in Cloudinary
      });
      imageUrl = result.secure_url;
      updatedData.image = imageUrl; // Add the image URL to the updated data
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  createProduct,
  AllProduct,
  singleProduct,
  updateProduct,
  deleteProduct,
  AllFeaturedProduct,
  AllDailyNeedProduct,
  ProductFilter,
  AllCategoryClilds,AllSubCategoryClilds
};
