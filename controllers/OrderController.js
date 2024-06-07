const mongoose = require('mongoose');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const uuid = require('uuid');
const product = require('../models/product');


// Controller function to create an order from the Cart of a single user
const createOrderFromCart = async (req, res) => {
    try {
        // Extract data from the request body
        const { 
            coupon_discount_amount,
            coupon_discount_title,
            payment_status,
            order_status,
            total_tax_amount,
            payment_method,
            delivery_address_id,
            checked,
            delivery_man_id,
            delivery_charge,
            order_note,
            coupon_code,
            order_type,
            branch_id,
            time_slot_id,
            date,
            delivery_date,
            callback,
            extra_discount,
            deliveryman_review_count
        } = req.body;

        // Find the Cart associated with the user
        const cart = await Cart.findOne({ customer: req.user.userId }).populate('products.product');

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

        // Apply coupon discount if available
        if (coupon_discount_amount && !isNaN(coupon_discount_amount)) {
            orderAmount -= parseFloat(coupon_discount_amount);
        }

        // Add delivery charge to the order amount
        if (delivery_charge && !isNaN(delivery_charge)) {
            orderAmount += parseFloat(delivery_charge);
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
            customer_id: req.user.userId,
            order_id: orderId,
            customer: customerId,
            cart_data: cartData,
            order_amount: orderAmount.toFixed(2), // Assuming you want to keep order_amount as a string with two decimal places
            delivery_address_id: delivery_address_id,
            delivery_date: delivery_date,
            coupon_discount_amount: coupon_discount_amount,
            coupon_discount_title: coupon_discount_title,
            payment_status: payment_status,
            order_status: order_status,
            total_tax_amount: total_tax_amount,
            payment_method: payment_method,
            checked: checked,
            delivery_man_id: delivery_man_id,
            delivery_charge: delivery_charge,
            order_note: order_note,
            coupon_code: coupon_code,
            order_type: order_type,
            branch_id: branch_id,
            time_slot_id: time_slot_id,
            date: date,
            callback: callback,
            extra_discount: extra_discount,
            deliveryman_review_count: deliveryman_review_count
        });

        // Save the created order in the database
        const savedOrder = await newOrder.save();

        // Clear the user's Cart after creating the order
        cart.products = [];
        await cart.save();

        // Send a response with success message and order details
        res.status(200).json({ message: 'Order created successfully', success:true ,order_id:savedOrder?._id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success:false });
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
        }).populate('customer_id').populate('delivery_man_id').populate('branch_id').populate('time_slot_id').sort({ _id: -1 });

        res.status(200).json({ message: 'Order Data Retrieved successfully!', orders: allOrders,length:allOrders.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const get_single_Order = async (req, res) => {
    try {
        const allOrders = await Order.findById(req.params.id).populate({
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
        }).populate('customer_id').populate('delivery_man_id').populate('branch_id').populate('time_slot_id').populate('delivery_address_id').sort({ _id: -1 });
        const totalPrice = allOrders.cart_data.reduce((total, item) => {
            const productPrice = item.product.price || 0;
            const productDiscount = item.product.discount || 0;
            const productTotal = (productPrice - productDiscount) * item.quantity;
            return total + productTotal;
        }, 0);
        console.log(totalPrice,"totalPrice");
        res.status(200).json({ message: 'Order Data Retrieved successfully!', orders: allOrders,length:allOrders.length,TotalPrice:totalPrice});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const get_single_Order_track = async (req, res) => {
    try {
        const allOrders = await Order.findById(req.params.id).populate({
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
        }).populate('customer_id').populate('delivery_man_id').populate('branch_id').populate('time_slot_id').sort({ _id: -1 });
        const totalPrice = allOrders.cart_data.reduce((total, item) => {
            const productPrice = item.product.price || 0;
            const productDiscount = item.product.discount || 0;
            const productTotal = (productPrice - productDiscount) * item.quantity;
            return total + productTotal;
        }, 0);
        console.log(totalPrice,"totalPrice");
        res.status(200).json({ message: 'Order Data Retrieved successfully!', orders: allOrders,length:allOrders.length,TotalPrice:totalPrice});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const Update_Order_status = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { order_status } = req.body;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status
        order.order_status = order_status;

        // Save the updated order
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const Update_Order_payment_status = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { payment_status } = req.body;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status
        order.payment_status = payment_status;

        // Save the updated order
        await order.save();

        res.status(200).json({ message: 'Order Payment status updated successfully', order });
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

module.exports = { createOrderFromCart ,allOrder,CustomerOrder,get_single_Order,Update_Order_status,Update_Order_payment_status,get_single_Order_track};
