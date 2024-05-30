const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address_type: {
        type: String,
        required: true,
        enum: ['Home', 'Office', 'Other'] // Adjust this according to the expected values
    },
    contact_person_number: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    is_guest: {
        type: Number,
        default: 0,
    },
    contact_person_name: {
        type: String,
        required: true,
    },
    road: {
        type: String,
        required: true,
    },
    house: {
        type: String,
        required: true,
    },
    floor: {
        type: String,
        required: true,
    }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
