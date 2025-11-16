const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticketIssueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketIssue",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    // Optional: Image / File URL
    // fileUrl: {
    //     type: String,
    //     default: null
    // },

    // delivery status
    delivered: {
        type: Boolean,
        default: false
    },

    // read status
    read: {
        type: Boolean,
        default: false
    },

    // message type (optional: text, image, file)
    messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text"
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
