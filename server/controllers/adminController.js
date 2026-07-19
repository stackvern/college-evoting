const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and Password are required"
        });
    }

    const sql = "SELECT * FROM admins WHERE username=?";

    db.query(sql, [username], async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Username"
            });
        }

        const admin = result[0];

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            success: true,
            message: "Admin Login Successful",
            token
        });

    });

};

module.exports = {
    loginAdmin
};