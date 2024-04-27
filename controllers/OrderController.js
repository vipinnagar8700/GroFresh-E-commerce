const mongoose = require('mongoose');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const uuid = require('uuid');
const product = require('../models/product');

// Controller function to create an order from the Cart of a single user
const createOrderFromCart = async (req, res) => {
    try {
        // Get the user ID from the request body
        const { CustomerUserId } = req.body;

        // Find the Cart associated with the user
        const cart = await Cart.findOne({ customer: CustomerUserId }).populate('products.product');

        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: 'Cart is empty for this user', status: false });
        }

        // Calculate the order amount by summing up the prices of all products in the cart
        let orderAmount = 0;
        for (const item of cart.products) {
            const producta = await product.findById(item.product);
            if (producta) {
                orderAmount += producta.price * item.quantity;
            } else {
                // Handle the case where the product is not found (optional)
                console.error(`Product with ID ${item.product} not found`);
            }
        }

        // Generate a unique order ID
        const orderId = generateOrderId();

        // Extract customerId and products from the Cart
        const customerId = cart.customer;
        const cartData = cart.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        // Create a new order document
        const newOrder = new Order({
            customer_id: CustomerUserId,
            order_id: orderId,
            customer: customerId,
            cart_data: cartData,
            order_amount: orderAmount.toFixed(2), // Assuming you want to keep order_amount as a string with two decimal places
            delivery_address: cart.delivery_address,
            // You can add other fields like payment_method, order_status, etc.
        });

        // Save the created order in the database
        const savedOrder = await newOrder.save();

        // Clear the user's Cart after creating the order
        cart.products = [];
        await cart.save();

        // Send a response with success message and order details
        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const allOrder = async (req, res) => {
    try {
        const allOrders = await Order.find().populate({
            path: 'cart_data.product',
            model: 'Product', // Assuming 'Product' is the model name for products
            populate: [
                {
                    path: 'category_ids',
                    model: 'ProductCategory' // Assuming 'ProductCategory' is the model name for categories
                },
                {
                    path: 'Sub_Category_Name',
                    model: 'ProductSubCategory' // Assuming 'ProductSubCategory' is the model name for sub-categories
                }
            ]
        }).populate('customer_id').sort({ _id: -1 });

        res.status(200).json({ message: 'Order Data Retrieved successfully!', orders: allOrders,length:allOrders.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const CustomerOrder = async (req, res) => {
    
    try {
        const allOrders = await Order.find({customer_id:req.user.userId}).populate({
            path: 'cart_data.product',
            model: 'Product', // Assuming 'Product' is the model name for products
            populate: [
                {
                    path: 'category_ids',
                    model: 'ProductCategory' // Assuming 'ProductCategory' is the model name for categories
                },
                {
                    path: 'Sub_Category_Name',
                    model: 'ProductSubCategory' // Assuming 'ProductSubCategory' is the model name for sub-categories
                }
            ]
        }).populate('customer_id').sort({ _id: -1 });

        res.status(200).json({ message: 'Order Data Retrieved successfully!', orders: allOrders ,length:allOrders.length});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Function to generate a unique order ID
const generateOrderId = () => {
    // Implement your logic to generate a unique order ID here
    return uuid.v4();
};

module.exports = { createOrderFromCart ,allOrder,CustomerOrder};
