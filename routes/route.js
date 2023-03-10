const express = require("express");
const router = express.Router();

router.get("/user", (req, res) => {

    res.json({ status: true, message: "this is from router successful" })
});

module.exports = router;