const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListTokenModel');
const adminModel = require('../models/adminModel');
const teacherModel = require('../models/teacherModel');
const studentModel = require('../models/studentModel');

module.exports.authAdmin = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorize' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorizedd' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decoded._id)

        req.admin = admin;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorizeddd' });
    }
}

module.exports.authTeacher = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorize' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorizedd' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await teacherModel.findById(decoded._id)

        req.teacher = teacher;
        req.teacherId = decoded._id;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorizeddd' });
    }
}

module.exports.authStudent = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorize' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorizedd' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await studentModel.findById(decoded._id);

        req.student = student;
        

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorizeddd' });
    }
}
