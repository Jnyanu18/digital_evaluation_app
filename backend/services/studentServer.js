const studentModel = require("../models/studentModel");

module.exports.createStudent = async (studentData) => {
    
    const student = new studentModel(studentData);
    await student.save();
    return student;
};