const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var FlashDealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    deal_type: {
        type: String,
        enum: ['flash_deal', 'other'], // Add other possible deal types here
        default: 'other'
    },
    status: {
        type: Number,
        default: 1 // Assuming 1 represents active status
    },
    featured: {
        type: Number,
        default: 0 // Assuming 0 represents not featured and 1 represents featured
    },
    image: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    products :[]
});

//Export the model
module.exports = mongoose.model('FlashDeal', FlashDealSchema);