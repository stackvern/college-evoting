const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadStudents } = require("../controllers/excelController");

router.post(
    "/upload-students",
    upload.single("file"),
    uploadStudents
);

module.exports = router;