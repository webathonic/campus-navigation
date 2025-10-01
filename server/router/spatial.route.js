const express = require("express");
const router = express.Router();

const {
  getPlotsData,
  getBuildingsData,
  getRoadsData,
  searchBuildingsData,
  getBuildingData,
  getShortestRoute,
} = require("../controller/spatial.controller");

router.get("/plots", getPlotsData);
router.get("/buildings", getBuildingsData);
router.get("/roads", getRoadsData);
router.get("/get-building-route", getShortestRoute);
router.get("/search/:searchTerm", searchBuildingsData);
router.get("/get-building/:id", getBuildingData);

module.exports = router;
