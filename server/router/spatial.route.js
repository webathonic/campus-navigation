const express = require("express");
const router = express.Router();

const { getPlotsData } = require("../controller/spatial.controller");

router.get("/plots", getPlotsData);

module.exports = router;
