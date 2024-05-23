const ProductSubCategory = require('../models/productSubCategory');
const asyncHandler = require('express-async-handler');
// Create a new product category
const createProductSubCategory = async (req, res) => {
  try {
    const newCategory = await ProductSubCategory.create(req.body);
    res.status(201).json({message:"Sub Category Successfully added",status:true});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all product categories
const allProductSubCategories = async (req, res) => {
  try {
    const categories = await ProductSubCategory.find().populate('Main_Category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product category by ID
const singleProductSubCategory = async (req, res) => {
  try {
    const category = await ProductSubCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a single product category by ID
const deleteProductSubCategory = async (req, res) => {
    try {
      const category = await ProductSubCategory.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found',status:false });
      }
      res.json({message:'Data Deleted Successfully!',status:true});
    } catch (err) {
      res.status(500).json({ message: err.message ,status:false});
    }
  };

// Update a single product category by ID
const updateProductSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await ProductSubCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' ,status:false});
    }
    res.json({message:'Data Successfully Updated!',status:true});
  } catch (err) {
    res.status(500).json({ message: err.message ,status:false});
  }
};

const updateSubProductCategoryStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID
    const category = await ProductSubCategory.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Sub-Category not found' ,status:false});
    }

    // Toggle the status
    const newStatus = category.status === 'pending' ? 'active' : 'pending';

    // Update the status
    category.status = newStatus;
    const updatedCategory = await category.save();

    // Send the updated category as a response
    res.json({message:'Status Updated Successfully!',status:true});
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: err.message, status:false});
  }
})

module.exports = {
    createProductSubCategory,
    allProductSubCategories,
    singleProductSubCategory,
    updateProductSubCategory,
    deleteProductSubCategory,updateSubProductCategoryStatus
  };
  
