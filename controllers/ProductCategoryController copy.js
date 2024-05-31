const express = require('express');
const attribute = require('../models/attributesModel');

// Create a new product category
const createattribute = async (req, res) => {
  try {
    const newCategory = await attribute.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all product categories
const allProductattribute = async (req, res) => {
  try {
    const categories = await attribute.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product category by ID
const singleattribute = async (req, res) => {
  try {
    const category = await attribute.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'attribute not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a single product category by ID
const deleteattribute = async (req, res) => {
    try {
      const category = await attribute.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'attribute not found' });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update a single product category by ID
const updateattribute = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await attribute.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'attribute not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createattribute,
    allProductattribute,
    singleattribute,
    updateattribute,
    deleteattribute
  };
  
