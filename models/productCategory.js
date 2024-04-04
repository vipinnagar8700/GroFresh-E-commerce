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
    parent_id:{
        type:Number,
        default:0,
    },
    position:{
        type:Number,
        default:0,
    },
    priority:{
        type:String,
        default:null,
    },
    translations:[{
        type:String,
        default:null,
    }],
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
module.exports = mongoose.model('ProductCategory', ProductCategorySchema);