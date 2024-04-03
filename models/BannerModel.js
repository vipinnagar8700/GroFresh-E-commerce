const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var BannerSchema = new mongoose.Schema({
    tittle:{
        type:String,
        required:true,
        unique:true,
    },
    Item_type:{
        type:String,
        default:null,
    },
    Product_name:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    Category_name:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
    },
    status:{
        type:String,
        default:"pending",
    },image:{
        type:String,
        default:null,
    }
},{
    timestamps:{
        type: Date,
        default: Date.now
    }
});

//Export the model
module.exports = mongoose.model('Banner', BannerSchema);