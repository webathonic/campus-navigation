const express = require("express");
const router = express.Router();

const {
  getPlotsData,
  getBuildingsData,
  getRoadsData,
} = require("../controller/spatial.controller");

router.get("/plots", getPlotsData);
router.get("/buildings", getBuildingsData);
router.get("/roads", getRoadsData);

module.exports = router;
