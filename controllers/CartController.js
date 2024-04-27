const CartModel = require('../models/CartModel');

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { productId, quantity } = req.body;
        // Find user's cart or create a new one if not exists
        let cart = await CartModel.findOne({ customer: userId });
        if (!cart) {
            cart = new CartModel({ customer: userId, products: [] });
        }
        // Add product to cart
        await cart.addProduct(productId, quantity);

        res.status(201).json({ message: 'Product added to cart successfully' ,status:true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error',status:false });
    }
};

// Decrease product quantity in cart
const decreaseProductQuantity = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { productId } = req.body;
        
        // Find user's cart
        const cart = await CartModel.findOne({ customer: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', status: false });
        }
        
        // Decrease product quantity
        await cart.decreaseProductQuantity(productId);

        res.status(200).json({ message: 'Product quantity decreased successfully', status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', status: false });
    }
};

// List products in cart
const listCartProducts = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming you have user authentication and user ID is available in req.user.userId
        // Find user's cart
        const cart = await CartModel.findOne({ customer: userId }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found',status:false });
        }

        res.status(200).json({  "total_size": cart.products.length,
        "limit": 500,
        "offset": 1,products:cart.products,status:true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' ,status:false});
    }
};

// Delete product from cart
const deleteFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // Assuming you have user authentication and user ID is available in req.user.userId

        // Find user's cart
        const cart = await CartModel.findOne({ customer: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' ,status:false });
        }

        // Remove product from cart
        cart.products = cart.products.filter(item => !item.product.equals(id));
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart successfully' ,status:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error',status:false  });
    }
};

module.exports = { addToCart, listCartProducts, deleteFromCart ,decreaseProductQuantity};
