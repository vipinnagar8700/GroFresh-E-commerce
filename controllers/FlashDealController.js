const FlashDeal = require('../models/FlaseDeal.Model');
const Product = require('../models/product');
// Create a new flash deal
const createFlashDeal = async (req, res) => {
  try {
    const flashDeal = new FlashDeal(req.body);
    await flashDeal.save();
    res.status(201).json(flashDeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all flash deals
const getAllFlashDeals = async (req, res) => {
    try {
        const flashDeals = await FlashDeal.find().populate({
            path: 'products',
            model: 'Product',
            populate: [
                {
                    path: 'category_ids',
                    model: 'ProductCategory'
                },
                {
                    path: 'Sub_Category_Name',
                    model: 'ProductSubCategory'
                }
            ]
        });

      res.json({ 
        total_size: flashDeals.length,
        limit: null,
        offset: null,
        flash_deal: flashDeals
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get a single flash deal by ID
const getFlashDealById = async (req, res) => {
  try {
    const flashDeal = await FlashDeal.findById(req.params.id).populate('products');
    if (!flashDeal) {
      return res.status(404).json({ message: 'Flash deal not found' });
    }
    res.json(flashDeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a flash deal by ID
const updateFlashDealById = async (req, res) => {
    try {
        // Find the Flash Deal by ID
        const flashDeal = await FlashDeal.findById(req.params.id);
        if (!flashDeal) {
            return res.status(404).json({ message: 'Flash deal not found' });
        }

        // Ensure req.body.products is an array
        const productsToAdd = Array.isArray(req.body.products) ? req.body.products : [req.body.products];

        // Add products to the Flash Deal's 'products' array
        await FlashDeal.findByIdAndUpdate(
            req.params.id,
            { $push: { products: { $each: productsToAdd } } },
            { new: true }
        );

        res.json({ message: 'Products added to flash deal successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  };
  

// Delete a flash deal by ID
const deleteFlashDealById = async (req, res) => {
  try {
    const flashDeal = await FlashDeal.findByIdAndDelete(req.params.id);
    if (!flashDeal) {
      return res.status(404).json({ message: 'Flash deal not found' });
    }
    res.json({ message: 'Flash deal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFlashDeal,
  getAllFlashDeals,
  getFlashDealById,
  updateFlashDealById,
  deleteFlashDealById
};
