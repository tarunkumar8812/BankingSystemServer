const mongoose = require('mongoose')
// list of accounts in branch
const saketAccountSchema = new mongoose.Schema({

    fullName: { type: String, required: true, unique: true, uppercase: true, trim: true },

    DoB: { type: String, required: true, trim: true },

    gender: { type: String, required: true, enum: ["MALE", "FEMALE", "Others"], trim: true },

    address: { type: String, required: true, uppercase: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    phone: { type: String, required: true, unique: true, trim: true },

    currentBalance: { type: Number, min: 10000 },

    loginId: { type: String, required: true },

    password: { type: String, required: true },

    OTP: { type: String, trim: true, default: null },

    countOTP: { type: Number, default: 0 },

    profileImage: { type: String, required: true, trim: true },
    isBlock: { type: Date, default: null },


    aadharNumber: { type: String, required: true, trim: true },

    panCardNumber: { type: String, required: true, trim: true },

    branchName: { type: String, required: true, uppercase: true, trim: true },

    IFSC: { type: String, default: "HDFC0004248" },

    accountType: { type: String, required: true, enum: ["SAVING", "CURRENT"], trim: true },

    accountNumber: { type: Number },

    accountStatus: { type: String, enum: ["ACTIVATED", "DEACTIVATED", "SUSPENDED"], default: 'DEACTIVATED', trim: true },


    //---------------- card details -----------------

    debitCardStatus: { type: String, enum: ["ACTIVATED", "DEACTIVATED", "SUSPENDED"], default: 'DEACTIVATED', trim: true },

    cardNumber: { type: Number },

    cvvNumber: { type: String, required: true },

    pinNumber: { type: Number, default: null },

    expiryDate: { type: String, required: true },

    openingDate: { type: Date, default: Date.now() },

    closingDate: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })


module.exports = mongoose.model("hdfcaccount", saketAccountSchema);



//=======================================================
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