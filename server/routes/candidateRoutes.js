const express = require("express");
const router = express.Router();

const candidateController = require("../controllers/candidateController");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Candidate Route Working"
    });
});

router.post("/", candidateController.addCandidate);
router.get("/", candidateController.getCandidates);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;