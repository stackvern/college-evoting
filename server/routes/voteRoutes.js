const express = require("express");

const router = express.Router();

const verifyStudent = require("../middleware/authMiddleware");

const {
    submitVote
} = require("../controllers/voterController");

router.post(
    "/submit",
    verifyStudent,
    submitVote
);

module.exports = router;