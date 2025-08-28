const express = require("express");
const router = express.Router();

const {
  getPlotsData,
  getBuildingsData,
  getRoadsData,
  searchBuildingsData,
} = require("../controller/spatial.controller");

router.get("/plots", getPlotsData);
router.get("/buildings", getBuildingsData);
router.get("/roads", getRoadsData);
router.get("/search/:searchTerm", searchBuildingsData);

module.exports = router;
