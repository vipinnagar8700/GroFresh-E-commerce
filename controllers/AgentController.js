// Import the AgentUser model without destructuring
const AgentUser = require("../models/AgentUserModel");

const {Agent} = require("../models/userModel");

const AllAgents = async (req, res) => {
    try {
      const agents = await Agent.find().sort({ _id: -1 });
      res.json(agents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const createUserByAgent = async (req, res) => {
    const { name, email, phone, agentId,IEMI1,IEMI2 } = req.body;
 
    try {
      // Check if the agent exists
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent was  not found" });
      }
  
      // Create the user
      const newUser = await AgentUser.create({
        name,
        email,
        phone,IEMI1,IEMI2 ,
        agent_id: agentId,
      });
  
      res.status(201).json({newUser,message:"User Added Successfully!"});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
const getAllUsersByAgent = async (req, res) => {
    const {id} =req.params;
    console.log(id,"agentId")
    try {
      // Find all users associated with the agent
      const users = await AgentUser.find({agent_id:id} ).sort({ _id: -1 });
  
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

module.exports = {
    AllAgents,
    createUserByAgent,
    getAllUsersByAgent
};
