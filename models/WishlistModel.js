const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var WishlistSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, {
    timestamps: true
});

// Method to add product to wishlist
WishlistSchema.methods.addProduct = async function(productId) {
    if (!this.products.includes(productId)) {
        this.products.push(productId);
        await this.save();
    }
};

//Export the model
module.exports = mongoose.model('Wishlist', WishlistSchema);
