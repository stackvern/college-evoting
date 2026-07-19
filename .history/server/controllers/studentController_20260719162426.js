const db = require("../config/db");
const generateToken = require("../utils/jwt");

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

        db.query(
            "SELECT COUNT(*) AS voteCount FROM votes WHERE student_id = ?",
            [student.id],
            (voteErr, voteResult) => {
                if (voteErr) {
                    console.error(voteErr);
                    return res.status(500).json({
                        success: false,
                        message: "Database Error"
                    });
                }

                const voteCount = Number(voteResult?.[0]?.voteCount || 0);
                const flagHasVoted = Number(student.has_voted) === 1 || student.has_voted === true || student.has_voted === "1";

                if (voteCount > 0) {
                    if (!flagHasVoted) {
                        db.query(
                            "UPDATE students SET has_voted = 1 WHERE id = ?",
                            [student.id],
                            () => {}
                        );
                    }

                    return res.status(403).json({
                        success: false,
                        message: "You have already voted."
                    });
                }

                if (flagHasVoted && voteCount === 0) {
                    db.query(
                        "UPDATE students SET has_voted = 0 WHERE id = ?",
                        [student.id],
                        () => {}
                    );
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
                        register_number: student.register_number,
                        email: student.email
                    }
                });
            }
        );

    });
};

module.exports = {
    loginStudent
};