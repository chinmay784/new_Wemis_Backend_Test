const mongoose = require("mongoose");


const addModelNo = new mongoose.Schema({
    elementName: {
        type: String,
        trim: true,
    },
    elementType: {
        type: String,
        trim: true,
    },
    model_No: {
        type: String,
        trim: true,
    },
    voltage:{
        type:String,
        trim: true,
    }
});


module.exports = mongoose.model("AddModalNo",addModelNo)