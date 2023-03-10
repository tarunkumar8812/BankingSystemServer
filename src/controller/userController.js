let accountModel = require(`../models/hdfcAccountModel`)
let branchModel = require(`../models/hdfcBranchModel`)
let transactionModel = require(`../models/transactionModel`)
let nodemailer = require(`nodemailer`)

const sid = "AC6106de8ba683d4ac58ec094dd67f8198"
const auth_token = "a80f71e3e98248259297e0a9dbddeae9"
const twilioSend = require("twilio")(sid, auth_token)
const otpGen = require("otp-generator")



// ------------------------------ Create Account -----------------------------
async function createAccount(req, res) {
    try {
        let data = req.body
        // ---------------validation part----------------
        let { fullName, DoB, gender, address, email, phone, aadharNumber, currentBalance, panCardNumber, branchName, accountType, profileImage, ...rest } = req.body
        // all input from user must be verified

        // --------------- validation part ----------------

        let temp = await branchModel.findOneAndUpdate({ branchName }, { $inc: { "accountNumbers": +1, "cardNumbers": +1 } }, { new: true })
        // console.log(temp)

        let cvvTemp = Math.random().toString()
        let cvv = cvvTemp.slice(cvvTemp.length - 3)
        data['accountNumber'] = temp.accountNumbers
        data['cardNumber'] = temp.cardNumbers
        data['cvvNumber'] = cvv + ''
        let loginIdTemp = Math.random().toString()
        let loginIdAndPassword = loginIdTemp.slice(loginIdTemp.length - 9)
        // console.log(loginIdAndPassword)

        data['loginId'] = loginIdAndPassword
        data['password'] = loginIdAndPassword

        let cur = new Date()
        cur.setDate(cur.getDate() + 1000)
        // let fin = `${cur.getDate()}/${cur.getMonth().toString()}/${cur.getFullYear()}`
        data['expiryDate'] = `${cur.getDate()}/${cur.getMonth().toString()}/${cur.getFullYear()}`
        // data['IFSC'] = takin value from bankmodel

        let createdUserAccount = await accountModel.create(data)

        return res.status(201).send({ status: true, message: "login Successfull", data: createdUserAccount })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// -------------------------------- User Login -------------------------------
async function login(req, res) {
    try {
        let data = req.body
        let { loginId, password, otp } = data

        let block = await accountModel.findOne({ loginId: loginId, password: password, isDeleted: false, accountStatus: "DEACTIVATED" })

        //-----------------------------------
        let check = new Date()
        console.log(check)
        let diff = Math.floor((block.isBlock - check) / 1000 / 60 / 60)
        console.log(diff)
        //-----------------------------------


        let cur = new Date()


        if (block.isBlock >= cur) {
            return res.status(200).send({ status: false, message: `YOU ARE STILL BLOCKED for ${diff} hours` })
        }


        // ---------------to send OTP-----------------
        if (!otp) {
            let temp = Math.random().toString()
            let OTP = temp.slice(temp.length - 6)


            let genereateOTP = await accountModel.findOneAndUpdate(
                { loginId: loginId, password: password, isDeleted: false },
                { OTP },
                { new: true })

            if (!genereateOTP) { return res.status(403).send({ status: false, message: "wrong loginId, password" }) }

            //sending OTP to user
            return res.status(200).send({ status: true, message: OTP })

        }

        // --------------user has OTP---------------
        // let userProfile = await accountModel.findOne({ loginId: loginId, password: password, OTP: otp, isDeleted: false ,accountStatus:"DEACTIVATED"})
        let userProfile = await accountModel.findOneAndUpdate({ loginId: loginId, password: password, OTP: otp, isDeleted: false, accountStatus: "DEACTIVATED" }, { OTP: null }, { new: true })
        // ----------if otp does not match----------
        if (!userProfile) {
            let OTPattempt = await accountModel.findOneAndUpdate(
                { loginId: loginId, password: password, isDeleted: false },
                { $inc: { "countOTP": 1 } },
                { new: true })

            console.log(OTPattempt.OTP);
            console.log(OTPattempt.countOTP);

            if (OTPattempt.countOTP < 5) {
                return res.status(200).send({ status: false, message: `worng OTP, ${5 - OTPattempt.countOTP} ATTEMPT LEFT` })
            }

            console.log(cur)
            console.log(cur.setDate(cur.getDate() + 1))

            await accountModel.findOneAndUpdate(
                { loginId: loginId, password: password, isDeleted: false },
                { countOTP: 0, OTP: null, isBlock: cur.setDate(cur.getDate() + 1) },
                { new: true })

            return res.status(200).send({ status: false, message: "YOU ARE BLOCKED FOR 24 HOURS" })

        }
        // ----------OTP matched---------
        return res.status(200).send({ status: true, message: "Login successfull" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// ------------------------------- Get Profile -------------------------------
async function getProfile(req, res) {
    try {
        let data = req.body
        let { loginId, password } = data
        let userProfile = await accountModel.findOne(
            {
                // loginId: loginId, password: password, isDeleted: false
            })//.select({_id: 0, OTP: 0, countOTP: 0, isBlock: 0, cvvNumber: 0, pinNumber: 0, expiryDate: 0, openingDate: 0, closingDate: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0})

        if (!userProfile) {
            return res.status(404).send({ status: false, message: "data not found" })
        }

        return res.status(200).send({ status: true, message: "Success", data: userProfile })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ------------------------------ update Password -----------------------------
async function updatePassword(req, res) {
    try {
        let data = req.body
        let { loginId, oldPassword, newPassword, confirmPassword, otp } = data

        if (oldPassword == newPassword) {
            return res.status(404).send({ status: false, message: "oldPassword and newPassword can not be same use a diffirent password" })
        }
        if (newPassword != confirmPassword) {
            return res.status(404).send({ status: false, message: "newPassword is not equle to confirmPassword" })
        }

        //--------- otp wala system banana hai jaise login me kiya hai---------

        let block = await accountModel.findOne({ loginId: loginId, password: oldPassword, isDeleted: false, accountStatus: "DEACTIVATED" })


        //  //-----------------------------------
        //  let check = new Date()
        //  console.log(check)
        //  let diff = Math.floor((block.isBlock - check) / 1000 / 60 / 60)
        //  console.log(diff)
        //  //-----------------------------------

        let cur = new Date()


        // if (block.isBlock >= cur) {
        //     return res.status(200).send({ status: false, message: `YOU ARE STILL BLOCKED for ${diff} hours` })
        // }


        // ---------------to send OTP------- when user click on get OPT ----------
        if (!otp) return res.status(400).send({ status: true, message: "OTP is required" })


        // --------------user has OTP---------------
        // let userProfile = await accountModel.findOne({ loginId: loginId, password: password, OTP: otp, isDeleted: false ,accountStatus:"DEACTIVATED"})
        let userProfile = await accountModel.findOneAndUpdate({ loginId: loginId, password: oldPassword, OTP: otp, isDeleted: false, accountStatus: "DEACTIVATED" }, { OTP: null }, { new: true })
        // ----------if otp does not match----------
        if (!userProfile) {
            let OTPattempt = await accountModel.findOneAndUpdate(
                { loginId: loginId, password: oldPassword, isDeleted: false },
                { $inc: { "countOTP": 1 } },
                { new: true })

            console.log(OTPattempt.OTP);
            console.log(OTPattempt.countOTP);

            if (OTPattempt.countOTP < 5) {
                return res.status(200).send({ status: false, message: `worng OTP, ${5 - OTPattempt.countOTP} ATTEMPT LEFT` })
            }

            console.log(cur)
            console.log(cur.setDate(cur.getDate() + 1))

            await accountModel.findOneAndUpdate(
                { loginId: loginId, password: oldPassword, isDeleted: false },
                { countOTP: 0, OTP: null, isBlock: cur.setDate(cur.getDate() + 1) },
                { new: true })

            return res.status(200).send({ status: false, message: "YOU ARE BLOCKED FOR 24 HOURS" })

        }
        //--------- otp wala system banana hai jaise login me kiya hai---------

        let updatedPassword = await accountModel.findOneAndUpdate({ loginId: loginId, password: oldPassword, isDeleted: false }, { password: newPassword }, { new: true })

        if (!updatedPassword) {
            return res.status(404).send({ status: false, message: "data not found" })
        }

        return res.status(200).send({ status: true, message: "Success", data: updatedPassword })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// ------------------------------ forgot pasword ------------------------------
async function forgotPassword(req, res) {
    try {
        let data = req.body
        let { emailId, newPassword, oldPassword, otp } = data

        //--------- otp wala system banana hai jaise login me kiya hai---------

        let block = await accountModel.findOne({ emailId: emailId, isDeleted: false, accountStatus: "DEACTIVATED" })

        //  //-----------------------------------
        //  let check = new Date()
        //  console.log(check)
        //  let diff = Math.floor((block.isBlock - check) / 1000 / 60 / 60)
        //  console.log(diff)
        //  //-----------------------------------

        let cur = new Date()


        // if (block.isBlock >= cur) {
        //     return res.status(200).send({ status: false, message: `YOU ARE STILL BLOCKED for ${diff} hours` })
        // }


        // ---------------to send OTP------- when user click on get OPT ----------
        if (!otp) {
            // ----- generating OTP ------
            let temp = Math.random().toString()
            let OTP = temp.slice(temp.length - 6)

            // ----- 
            let genereatedOTP = await accountModel.findOneAndUpdate(
                { emailId: emailId, isDeleted: false },
                { OTP },
                { new: true })

            if (!genereatedOTP) { return res.status(404).send({ status: false, message: "data not found" }) }

            //sending OTP to user
            return res.status(200).send({ status: true, message: OTP })

        }

        // --------------user has OTP---------------
        let userProfile = await accountModel.findOneAndUpdate({ emailId: emailId, OTP: otp, isDeleted: false, accountStatus: "DEACTIVATED" }, { OTP: null }, { new: true })

        // ----------if otp does not match----------
        if (!userProfile) {
            let OTPattempt = await accountModel.findOneAndUpdate(
                { emailId: emailId, password: oldPassword, isDeleted: false },
                { $inc: { "countOTP": 1 } },
                { new: true })

            console.log(OTPattempt.OTP);
            console.log(OTPattempt.countOTP);

            if (OTPattempt.countOTP < 5) {
                return res.status(200).send({ status: false, message: `worng OTP, ${5 - OTPattempt.countOTP} ATTEMPT LEFT` })
            }

            console.log(cur)
            console.log(cur.setDate(cur.getDate() + 1))

            await accountModel.findOneAndUpdate(
                { emailId: emailId, isDeleted: false },
                { countOTP: 0, OTP: null, isBlock: cur.setDate(cur.getDate() + 1) },
                { new: true })

            return res.status(200).send({ status: false, message: "YOU ARE BLOCKED FOR 24 HOURS" })

        }
        //--------- otp wala system banana hai jaise login me kiya hai---------

        let updatedPassword = await accountModel.findOneAndUpdate({ emailId: emailId, isDeleted: false }, { password: newPassword }, { new: true })

        if (!updatedPassword) {
            return res.status(404).send({ status: false, message: "failed to update" })
        }

        return res.status(200).send({ status: true, message: "Success", data: updatedPassword })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// -------------------------------- send Money --------------------------------
async function sendMoney(req, res) {
    try {
        let data = req.body
        let { amount, beneficiaryName, beneficiaryAccountNo, beneficiaryIFSC, beneficiaryBranch, loginId, password, otp } = data
        let cash = +amount


        let block = await accountModel.findOne({ loginId: loginId, password: password, isDeleted: false, accountStatus: "DEACTIVATED" })


        let cur = new Date()
        let diff = Math.floor((block.isBlock - cur) / 1000 / 60 / 60)


        // if (block.isBlock >= cur) {
        //     return res.status(200).send({ status: false, message: `YOU ARE STILL BLOCKED for ${diff} hours` })
        // }

        // ---------------to send OTP------- when user click on get OPT ----------
        if (!otp) return res.status(400).send({ status: true, message: "OTP is required" })


        // --------------user has OTP---------------

        // ------- checking OTP ---------------
        let userProfile = await accountModel.findOneAndUpdate({ loginId: loginId, password: password, OTP: otp, isDeleted: false, accountStatus: "DEACTIVATED" }, { OTP: "982205" }, { new: true })


        // ------- checking beneficiary account in database ---------------
        let beneficiary = await accountModel.findOne({ fullName: beneficiaryName, acountNumber: beneficiaryAccountNo, IFSC: beneficiaryIFSC, branchName: beneficiaryBranch, isDeleted: false, accountStatus: "DEACTIVATED" })

        // ------- if beneficiary doesn't exist in database ---------------
        if (!beneficiary) return res.status(200).send({ status: false, message: "beneficiary doesn't exist" })


        // ----------if otp does not match----------
        if (!userProfile) {
            let OTPattempt = await accountModel.findOneAndUpdate(

                { loginId: loginId, password: password, isDeleted: false, accountStatus: "DEACTIVATED" },
                { $inc: { "countOTP": 1 } },
                { new: true })

            if (OTPattempt.countOTP < 5) {
                return res.status(200).send({ status: false, message: `worng OTP, ${5 - OTPattempt.countOTP} ATTEMPT LEFT` })
            }

            await accountModel.findOneAndUpdate(
                { loginId: loginId, password: password, isDeleted: false },
                { countOTP: 0, OTP: "982205", isBlock: cur.setDate(cur.getDate() + 1) },
                { new: true })

            return res.status(200).send({ status: false, message: "YOU ARE BLOCKED FOR 24 HOURS" })

        }

        //--------- otp is matched ---------

        // if account holder doesn't have sufficient balance
        if (userProfile.currentBalance < cash) return res.status(404).send({ status: false, message: "Don't have sufficient balance" })

        // if account holder have sufficient balance 
        // debiting the amount here
        let moneySent = await accountModel.findOneAndUpdate(
            { loginId: loginId, password: password, isDeleted: false, accountStatus: "DEACTIVATED" },
            { $inc: { "currentBalance": -cash }, countOTP: 0, OTP: "982205" },
            { new: true })

        // in any case amount is not debited from account holder 
        if (!moneySent) return res.status(404).send({ status: false, message: "Transaction Failed" })


        // transaction record of amount deduction 
        let amountDebitEntry = await transactionModel.create({
            IFSC: userProfile.IFSC,
            accountNumber: userProfile.accountNumber,
            branchName: userProfile.branchName,
            transactionType: "debit",
            transactionStatus: "completed",// completed , failed , cancelled
            amount: -cash,
            currentBalance: userProfile.currentBalance - cash,
            beneficiaryName: beneficiary.fullName,
            beneficiaryAccountNo: beneficiary.accountNumber,
            beneficiaryIFSC: beneficiaryIFSC,
            beneficiaryBranch: beneficiaryBranch
        })

        // we have to send a text message to account holder that amount is debited
        // res.status(404).send({ status: false, message: ` ${amount} amount debited` })


        // in any case amount is successfully debited from account holder 
        // sending the amount to beneficiary's account
        let moneyRecieved = await accountModel.findOneAndUpdate(
            { fullName: beneficiaryName, acountNumber: beneficiaryAccountNo, IFSC: beneficiaryIFSC, branchName: beneficiaryBranch, isDeleted: false, accountStatus: "DEACTIVATED" },
            { $inc: { "currentBalance": cash } },
            { new: true })


        // in any case amount is not creadited to benefeciary's account 
        if (!moneyRecieved) {

            // if amount is debited from account holder but not sent to beneficiary's account then  amount is returning
            let moneyReturn = await accountModel.findOneAndUpdate(
                { loginId: loginId, password: password, isDeleted: false },
                { $inc: { currentBalance: cash } },
                { new: true })

            // if in any case amount is not return then sending message for 3 days time
            if (!moneyReturn) return res.status(404).send({ status: false, message: `transaction failed ! your amount ₹ ${amount} will be return within 3 working days` })

            // transaction record
            let amountReverseEntry = await transactionModel.create({
                IFSC: userProfile.IFSC,
                accountNumber: userProfile.accountNumber,
                branchName: userProfile.branchName,
                transactionType: "credit",
                transactionStatus: "completed",// completed , failed , cancelled
                amount: cash,
                currentBalance: userProfile.currentBalance,
                amount: cash,
                senderName: "HDFC Bank",
                senderIFSC: userProfile.IFSC,
                senderBranch: userProfile.branchName
            })

            await transactionModel.findOneAndUpdate({ _id: amountDebitEntry._id }, { transactionStatus: "failed" }, { new: true })

            return res.status(404).send({ status: false, message: `your amount ₹ ${amount} creadited back` })

        }
        // if money is successfully sent to beneficiary
        await transactionModel.create({
            IFSC: beneficiary.IFSC,
            accountNumber: beneficiary.accountNumber,
            branchName: beneficiary.branchName,
            transactionType: "credit",
            transactionStatus: "completed",// completed , failed , cancelled
            senderName: userProfile.fullName,
            senderAccountNo: userProfile.accountNumber,
            senderIFSC: userProfile.IFSC,
            senderBranch: userProfile.branchName

        })


        return res.status(200).send({ status: true, message: ` ₹ ${amount} succesfull transfered to ${moneyRecieved.fullName}` })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// ------------------------------ account balance ------------------------------
async function accountBalance(req, res) {
    try {
        let data = req.body
        let { loginId, password } = data
        let userProfile = await accountModel.findOne({ loginId: loginId, password: password, isDeleted: false })

        if (!userProfile) {
            return res.status(404).send({ status: false, message: "data not found" })
        }

        return res.status(200).send({ status: true, message: "Success", balance: `₹ ${userProfile.currentBalance}` })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// ----------------------------- account Statement -----------------------------
async function accountStatement(req, res) {
    try {
        let data = req.body
        let { accountNumber, IFSC } = data


        // ----------------------start of twilio-------------------------

        // this is working fine but only 10 messages are left

        // let otp = otpGen.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        // twilioSend.messages.create({
        //     from: "+17633736885",
        //     to: "+918586893180",
        //     body: `this is testing otp ${otp} do not share it with any one`
        // })
        //     .then(function (res) { console.log("message has sent") })
        //     .catch(function (err) { console.log(err.message) })

        // -----------------------end of twilio--------------------------


        // -------------------------start of nodemailer----------------------------
        // const testAccount = await nodemailer.createTestAccount();
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'stanford.friesen97@ethereal.email',
        //         pass: 'PJRC9DyenpXMFabk5p'
        //     }
        // });

        // let details = {
        //     from: "tarun  <stanford.friesen97@ethereal.email>",
        //     to: "tarunkolidev@gmail.com",
        //     subject: "nodemailer testing",
        //     text: "testing   testing   testing"
        // }

        // transporter.sendMail(details, function (err) {
        //     if (err) {
        //         console.log(err.message)
        //     } else {
        //         console.log("mail has been sent succesfully")
        //     }
        // })
        // ------------------------end of nodemailer -----------------------------




        // .find({ $or: [{ accountNumber: accountNumber }, { IFSC: IFSC }] })


        let accountStatement = await transactionModel
            .find(
                { accountNumber: accountNumber }, { IFSC: IFSC }
            )
            .select(
                {
                    _id: 0, transactionStatus: 1, accountNumber: 1, transactionType: 1, amount: 1, currentBalance: 1, senderName: 1, createdAt: 1, beneficiaryName: 1, beneficiaryAccountNo: 1, beneficiaryIFSC: 1, beneficiaryBranch: 1
                }
            )



        //-------------------------------- this is aggregation pipeline --------------------------------

        // let accountStatement = await transactionModel.aggregate([
        //     { $match: { transactionStatus: "completed" } },
        //     { $group: { _id: "$beneficiaryName", total: { $sum: "$amount" } } },
        //     { $sort: { _id: -1, amount: -1 } },
        //     { $skip: 5 },
        //     { $limit: 5 }
        // ])



        if (!accountStatement) {
            return res.status(404).send({ status: false, message: "data not found" })
        }

        return res.status(200).send({
            status: true, message: "Success", balance: "currentBalance", numberOfTransactions: accountStatement.length, data: accountStatement
        })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


//---------------------------- getOtpForChangePassword -------------------------- 
async function getOtpForChangePassword(req, res) {
    try {
        let data = req.body

        return res.status(200).send({ status: true, message: "Success" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


//---------------------------------- otpGenerate --------------------------------
async function otpGenerate(req, res) {
    try {

        let data = req.body
        let { email, loginId, password } = data

        // let block = await accountModel.findOne({ loginId: loginId, password: password, isDeleted: false, accountStatus: "DEACTIVATED" })

        let temp = Math.random().toString()
        let OTP = temp.slice(temp.length - 6)

        // ----- 
        let genereatedOTP = await accountModel.findOneAndUpdate(
            { loginId: loginId, password: password, isDeleted: false, accountStatus: "DEACTIVATED" },
            { OTP },
            { new: true })

        if (!genereatedOTP) { return res.status(404).send({ status: false, message: "failed to generate OTP" }) }

        //sending OTP to user
        return res.status(200).send({ status: true, otp: OTP })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// --------------------------- delete transactions ------------------------------
async function deleteTransaction(req, res) {
    try {

        let data = req.body
        let { bankName } = data

        let deleteTransaction = await transactionModel.deleteMany(
            { bankName })

        return res.status(200).send({ status: true, otp: "all trasactions have been deleted successfully" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// ------------------------ payment through debit card ---------------------------
async function paymentThroughDebitCard(req, res) {
    try {

        let data = req.body
        let { cardNumber, cvv, pin, expiryDate, otp } = data


        let deleteTransaction = await transactionModel.findOneAndUpdate({ cardNumber, cvvNumber: cvv, pinNumber: pin, expiryDate, debitCardStatus: "ACTIVATED" }, { OPT: otp }, { new: true })

        return res.status(200).send({ status: true, otp: "payment done" })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}




module.exports = { createAccount, login, getProfile, updatePassword, sendMoney, accountBalance, accountStatement, forgotPassword, getOtpForChangePassword, otpGenerate, deleteTransaction, paymentThroughDebitCard }
