const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/db");



const uploadStudents = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No CSV file uploaded"
        });
    }

   const students = [];

fs.createReadStream(req.file.path)
  .pipe(csv())
  .on("data", (row) => {
    students.push(row);
  })
  .on("end", () => {

    students.forEach((student) => {

      console.log(student);
    console.log(student.register_number);
      db.query(
        "INSERT INTO students (register_number,email) VALUES (?,?)",
        [
          String(student.register_number).trim(),
          String(student.email).trim()
        ],
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

    });

    res.json({
      success: true,
      total: students.length
            });

        })
        .on("error", (err) => {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "CSV Read Error"
            });
        });

};

module.exports = {
    uploadStudents
};

