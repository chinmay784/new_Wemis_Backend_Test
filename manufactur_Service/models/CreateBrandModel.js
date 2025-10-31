const mongoose = require("mongoose");


const BrandSchema = new mongoose.Schema({
    brandName:{
        type:String,
        trim:true,
    },
});


module.exports = mongoose.model("Brandmodel", BrandSchema);