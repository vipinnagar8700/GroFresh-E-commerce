const mongoose = require('mongoose');

// Define the schema for the DeliveryTimeSlot model
const DeliveryTimeSlotSchema = new mongoose.Schema({
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
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
