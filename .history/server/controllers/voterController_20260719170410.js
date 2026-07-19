const db = require("../config/db");

const submitVote = (req, res) => {

    const studentId = req.student.id;

    const {
        presidentId,
        secretaryId,
        treasurerId
    } = req.body;

    // -------------------------------
    // Validation
    // -------------------------------

    if (!presidentId || !secretaryId || !treasurerId) {
        return res.status(400).json({
            success: false,
            message: "Select all three candidates."
        });
    }

    // -------------------------------
    // Election Status Check
    // -------------------------------

    db.query(
        "SELECT election_status FROM settings ORDER BY id DESC LIMIT 1",
        (err, settingResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            const electionStatus = settingResult?.[0]?.election_status?.toUpperCase() || "OPEN";

            if (electionStatus !== "OPEN") {

                return res.status(403).json({
                    success: false,
                    message: "Election is Closed."
                });

            }

            // -------------------------------
            // Already Voted Check
            // -------------------------------

            db.query(
                "SELECT has_voted FROM students WHERE id=?",
                [studentId],
                (err, studentResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database Error"
                        });
                    }

                    if (studentResult.length === 0) {

                        return res.status(404).json({
                            success: false,
                            message: "Student Not Found"
                        });

                    }

                    const studentRecord = studentResult?.[0];
                    const flagHasVoted = Number(studentRecord?.has_voted) === 1 || studentRecord?.has_voted === true || studentRecord?.has_voted === "1";

                    db.query(
                        "SELECT COUNT(*) AS voteCount FROM votes WHERE student_id = ?",
                        [studentId],
                        (voteErr, voteResult) => {
                            if (voteErr) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Database Error"
                                });
                            }

                            const voteCount = Number(voteResult?.[0]?.voteCount || 0);
                            const hasVoted = flagHasVoted || voteCount > 0;

                            if (hasVoted) {
                                return res.status(403).json({
                                    success: false,
                                    message: "You have already voted."
                                });
                            }

                            const sql = `
                            SELECT id, position, position_id
                            FROM candidates
                            WHERE id IN (?,?,?)
                            AND is_active=TRUE
                            `;

                            db.query(
                                sql,
                                [
                                    presidentId,
                                    secretaryId,
                                    treasurerId
                                ],
                                (err, candidates) => {
                                    if (err) {
                                        console.error("Candidate query error:", err);
                                        return res.status(500).json({
                                            success: false,
                                            message: "Database Error"
                                        });
                                    }

                                    if (candidates.length !== 3) {
                                        return res.status(400).json({
                                            success: false,
                                            message: "Invalid Candidate Selection"
                                        });
                                    }

                                    let presidentPositionId = null;
                                    let secretaryPositionId = null;
                                    let treasurerPositionId = null;

                                    candidates.forEach(candidate => {
                                        if (
                                            candidate.id == presidentId &&
                                            candidate.position == "President"
                                        ) {
                                            presidentPositionId = candidate.position_id;
                                        }

                                        if (
                                            candidate.id == secretaryId &&
                                            candidate.position == "Secretary"
                                        ) {
                                            secretaryPositionId = candidate.position_id;
                                        }

                                        if (
                                            candidate.id == treasurerId &&
                                            candidate.position == "Treasurer"
                                        ) {
                                            treasurerPositionId = candidate.position_id;
                                        }
                                    });

                                    if (
                                        presidentPositionId === null ||
                                        secretaryPositionId === null ||
                                        treasurerPositionId === null
                                    ) {
                                        return res.status(400).json({
                                            success: false,
                                            message: "Candidate Position Mismatch"
                                        });
                                    }

                                    db.beginTransaction((err) => {
                                        if (err) {
                                            console.error("Transaction begin error:", err);
                                            return res.status(500).json({
                                                success: false,
                                                message: "Transaction Error"
                                            });
                                        }

                                        const voteSQL = `
                                        INSERT INTO votes
                                        (student_id,candidate_id,position_id)
                                        VALUES (?,?,?),(?,?,?),(?,?,?)
                                        `;

                                        db.query(
                                            voteSQL,
                                            [
                                                studentId,
                                                presidentId,
                                                presidentPositionId,
                                                studentId,
                                                secretaryId,
                                                secretaryPositionId,
                                                studentId,
                                                treasurerId,
                                                treasurerPositionId
                                            ],
                                            (err) => {
                                                if (err) {
                                                    console.error("Vote insert error:", err);
                                                    return db.rollback(() => {
                                                        return res.status(500).json({
                                                            success: false,
                                                            message: "Vote submission failed."
                                                        });
                                                    });
                                                }

                                                db.query(
                                                    "UPDATE students SET has_voted=TRUE WHERE id=?",
                                                    [studentId],
                                                    (err) => {
                                                        if (err) {
                                                            console.error("Student update error:", err);
                                                            return db.rollback(() => {
                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message: "Vote Update Failed"
                                                                });
                                                            });
                                                        }

                                                        db.commit((err) => {
                                                            if (err) {
                                                                console.error("Commit error:", err);
                                                                return db.rollback(() => {
                                                                    return res.status(500).json({
                                                                        success: false,
                                                                        message: "Commit Failed"
                                                                    });
                                                                });
                                                            }

                                                            return res.status(200).json({
                                                                success: true,
                                                                message: "Vote Submitted Successfully"
                                                            });
                                                        });
                                                    }
                                                );
                                            }
                                        );
                                    });
                                }
                            );
                        }
                    );

};

module.exports = {
    submitVote
};