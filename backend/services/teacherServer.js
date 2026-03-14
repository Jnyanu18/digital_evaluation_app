const teacherModel = require('../models/teacherModel');


module.exports.createTeacher = async ({
    name , email, password
}) => {
    if (!name || !email || !password) {
        throw new Error('All fields are required');
    }
    const teacher = teacherModel.create({
        name,
        email,
        password
    })

    return teacher;
}