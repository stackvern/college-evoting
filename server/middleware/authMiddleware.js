const jwt = require("jsonwebtoken");

const verifyStudent = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Check Authorization Header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing."
            });
        }

        // Check Bearer Token Format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid Authorization format."
            });
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store Student Data
        req.student = decoded;

        next();

    } catch (err) {

        console.error("JWT Verification Error:", err);

        return res.status(401).json({
            success: false,
            message: "Token Expired or Invalid."
        });

    }

};

module.exports = verifyStudent;