// AgentUserModel.js

const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const AgentUserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
}, {
    timestamps: {
        type: Date,
        default: Date.now
    }
});

// Export the model
module.exports = mongoose.model('AgentUser', AgentUserSchema);
