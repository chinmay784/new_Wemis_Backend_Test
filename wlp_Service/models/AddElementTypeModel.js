const mongoose = require("mongoose");



const ElementTypeModel = new mongoose.Schema({
    // elementId:{
    //     type:mongoose.Types.ObjectId,
    //     ref:"CreateElement"
    // },
    elementName: {
        type: String,
        trim: true
    },
    sim:{
        type:Number,
        default:0,
    },
    elementType: {
        type: String,
        trim: true
    }
});


module.exports = mongoose.model("TypeElementModel",ElementTypeModel);