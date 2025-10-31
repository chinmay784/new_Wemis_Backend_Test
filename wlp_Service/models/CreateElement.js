const mongoose = require("mongoose");


const CreateElement = new mongoose.Schema({
    elementCategoryModelId: {
        type: mongoose.Types.ObjectId,
        ref: "ElementCategory"
    },
    elementName: {
        type: String,
        trim: true,
    },
    is_Vltd: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("CreateElement", CreateElement);