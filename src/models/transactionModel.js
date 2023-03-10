const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({

    // userId: { type: String, required: true, trim: true },
    bankFullName: { type: String, default: "Housing Development Finance Corporation Limited" },

    bankName: { type: String, default: "HDFC" },

    bankType: { type: String, default: "PRIVATE" },

    branchName: { type: String, required: true, uppercase: true, trim: true },

    IFSC: { type: String, required: true, uppercase: true, trim: true },

    accountNumber: { type: Number, required: true },

    transactionStatus: { type: String },// completed , failed , cancelled

    transactionType: { type: String },

    amount: { type: Number },

    currentBalance: { type: Number },

    //for reciever details
    beneficiaryName: { type: String,  uppercase: true, trim: true },

    beneficiaryAccountNo: { type: String,  uppercase: true, trim: true },

    beneficiaryIFSC: { type: String,  uppercase: true, trim: true },

    beneficiaryBranch: { type: String,  uppercase: true, trim: true },

    // for sender details
    senderName: { type: String, uppercase: true, trim: true },

    senderAccountNo: { type: String, uppercase: true, trim: true },

    senderIFSC: { type: String, uppercase: true, trim: true },

    senderBranch: { type: String, uppercase: true, trim: true },

    // OTP: { type: String, required: true, trim: true },

}, { timestamps: true })


module.exports = mongoose.model("Transaction", transactionSchema);