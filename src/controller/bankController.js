let bankModel = require(`../models/hdfcBranchModel`)
let accountModel = require(`../models/hdfcAccountModel`)
let transactionModel = require(`../models/transactionModel`)

async function createBranch(req, res) {
    try {
        let data = req.body

        let createdBranch = await bankModel.create(data)

        return res.status(201).send({ status: true, message: "Success", data: createdBranch })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// to activate and deactivate user's account
async function accountControl(req, res) {
    try {
        let data = req.body

        let createdBranch = await bankModel.create(data)

        return res.status(201).send({ status: true, message: "Success", data: createdBranch })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// ------------------------------- Get Profile -------------------------------
async function getProfileForBankUse(req, res) {
    try {
        let data = req.body
        // let { loginId, password } = data
        // let bankPurpose = await accountModel.findOne({ loginId: loginId, password: password, isDeleted: false }).select({
        //     _id: 0, OTP: 0, countOTP: 0, isBlock: 0, cvvNumber: 0, pinNumber: 0, expiryDate: 0, openingDate: 0, closingDate: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0
        // })
        let bankPurpose = await transactionModel.aggregate([
            {
                $match: { bankName: "HDFC" }
            },
            // {
            //     $group: {
            //         _id: "$beneficiaryName",
            //         transactionType: { $first: "$transactionType" },
            //         amount: { $first: "$amount" }
            //     }
            // },
            {
                $sort: { transactionType: 1, accountNumber: -1 }
            }, {
                $limit:{}
            }
        ])//, { $count: "Total student in sec:B" }])

        if (!bankPurpose) {
            return res.status(404).send({ status: false, message: "data not found" })
        }

        console.log(bankPurpose);


        return res.status(200).send({ status: true, message: "Success", data: bankPurpose })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createBranch, accountControl, getProfileForBankUse }



