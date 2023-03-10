const express = require("express");
const router = express.Router()
// const { createBranch, getProfileForBankUse } = require("../controller/bankController");
// const { createAccount, login, getProfile, updatePassword, forgotPassword, sendMoney, accountBalance, accountStatement, otpGenerate, deleteTransaction, paymentThroughDebitCard } = require("../controller/userController");


// router.post("/createBranch/hdfc/:branch", createBranch);
// router.get("/bank/getProfileForBankUse", getProfileForBankUse);

// -------------- user APIs -----------

router.get("/", (req, res) => {
    res.json({ status: true, message: "just for check" })
});

router.post("/register", (req, res) => {
    res.json({ status: true, message: "createAccount" })
});
router.post("/login",  (req, res) => {
    res.json({ status: true, message: "login" })
});
router.get("/profile", (req, res) => {
    res.json({ status: true, message: "getProfile" })
});
// router.put("/updatePassword", updatePassword);

// router.put("/forgotPassword", forgotPassword);
// router.post("/sendMoney", sendMoney);
// router.get("/accountBalance", accountBalance);
// router.get("/accountStatement", accountStatement);

// router.put("/otpGenerate", otpGenerate);
// router.delete("/deleteTransaction", deleteTransaction);
// router.post("/payment", paymentThroughDebitCard);
// router.post("/payment", makePayment);

module.exports = router



// Api's which we have to create
//  #    user register
//  #    user login
//  #    get profile
//  #    create first time password
//  #    update profile - password,address
//  #    apply for new debit card
//  #    generate debit card pin
//  #    add money
//  #    send money
//  #    account statement



