const mongoose = require("mongoose");


const ElementCategory = new mongoose.Schema({
    elementBrandModelId:{
        type:mongoose.Types.ObjectId,
        ref:"Brandmodel"
    },
    elementCategoryName:{
        type:String,
        trim:true
    },
});


module.exports = mongoose.model("ElementCategory",ElementCategory)