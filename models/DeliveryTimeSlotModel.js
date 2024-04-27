const mongoose = require('mongoose');

// Define the schema for the DeliveryTimeSlot model
const DeliveryTimeSlotSchema = new mongoose.Schema({
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    is_available: {
        type: Boolean,
        default: true
    },Branch:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Branch' 
    }
});

// Export the DeliveryTimeSlot model
module.exports = mongoose.model('DeliveryTimeSlot', DeliveryTimeSlotSchema);
