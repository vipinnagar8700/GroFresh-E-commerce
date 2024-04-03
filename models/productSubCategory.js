const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSubCategorySchema = new mongoose.Schema({
    SubCategory_name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    Main_Category:{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" },
    status:{
        type:String,
        default:"pending",
    }
}
,{
    timestamps:{
        type: Date,
        default: Date.now
    }
});

//Export the model
module.exports = mongoose.model('ProductSubCategory', ProductSubCategorySchema);