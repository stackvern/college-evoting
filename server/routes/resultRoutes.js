const express = require("express");
const router = express.Router();

const {
    getDashboardResults
} = require("../controllers/resultController");

// Live Result Dashboard
router.get("/dashboard", getDashboardResults);

module.exports = router;