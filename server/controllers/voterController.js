const db = require("../config/db");

const submitVote = (req, res) => {
    const studentId = req.student.id;
    const { presidentId, secretaryId, treasurerId } = req.body;

    if (!presidentId || !secretaryId || !treasurerId) {
        return res.status(400).json({
            success: false,
            message: "Select all three candidates."
        });
    }

    const validateElectionStatus = () => {
        db.query(
            "SELECT election_status FROM settings ORDER BY id DESC LIMIT 1",
            (err, settingResult) => {
                if (err) {
                    console.error("Election status query error:", err);
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

                validateStudentVotingState();
            }
        );
    };

    const validateStudentVotingState = () => {
        db.query(
            "SELECT has_voted FROM students WHERE id = ?",
            [studentId],
            (err, studentResult) => {
                if (err) {
                    console.error("Student lookup error:", err);
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

                const studentRecord = studentResult[0];
                const flagHasVoted = Number(studentRecord.has_voted) === 1 || studentRecord.has_voted === true || studentRecord.has_voted === "1";

                db.query(
                    "SELECT COUNT(*) AS voteCount FROM votes WHERE student_id = ?",
                    [studentId],
                    (voteErr, voteResult) => {
                        if (voteErr) {
                            console.error("Vote count query error:", voteErr);
                            return res.status(500).json({
                                success: false,
                                message: "Database Error"
                            });
                        }

                        const voteCount = Number(voteResult?.[0]?.voteCount || 0);
                        if (flagHasVoted || voteCount > 0) {
                            return res.status(403).json({
                                success: false,
                                message: "You have already voted."
                            });
                        }

                        validateCandidateSelection();
                    }
                );
            }
        );
    };

    const validateCandidateSelection = () => {
        if (new Set([presidentId, secretaryId, treasurerId]).size !== 3) {
            return res.status(400).json({
                success: false,
                message: "Each position must have a different candidate."
            });
        }

        const candidateSql = `
            SELECT id, position, position_id
            FROM candidates
            WHERE id IN (?,?,?)
            AND is_active = TRUE
        `;

        db.query(candidateSql, [presidentId, secretaryId, treasurerId], (err, candidates) => {
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

            candidates.forEach((candidate) => {
                if (candidate.id == presidentId && candidate.position === "President") {
                    presidentPositionId = candidate.position_id;
                }
                if (candidate.id == secretaryId && candidate.position === "Secretary") {
                    secretaryPositionId = candidate.position_id;
                }
                if (candidate.id == treasurerId && candidate.position === "Treasurer") {
                    treasurerPositionId = candidate.position_id;
                }
            });

            if (presidentPositionId === null || secretaryPositionId === null || treasurerPositionId === null) {
                return res.status(400).json({
                    success: false,
                    message: "Candidate Position Mismatch"
                });
            }

            submitVotes(presidentPositionId, secretaryPositionId, treasurerPositionId);
        });
    };

    const submitVotes = (presidentPositionId, secretaryPositionId, treasurerPositionId) => {

    db.getConnection((err, connection) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Database Connection Error"
            });
        }

        connection.beginTransaction((err) => {

            if (err) {
                connection.release();
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Transaction Error"
                });
            }

            const voteSQL = `
                INSERT INTO votes
                (student_id, candidate_id, position_id)
                VALUES
                (?,?,?),
                (?,?,?),
                (?,?,?)
            `;

            connection.query(
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

                        console.error(err);

                        return connection.rollback(() => {
                            connection.release();

                            return res.status(500).json({
                                success: false,
                                message: "Vote submission failed."
                            });
                        });
                    }

                    connection.query(
                        "UPDATE students SET has_voted = TRUE WHERE id = ?",
                        [studentId],
                        (err) => {

                            if (err) {

                                console.error(err);

                                return connection.rollback(() => {

                                    connection.release();

                                    return res.status(500).json({
                                        success: false,
                                        message: "Vote Update Failed"
                                    });

                                });

                            }

                            connection.commit((err) => {

                                if (err) {

                                    console.error(err);

                                    return connection.rollback(() => {

                                        connection.release();

                                        return res.status(500).json({
                                            success: false,
                                            message: "Commit Failed"
                                        });

                                    });

                                }

                                connection.release();

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

    });

};

    validateElectionStatus();
};

module.exports = {
    submitVote
};