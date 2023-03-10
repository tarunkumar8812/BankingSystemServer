const transactionModel = require('../models/transactionModel')
const userModel = require('../models/userModel')
// const redis = require("redis");
// const { promisify } = require("util");

// //Connect to redis
// const redisClient = redis.createClient(
//     11480,
//     "redis-11480.c212.ap-south-1-1.ec2.cloud.redislabs.com",
//     { no_ready_check: true }
// );
// redisClient.auth("PhvvwtqDaSlZK3eKsULRNFnQoX59yV7V", function (err) {
//     if (err) throw err;
// });

// redisClient.on("connect", async function () {
//     console.log("Connected to Redis..");
// });

// //Connection setup for redis

// const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
// const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
// const EXP_ASYNC = promisify(redisClient.EXPIRE).bind(redisClient);

// await GET_ASYNC(`${longUrl}`)
// await SET_ASYNC(`${longUrl}`, JSON.stringify(url_in_DB))
// await EXP_ASYNC(`${req.params.urlCode}`, 20)

async function makePayment(req, res) {
    try {
        let data = req.body

        let { beneficiaryName, beneficiaryIFSC, beneficiaryBranch, beneficiaryAccountNo, amount, OTP } = data
        let amt = +amount

        if (!OTP) { return res.status(200).send({ status: true, OTP: "456215" }) }


        if (OTP != "456215") { return res.status(200).send({ status: true, message: "wrong OTP" }) }


        let beneficiary = await userModel.findOne({ beneficiaryAccountNo, isDeleted: false })

        if (!beneficiary) { return res.status(404).send({ status: false, message: "beneficiary not found" }) }

        let sender = await userModel.findOne({ email: "tarun@gmail.com" },)
        if (sender.balance < amt) { return res.status(404).send({ status: false, message: "low balance" }) }


        await userModel.findOneAndUpdate({ email: "tarun@gmail.com" }, { $inc: { balance: -amt } }, { new: true })


        await userModel.findOneAndUpdate({ beneficiaryAccountNo, isDeleted: false }, { $inc: { balance: amt } }, { new: true })


        let createdData = await transactionModel.create(data)

        let response = {}

        response["amount"] = amt,
            response["beneficiaryName"] = beneficiaryName,
            response["beneficiaryAccountNo"] = beneficiaryAccountNo,
            response["beneficiaryIFSC"] = beneficiaryIFSC,
            response["beneficiaryBranch"] = beneficiaryBranch



        return res.status(201).send({ status: true, message: "Success", data: response })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }


}
module.exports = { makePayment }