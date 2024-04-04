const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
  Product_name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  Category_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
  },
  Sub_Category_Name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductSubCategory",
  },
  Unit: {
    type: String,
    default: null,
  },
  Capacity: {
    type: String,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
    default: null,
  },
  Quantity: {
    type: String,
    default: null,
  },
  Visibility: {
    type: String,
    default: "off",
  },
  image: {
    type: String,
    default: null,
  },
  attributes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attribute",
  },
  Price: {
    type: String,
    default: null,
  },
  Stock: {
    type: String,
    default: null,
  },
  Discount_Type: {
    type: String,
    default: null,
  },
  Discount_Percent: {
    type: String,
    default: null,
  },
  Tax_Type: {
    type: String,
    default: null,
  },
  Tax_Rate_per: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "pending",
  },
},{
  timestamps:{
      type: Date,
      default: Date.now
  }
});

//Export the model
module.exports = mongoose.model("Product", ProductSchema);
