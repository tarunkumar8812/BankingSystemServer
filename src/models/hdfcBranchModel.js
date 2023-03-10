const mongoose = require('mongoose')
// list of branches in bank
const hdfcBranchSchema = new mongoose.Schema({
    bankFullName: { type: String, default: "HOUSING DEVELOPMENT FINANCE CORPORATION LIMITED" },

    bankName: { type: String, default: "HDFC" },

    // bankLogo: { type: String, required: true, trim: true },

    IFSC: { type: String, required: true, unique: true, uppercase: true, trim: true },

    branchName: { type: String, required: true, unique: true, uppercase: true, trim: true },

    state: { type: String, required: true, uppercase: true, trim: true },

    country: { type: String, required: true, uppercase: true, trim: true },

    totalAcounts: { type: Number, default: null },

    accountNumbers: { type: Number, default: 46721112123 },

    cardNumbers: { type: Number, default: 467249312864 },

    balance: { type: Number, default: null },

    openningDate: { type: Date, default: Date.now() },

    closingDate: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model("hdfcBranch", hdfcBranchSchema);
