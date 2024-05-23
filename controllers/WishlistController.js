const WishlistModel = require('../models/WishlistModel');
const { Customer } = require('../models/userModel');

// Add Product to Wishlist
const addProductToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;
        console.log(userId, "userId");

        // Find the customer
        const customer = await Customer.findOne({ user_id: userId });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find or create the wishlist for the customer
        let wishlist = await WishlistModel.findOne({ customer: customer._id });
        console.log(wishlist, "wishlist");
        if (!wishlist) {
            wishlist = new WishlistModel({ customer: customer._id, products: [] });
        }

        // Check if the product is already in the wishlist
        const productIndex = wishlist.products.indexOf(productId);

        if (productIndex > -1) {
            // If the product is already in the wishlist, remove it
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            return res.status(200).json({ message: 'Product removed from wishlist successfully', status: true });
        } else {
            // If the product is not in the wishlist, add it
            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ message: 'Product added to wishlist successfully', status: true });
        }
    } catch (error) {
        console.error('Error updating wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove Product from Wishlist
const removeProductFromWishlist = async (req, res) => {
    try {
        const { id } = req.params; // Assuming productId is passed in the URL params
        const wishlist = await WishlistModel.findOne({ user: req.user.userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        wishlist.products = wishlist.products.filter(product => product._id !== id);
        await wishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// List Wishlist Products
const listWishlistProducts = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId,"userId")
        // Find the customer
        const customer = await Customer.findOne({user_id:userId});
        // Fetch a wishlist document (assuming you have a user ID or some identifier)
        const wishlist = await WishlistModel.findOne({ customer: customer._id }).populate({
            path: 'products',
            populate: [
                { path: 'category_ids' },
                { path: 'Sub_Category_Name' }
            ]
        });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        // Extract products from the wishlist
        const products = wishlist.products;
        res.status(200).json({   "total_size": products.length,
        "limit": 500,
        "offset": 1,products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const listWishlistProducts_all = async (req, res) => {
    try {
        // Fetch a wishlist document (assuming you have a user ID or some identifier)
        const wishlist = await WishlistModel.find().populate({
            path: 'products',
            populate: [
                { path: 'category_ids' },
                { path: 'Sub_Category_Name' }
            ]
        }).populate('customer');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        // Extract products from the wishlist
        // const products = wishlist?.products;
        res.status(200).json({  
        "limit": 500,
        "offset": 1,wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = { addProductToWishlist, removeProductFromWishlist, listWishlistProducts,listWishlistProducts_all };
