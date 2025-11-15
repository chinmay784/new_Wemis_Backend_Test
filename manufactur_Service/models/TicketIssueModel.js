const mongoose = require("mongoose");

const TicketIssue = new mongoose.Schema({
    coustmerTicketIssueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoustmerDevice',
    },
    delerTicketIssueId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreateDelerUnderDistributor',
    },
    ticketIssueNo: { type: Number, unique: true },
    vechileNo: { type: String, trim: true },
    issueType: { type: String, trim: true },
    issueDescription: { type: String, trim: true },
    issuseAssignTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "issuseAssignToModel"
    },
    address:{
        type: String,
        trim: true
    },
    // This field decides which model the ObjectId refers to
    issuseAssignToModel: {
        type: String,
        enum: ["ManuFactur", "CreateDelerUnderDistributor", "createDelerUnderOems", "OemModelSchema", "Distributor"]
    },
    issueStatus: { type: String, trim: true, default: "Open" },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("TicketIssue", TicketIssue);