const express = require('express')
const mongoose = require('mongoose')
const multer = require("multer")
const cors = require('cors')
const moment = require("moment")
const cookieParser = require('cookie-parser')
const router = require("./routes/route");
const app = express()

// global middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())
app.use(multer().any())


const PORT = 5000
const MONGO_URL = "mongodb+srv://TarunKumar123:xLcX9W1SI9646ftM@cluster1.tpwtwiv.mongodb.net/Project_6"


mongoose
    .connect(MONGO_URL, { useNewUrlParser: true }, mongoose.set('strictQuery', true))
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err.message));


app.use(
    function (req, res, next) {
        let time = moment().format("DD/MM/YYYY hh:mm:ss a")
        console.log(`time : ${time} , url : ${req.url} `);
        next();
    }
);

app.use('/', router)

app.use("/*", (req, res) => res.status(404).send({ status: false, message: "invalid Path url" }));


app.listen(PORT || 5000, (err) => {
    if (err) { throw err.message }
    else { console.log(`espress app running on ${PORT || 5000}`); }
})
