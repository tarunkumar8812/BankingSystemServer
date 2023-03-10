const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const router = require("./routes/route");
const PORT = 5000
const MONGO_URL = "mongodb+srv://TarunKumar123:xLcX9W1SI9646ftM@cluster1.tpwtwiv.mongodb.net/BankingSystem"

const app = express()
// is global middleware
app.use(cors())
// app.use(cookieParser())
app.use(express.json())

app.use("/", (req, res) => {

    res.json({ status: true, message: "banking system server created successfully" })
})

mongoose
    .connect(MONGO_URL, { useNewUrlParser: true }, mongoose.set('strictQuery', true))
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err.message));



app.listen(PORT || 5000, (err) => {
    if (err) { throw err.message }
    else { console.log(`espress app running on ${PORT || 5000}`); }
})
