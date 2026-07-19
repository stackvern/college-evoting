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
        "SELECT election_status FROM settings LIMIT 1",
        (err, settingResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (settingResult[0].election_status !== "OPEN") {

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

                    if (studentResult[0].has_voted) {

                        return res.status(403).json({
                            success: false,
                            message: "You have already voted."
                        });

                    }

                    // -------------------------------
                    // Validate Candidate Positions
                    // -------------------------------

                    const sql = `
                    SELECT id,position
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

                            let presidentOK = false;
                            let secretaryOK = false;
                            let treasurerOK = false;

                            candidates.forEach(candidate => {

                                if (
                                    candidate.id == presidentId &&
                                    candidate.position == "President"
                                ) {
                                    presidentOK = true;
                                }

                                if (
                                    candidate.id == secretaryId &&
                                    candidate.position == "Secretary"
                                ) {
                                    secretaryOK = true;
                                }

                                if (
                                    candidate.id == treasurerId &&
                                    candidate.position == "Treasurer"
                                ) {
                                    treasurerOK = true;
                                }

                            });

                            if (
                                !presidentOK ||
                                !secretaryOK ||
                                !treasurerOK
                            ) {

                                return res.status(400).json({
                                    success: false,
                                    message: "Candidate Position Mismatch"
                                });

                            }

                            // ======================================
                            // TRANSACTION START
                            // ======================================

                            db.beginTransaction((err) => {

                                if (err) {

                                    return res.status(500).json({
                                        success: false,
                                        message: "Transaction Error"
                                    });

                                }

                                const voteSQL = `
                                INSERT INTO votes
                                (student_id,candidate_id,position_id)
                                VALUES (?,?,?)
                                `;

                                const positionIds = {
                                    President: 1,
                                    Secretary: 2,
                                    Treasurer: 3
                                };

                                // President

                                db.query(
                                    voteSQL,
                                    [
                                        studentId,
                                        presidentId,
                                        positionIds.President
                                    ],
                                    (err) => {

                                        if (err) {

                                            return db.rollback(() => {

                                                res.status(500).json({
                                                    success: false,
                                                    message: "President Vote Failed"
                                                });

                                            });

                                        }

                                        // Secretary

                                        db.query(
                                            voteSQL,
                                            [
                                                studentId,
                                                secretaryId,
                                                positionIds.Secretary
                                            ],
                                            (err) => {

                                                if (err) {

                                                    return db.rollback(() => {

                                                        res.status(500).json({
                                                            success: false,
                                                            message: "Secretary Vote Failed"
                                                        });

                                                    });

                                                }

                                                // Treasurer

                                                db.query(
                                                    voteSQL,
                                                    [
                                                        studentId,
                                                        treasurerId,
                                                        positionIds.Treasurer
                                                    ],
                                                    (err) => {

                                                        if (err) {

                                                            return db.rollback(() => {

                                                                res.status(500).json({
                                                                    success: false,
                                                                    message: "Treasurer Vote Failed"
                                                                });

                                                            });

                                                        }

                                                        // Update Student

                                                        db.query(
                                                            "UPDATE students SET has_voted=TRUE WHERE id=?",
                                                            [studentId],
                                                            (err) => {

                                                                if (err) {

                                                                    return db.rollback(() => {

                                                                        res.status(500).json({
                                                                            success: false,
                                                                            message: "Vote Update Failed"
                                                                        });

                                                                    });

                                                                }

                                                                db.commit((err) => {

                                                                    if (err) {

                                                                        return db.rollback(() => {

                                                                            res.status(500).json({
                                                                                success: false,
                                                                                message: "Commit Failed"
                                                                            });

                                                                        });

                                                                    }

                                                                    res.status(200).json({

                                                                        success: true,
                                                                        message: "Vote Submitted Successfully"

                                                                    });

                                                                });

                                                            });

                                                    });

                                            });

                                    });

                            });

                        });

                });

        });

};

module.exports = {
    submitVote
};