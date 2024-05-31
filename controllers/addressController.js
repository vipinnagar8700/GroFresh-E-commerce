const Address = require("../models/AddressModel");

// Controller function to add a new address
const addAddress = async (req, res) => {
    const userId = req.user.userId; 
    try {
        const {
            address_type,
            contact_person_number,
            address,
            latitude,
            longitude,
            is_guest,
            contact_person_name,
            road,
            house,
            floor
        } = req.body;

        // Create a new Address document
        const newAddress = new Address({
            address_type,
            contact_person_number,
            address,
            latitude,
            longitude,
            user_id: userId,
            is_guest,
            contact_person_name,
            road,
            house,
            floor
        });

        // Save the address to the database
        const savedAddress = await newAddress.save();
        res.status(200).json({message:'Address added Successfully',status:true});
    } catch (error) {
        res.status(400).json({ message: error.message ,status:false});
    }
};

// Controller function to get all addresses of a user
const getAddressByUserId = async (req, res) => {
    const userId = req.user.userId;
    try {
        const addresses = await Address.find({ user_id: userId });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get a single address by its ID
const getAddressById = async (req, res) => {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    try {
        const address = await Address.findOne({ _id: addressId, user_id: userId });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update an existing address
const updateAddress = async (req, res) => {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    try {
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, user_id: userId },
            { $set: req.body },
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found or user unauthorized' });
        }
        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to delete an address
const deleteAddress = async (req, res) => {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    try {
        const deletedAddress = await Address.findOneAndDelete({ _id: addressId, user_id: userId });
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found or user unauthorized' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addAddress,
    getAddressByUserId,
    getAddressById,
    updateAddress,
    deleteAddress
};
