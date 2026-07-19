require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const excelRoutes = require("./routes/excelRoutes");
const voteRoutes = require("./routes/voteRoutes");
const resultRoutes = require("./routes/resultRoutes");


const app = express();

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5175",
    "https://college-evoting.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("College Voting API Running 🚀");
});

// Student Routes
app.use("/api/student", studentRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/candidates", candidateRoutes);
app.use("/api/admin", excelRoutes);
app.use("/api/student", voteRoutes);
app.use("/api/results", resultRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


app.get("/test", (req, res) => {
    res.json({ message: "Test Working" });
});


