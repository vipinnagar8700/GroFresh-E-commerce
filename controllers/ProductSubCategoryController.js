const ProductSubCategory = require('../models/ProductSubCategory');

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
    const categories = (await ProductSubCategory.find().populate('Main_Category'));
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
      const category = await ProductSubCategory.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update a single product category by ID
const updateProductSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await ProductSubCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createProductSubCategory,
    allProductSubCategories,
    singleProductSubCategory,
    updateProductSubCategory,
    deleteProductSubCategory
  };
  
