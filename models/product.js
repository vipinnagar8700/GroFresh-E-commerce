const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  category_ids: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
  },
  Sub_Category_Name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductSubCategory",
  },
  unit: {
    type: String,
    default: null,
  },
  capacity: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
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
  price: {
    type: String,
    default: null,
  },
  total_stock: {
    type: String,
    default: null,
  },
  discount_type: {
    type: String,
    default: null,
  },
  discount: {
    type: String,
    default: null,
  },
  tax_type: {
    type: String,
    default: null,
  },
  tax: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    default: 0,
  },
  daily_needs: {
    type: Number,
    default: 0
  },
  is_featured: {
    type: Number,
    default: 0
  },
  variations:[],
  choice_options:[],
  popularity_count:{
    type: Number,
    default: 0
  },
  view_count:{
    type: Number,
    default: 0
  },
  maximum_order_quantity:{
    type: String,
    default: null
  },
  rating:[],
  active_reviews:[],
  category_discount:{
    type: Number,
    default: 0
  },
  wishlist_count:{
    type: Number,
    default: 0
  }
},{
  timestamps:{
      type: Date,
      default: Date.now
  }
});

//Export the model
module.exports = mongoose.model("Product", ProductSchema);
