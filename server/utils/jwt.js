const jwt = require("jsonwebtoken");

const generateToken = (student) => {
    return jwt.sign(
        {
            id: student.id,
            register_number: student.register_number,
            email: student.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
};

module.exports = generateToken;