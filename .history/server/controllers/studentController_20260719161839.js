const db = require("../config/db");
const generateToken = require("../utils/jwt");
const { isVoted } = require("../utils/voteStatus");

const loginStudent = (req, res) => {
    const { register_number, email } = req.body;

    // Validate input
    if (!register_number || !email) {
        return res.status(400).json({
            success: false,
            message: "Register Number and Email are required"
        });
    }

    // Check student
    const sql = `
        SELECT * FROM students
        WHERE register_number = ? AND email = ?
    `;

    db.query(sql, [register_number, email], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        // Student not found
        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Register Number or Email"
            });
        }

        const student = result[0];
        const hasVoted = isVoted(student.has_voted);

        // Already voted
        if (hasVoted) {
            return res.status(403).json({
                success: false,
                message: "You have already voted."
            });
        }

        // Generate JWT
        const token = generateToken(student);

        // Success
        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token,
            student: {
                id: student.id,
                name: student.name,
                register_number: student.register_number,
                email: student.email,
                department: student.department,
                year: student.year
            }
        });

    });
};

module.exports = {
    loginStudent
};