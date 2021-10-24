// import express router
const express = require("express");
const router = express.Router();

// import controller
const { RecommendController } = require("../controller/index");

/* ================================== RECOMEND ROUTES ================================== */
router.get("/recommend", RecommendController.getItems);

module.exports = router;
