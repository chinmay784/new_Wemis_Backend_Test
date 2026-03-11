const mongoose = require('mongoose');

const wlpActivationSchema = new mongoose.Schema({
    wlpCreatorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Wlp"
    },

    elementName:String,

    packageName:String,

    packageType:String,

    billingCycle:Number, // days

    price:{
        type:Number,
        default:0
    },

    distributorAndOemMarginPrice:{
        type:Number,
        default:0
    },

    delerMarginPrice:{
        type:Number,
        default:0
    },

    totalPrice:{
        type:Number,
        default:0
    },

    description:String

});

module.exports = mongoose.model("wlpActivation", wlpActivationSchema);