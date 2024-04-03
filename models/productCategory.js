const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductCategorySchema = new mongoose.Schema({
    Category_name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    image:{
        type:String,
        default:null,
    },
    status:{
        type:String,
        default:"pending",
    }
});

//Export the model
module.exports = mongoose.model('ProductCategory', ProductCategorySchema);