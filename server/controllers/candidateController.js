const db = require("../config/db");

const addCandidate = (req, res) => {

    const { name, position, details, photo } = req.body;

    const sql = `
        INSERT INTO candidates(name, position, details, photo)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, position, details, photo || null], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Candidate Added Successfully"
        });

    });

};

const getCandidates = (req, res) => {

    db.query(
        "SELECT * FROM candidates WHERE is_active=TRUE ORDER BY position,name",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false
                });
            }

            res.json({
                success: true,
                candidates: result
            });

        }
    );

};

const updateCandidate = (req, res) => {

    const { id } = req.params;

    const { name, position, details, photo } = req.body;

    db.query(
        "UPDATE candidates SET name=?,position=?,details=?,photo=? WHERE id=?",
        [name, position, details, photo || null, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false
                });
            }

            res.json({
                success: true,
                message: "Candidate Updated Successfully"
            });

        }
    );

};

const deleteCandidate = (req, res) => {

    const { id } = req.params;

    db.query(
        "UPDATE candidates SET is_active=FALSE WHERE id=?",
        [id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false
                });
            }

            res.json({
                success: true,
                message: "Candidate Deleted Successfully"
            });

        }
    );

};

module.exports = {
    addCandidate,
    getCandidates,
    updateCandidate,
    deleteCandidate
};