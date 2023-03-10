// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({

//     fullName: { type: String, required: true, unique: true, uppercase: true, trim: true },

//     DoB: { type: String, required: true, trim: true },

//     gender: { type: String, required: true, enum: ["MALE", "FEMALE", "Others"], trim: true },

//     address: { type: String, required: true, uppercase: true, trim: true },

//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },

//     phone: { type: String, required: true, unique: true, trim: true },

//     aadharNumber: { type: String, required: true, trim: true },

//     panCardNumber: { type: String, required: true, trim: true },

//     branchName: { type: String, required: true, trim: true },

//     accountType: { type: String, required: true, enum: ["SAVING", "CURRENT"], trim: true },

//     openingAmount: { type: String, trim: true, default: 10000 },

//     openingDate: { type: Date, default: Date.now() },

//     closingDate: { type: Date, default: null },

//     isDeleted: { type: Boolean, default: false }

// }, { timestamps: true })


// module.exports = mongoose.model("User", userSchema);