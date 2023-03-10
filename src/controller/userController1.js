const userModel = require('../models/userModel')
let BranchModel = require(`../models/hdfcBranchModel`)

// --------------- for making dynamic --------------------
async function createUser(req, res) {
    try {
        let bank = req.params.bank
        let branch = req.params.branch
        let data = req.body
        console.log(data);

        BranchModel = require(`../models/${bank}${branch}BankModel`)

        let createdData = await BranchModel.create(data)

        return res.status(201).send({ status: true, message: "Success", data: createdData })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}
module.exports = { createUser }