const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const CartSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    products: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 } // Default quantity is 1
    }],
}, {
    timestamps: true
});

// Method to add product to Cart
CartSchema.methods.addProduct = async function(productId, quantity = 1) {
    const existingProductIndex = this.products.findIndex(item => item.product.equals(productId));
    
    if (existingProductIndex === -1) {
        // If product doesn't exist in the cart, add it with the given quantity
        this.products.push({ product: productId, quantity });
    } else {
        // If product already exists in the cart, update its quantity
        this.products[existingProductIndex].quantity += 1;
    }
    await this.save();
};


// Method to decrease product quantity in Cart
// Method to decrease product quantity in Cart
CartSchema.methods.decreaseProductQuantity = async function(productId) {
    const existingProductIndex = this.products.findIndex(item => item.product.equals(productId));

    if (existingProductIndex !== -1) {
        if (this.products[existingProductIndex].quantity > 1) {
            // If product quantity is greater than 1, decrease its quantity by 1
            this.products[existingProductIndex].quantity -= 1;
        } else {
            // If product quantity is 1, remove the product from the cart
            this.products.splice(existingProductIndex, 1);
        }

        await this.save();
    }
};

//Export the model
module.exports = mongoose.model('Cart', CartSchema);
