const Product = require('../models/product');

// Create a new product category
const createProduct = async (req, res) => {
  try {
    const { Product_name, Category_name } = req.body;

    // Check if Product_name and Category_name fields are provided
    if (!Product_name || !Category_name) {
      return res.status(400).json({ message: 'Product_name and Category_name fields are required', status: false });
    }

    // Check if a product with the same Product_name and Category_name already exists
    const existingProduct = await Product.findOne({ Product_name, Category_name });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with the same name and category already exists', status: false });
    }

    let imageUrl;
    const file = req.file;

    if (file) {
      // Store image locally in the public/images directory
      imageUrl = 'images/' + file.filename;
      req.body.image = imageUrl; // Add the image URL to the request body
    }

    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: "Product successfully added!", status: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ message: err.message, status: false });
  }
};



// Get all product categories
const AllProduct = async (req, res) => {
  try {
    const ProductItem = await Product.find().populate('Category_name').populate('Sub_Category_Name').populate('attributes');
    const length = ProductItem.length;
    res.json({data:ProductItem,length:length,status:true});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product category by ID
const singleProduct = async (req, res) => {
  try {
    const ProductItem = await Product.findById(req.params.id);
    if (!ProductItem) {
      return res.status(404).json({ message: 'ProductItem not found' });
    }
    res.json(ProductItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a single product category by ID
const deleteProduct = async (req, res) => {
    try {
      const ProductItem = await Product.findById(req.params.id);
      if (!ProductItem) {
        return res.status(404).json({ message: 'ProductItem not found' });
      }
      res.json(ProductItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Update a single product category by ID
const updateProduct = async (req, res) => {
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

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createProduct,
    AllProduct,
    singleProduct,
    updateProduct,
    deleteProduct
  };
  
