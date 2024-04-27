const Product = require('../models/product');


// Create a new product category
const createProduct = async (req, res) => {
  try {
    const { name, category_ids } = req.body;

    // Check if Product_name and Category_name fields are provided
    if (!name || !category_ids) {
      return res.status(400).json({ message: 'Product name and Category_name fields are required', status: false });
    }

    // Check if a product with the same Product_name and Category_name already exists
    const existingProduct = await Product.findOne({ name, category_ids });
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
    const ProductItem = await Product.find()
    .populate('category_ids')
    .populate('Sub_Category_Name')
    .populate('attributes')
    .populate({
      path: 'active_reviews',
      model: 'ProductReview' // Assuming 'ProductReview' is the name of the review model
      , populate: {
        path: 'customer_id', // Assuming 'customer_id' is the reference field for the customer
        model: 'Customer' // Assuming 'Customer' is the name of the customer model
      }
    })
    .populate({
      path: 'rating',
      model: 'ProductReview' // Assuming 'ProductReview' is the name of the review model
      , populate: {
        path: 'customer_id', // Assuming 'customer_id' is the reference field for the customer
        model: 'Customer' // Assuming 'Customer' is the name of the customer model
      }
    });
  
    const length = ProductItem.length;
    res.json({products: ProductItem, total_size: length, status: true,limit:10,offset:null});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Filter Product Api
const ProductFilter = async (req, res) => {
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
};

// Get Featured all products
const AllFeaturedProduct = async (req, res) => {
  try {
    const ProductItem = await Product.find({ is_featured: 1 })
                                     .populate('category_ids')
                                     .populate('Sub_Category_Name')
                                     .populate('attributes');
    const length = ProductItem.length;
    res.json({ products: ProductItem, total_size: length, status: true,limit:10,offset:null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const AllCategoryClilds = async (req, res) => {
  console.log(req.params.id,"id")
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
};
// Get Featured all products
const AllDailyNeedProduct = async (req, res) => {
  try {
    const ProductItem = await Product.find({ daily_needs: 1 })
                                     .populate('category_ids')
                                     .populate('Sub_Category_Name')
                                     .populate('attributes');
    const length = ProductItem.length;
    res.json({ products: ProductItem, total_size: length, status: true,limit:10,offset:null });
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
      const ProductItem = await Product.findByIdAndDelete(req.params.id);
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
    deleteProduct,AllFeaturedProduct,AllDailyNeedProduct,ProductFilter,AllCategoryClilds
  };
  