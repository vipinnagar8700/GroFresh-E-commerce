const ReferralCode = require("../models/referalCodeModel");
const { Customer } = require("../models/userModel");



const getReferralCodeByUserId = async (req, res) => {
    const userId = req.user.userId; // Assuming req.user.userId contains the user's ID

    try {
        // Find the customer document based on the user_id field
        const customer = await Customer.findOne({ user_id: userId });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
console.log(customer)
        // Retrieve the referral codes using the customer's _id
        const referralCodes = await ReferralCode.find({ user: customer.user_id }).populate('user');
console.log(referralCodes)
        // Extract only the ObjectId values from the referral codes

        res.status(200).json({data:referralCodes,message:'Referal Code Successfully retrived',success:true});
    } catch (error) {
        console.error('Error fetching referral codes:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get a single ReferralCode by its ID
const getReferralCodeById = async (req, res) => {
    const userId = req.user.userId;
    const ReferralCodeId = req.params.ReferralCodeId;
    try {
        const ReferralCode = await ReferralCode.findOne({ _id: ReferralCodeId, user_id: userId });
        if (!ReferralCode) {
            return res.status(404).json({ message: 'ReferralCode not found' });
        }
        res.status(200).json(ReferralCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update an existing ReferralCode
const updateReferralCode = async (req, res) => {
    const userId = req.user.userId;
    const ReferralCodeId = req.params.ReferralCodeId;
    try {
        const updatedReferralCode = await ReferralCode.findOneAndUpdate(
            { _id: ReferralCodeId, user_id: userId },
            { $set: req.body },
            { new: true }
        );
        if (!updatedReferralCode) {
            return res.status(404).json({ message: 'ReferralCode not found or user unauthorized' });
        }
        res.status(200).json(updatedReferralCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to delete an ReferralCode
const deleteReferralCode = async (req, res) => {
    const userId = req.user.userId;
    const ReferralCodeId = req.params.ReferralCodeId;
    try {
        const deletedReferralCode = await ReferralCode.findOneAndDelete({ _id: ReferralCodeId, user_id: userId });
        if (!deletedReferralCode) {
            return res.status(404).json({ message: 'ReferralCode not found or user unauthorized' });
        }
        res.status(200).json({ message: 'ReferralCode deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReferralCodeByUserId,
    getReferralCodeById,
    updateReferralCode,
    deleteReferralCode
};
