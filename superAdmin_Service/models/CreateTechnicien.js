const mongoose = require("mongoose");


const Technicien = new mongoose.Schema({
    manufacturId:{type: mongoose.Schema.Types.ObjectId , ref:"ManuFactur"},
    distributorName:{ type:String , trim:true },
    delerName:{ type:String , trim:true },
    name:{ type:String , trim:true },
    gender:{ type:String , trim:true },
    email:{ type:String , trim:true },
    mobile:{ type:String , trim:true },
    adhar:{ type:String , trim:true },
    dateOfBirth:{ type:String , trim:true },
    qualification:{ type:String , trim:true },
    distributorId:{type: mongoose.Schema.Types.ObjectId , ref:"Distributor" },
    distributorUnderDelerId:{type: mongoose.Schema.Types.ObjectId , ref:"CreateDelerUnderDistributor" },
});


module.exports = mongoose.model("Technicien",Technicien)