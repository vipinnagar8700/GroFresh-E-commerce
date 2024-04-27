const DeliveryTimeSlot = require('../models/DeliveryTimeSlotModel');

// Controller function to create a new delivery time slot
const  createDeliveryTimeSlot = async (req, res) => {
    try {
        const { start_time, end_time, is_available } = req.body;
        const newTimeSlot = await DeliveryTimeSlot.create({ start_time, end_time, is_available });
        res.status(201).json(newTimeSlot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get all delivery time slots
const  getAllDeliveryTimeSlots = async (req, res) => {
    try {
        const timeSlots = await DeliveryTimeSlot.find();
        res.json(timeSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get a specific delivery time slot by ID
const  getDeliveryTimeSlotById = async (req, res) => {
    try {
        const timeSlot = await DeliveryTimeSlot.findById(req.params.id);
        if (!timeSlot) {
            return res.status(404).json({ message: 'Delivery time slot not found' });
        }
        res.json(timeSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update a delivery time slot by ID
const  updateDeliveryTimeSlotById = async (req, res) => {
    try {
        const { start_time, end_time, is_available } = req.body;
        const updatedTimeSlot = await DeliveryTimeSlot.findByIdAndUpdate(
            req.params.id,
            { start_time, end_time, is_available },
            { new: true }
        );
        if (!updatedTimeSlot) {
            return res.status(404).json({ message: 'Delivery time slot not found' });
        }
        res.json(updatedTimeSlot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete a delivery time slot by ID
const  deleteDeliveryTimeSlotById = async (req, res) => {
    try {
        const deletedTimeSlot = await DeliveryTimeSlot.findByIdAndDelete(req.params.id);
        if (!deletedTimeSlot) {
            return res.status(404).json({ message: 'Delivery time slot not found' });
        }
        res.json({ message: 'Delivery time slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    deleteDeliveryTimeSlotById,
    updateDeliveryTimeSlotById,
    getDeliveryTimeSlotById,
    getAllDeliveryTimeSlots,
    createDeliveryTimeSlot
  };
  
