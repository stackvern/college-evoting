const db = require("../config/db");

const getDashboardResults = (req, res) => {

    const statsQuery = `
        SELECT
            (SELECT COUNT(*) FROM students) AS totalStudents,
            (SELECT COUNT(*) FROM students WHERE has_voted = TRUE) AS totalVotes
    `;

    db.query(statsQuery, (err, stats) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Statistics Error"
            });
        }

        const totalStudents = stats[0].totalStudents;
        const totalVotes = stats[0].totalVotes;

        const votingPercentage =
            totalStudents > 0
                ? ((totalVotes / totalStudents) * 100).toFixed(2)
                : 0;

        const resultQuery = `
            SELECT
                c.id,
                c.name,
                c.position,
                COUNT(v.id) AS votes
            FROM candidates c
            LEFT JOIN votes v
            ON c.id = v.candidate_id
            WHERE c.is_active = TRUE
            GROUP BY c.id,c.name,c.position
            ORDER BY c.position ASC,votes DESC
        `;

        db.query(resultQuery, (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Result Error"
                });
            }

            const positions = {};

            rows.forEach(candidate => {

                if (!positions[candidate.position]) {

                    positions[candidate.position] = {
                        position: candidate.position,
                        totalVotes: 0,
                        winner: null,
                        candidates: []
                    };

                }

                positions[candidate.position].candidates.push({

                    id: candidate.id,
                    name: candidate.name,
                    votes: Number(candidate.votes)

                });

                positions[candidate.position].totalVotes += Number(candidate.votes);

            });

            Object.keys(positions).forEach(position => {

                const firstCandidate = positions[position].candidates[0];

                if (positions[position].totalVotes === 0) {

                    positions[position].winner = null;
                } 
                else {

                    positions[position].winner = firstCandidate;

                }

            });

            res.json({

                success: true,

                statistics: {

                    totalStudents,

                    totalVotes,

                    votingPercentage

                },

                positions: Object.values(positions)

            });

        });

    });

};

module.exports = {

    getDashboardResults

};