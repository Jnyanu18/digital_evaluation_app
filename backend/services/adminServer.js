const adminModel = require('../models/adminModel');


module.exports.createAdmin = async ({
    name , email, password
}) => {
    if (!name || !email || !password) {
        throw new Error('All fields are required');
    }
    const admin = adminModel.create({
        name,
        email,
        password
    })

    return admin;
}