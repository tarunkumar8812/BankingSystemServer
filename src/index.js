const express = require('express')
const mongoose = require('mongoose')
const multer = require("multer")
const cors = require('cors')
const moment = require("moment")
const cookieParser = require('cookie-parser')
const router = require("./routes/route");
const app = express()
// is global middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(multer().any())
app.use(express.urlencoded({ extended: true }));


const PORT = 5000
const MONGO_URL = "mongodb+srv://TarunKumar123:xLcX9W1SI9646ftM@cluster1.tpwtwiv.mongodb.net/Project_6"


mongoose
    .connect(MONGO_URL, { useNewUrlParser: true }, mongoose.set('strictQuery', true))
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err.message));


app.use('/user', router)
app.use('/admin', router)


app.use("/*", (req, res) => res.status(404).send({ status: false, message: "invalid Path url" }));


app.listen(PORT || 5000, (err) => {
    if (err) { throw err.message }
    else { console.log(`espress app running on ${PORT || 5000}`); }
})
