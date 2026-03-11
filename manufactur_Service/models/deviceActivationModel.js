const mongoose = require("mongoose");

const deviceActivationSchema = new mongoose.Schema({

    deviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MapDevice",
        required:true
    },

    packageId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"wlpActivation",
        required:true
    },

    startTime:{
        type:Date,
        required:true
    },

    endTime:{
        type:Date,
        required:true
    },

    activationStatus:{
        type:String,
        enum:["Active","Ended"],
        default:"Active"
    },

    IsCycleComplite:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

deviceActivationSchema.index({
    activationStatus:1,
    endTime:1
});

module.exports = mongoose.model("DeviceActivation",deviceActivationSchema);