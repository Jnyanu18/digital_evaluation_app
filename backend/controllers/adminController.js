const adminModel = require('../models/adminModel');
const teacherModel = require('../models/teacherModel');
const studentModel = require('../models/studentModel');
const answerPaperModel = require('../models/answerpaperModel');
const questionPaperModel = require('../models/questionPaperModel');
const feedbackModel = require('../models/feedbackModel');
const adminServer = require('../services/adminServer');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListTokenModel');
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils");
const examModel = require('../models/examModel');

module.exports.registerAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const isAdminAlready = await adminModel.findOne({ email });

    if (isAdminAlready) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const avatar = req.file;

    try {
        let avatarUrl = null;

        if (avatar) {
            // Upload avatar to Cloudinary
            const avatarUploadResponse = await uploadOnCloudinary(avatar.path);
            if (avatarUploadResponse && avatarUploadResponse.url) {
                avatarUrl = avatarUploadResponse.url;
            } else {
                return res.status(500).json({ message: "Failed to upload avatar" });
            }
        }

        const hashedPassword = await adminModel.hashPassword(password);

        const admin = new adminModel({
            name,
            email,
            avatar: avatarUrl,
            password: hashedPassword,
        });

        await admin.save();

        const token = admin.generateAuthToken();

        res.status(201).json({ token, admin, avatarUrl });
    } catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.loginAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email }).select('+password');

    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = admin.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, admin });
}

module.exports.getAdminProfile = async (req, res, next) => {

    res.status(200).json(req.admin);

}

module.exports.getDashboard = async (req, res, next) => {
    
    const totalTeachers = await teacherModel.countDocuments();
    const totalStudents = await studentModel.countDocuments();
    const totalAnswerPapers = await answerPaperModel.countDocuments();
    const totalQuestionPapers = await questionPaperModel.countDocuments();
    const totalFeedbacks = await feedbackModel.countDocuments();
    const totalExams = await examModel.countDocuments();
    
    const answerPapers = await answerPaperModel.find();
    const answerPapersStatus = {
        'Not_Assigned': 0,
        'Pending': 0,
        'Evaluated': 0
    };

    const feedbackMessages = await feedbackModel.find();
    const feedbackMessagesStatus = {
        'Pending': 0,
        'Resolved': 0
    };
    
    answerPapers.forEach(answerPaper => {
        answerPapersStatus[answerPaper.status]++;
    });

    res.status(200).json({
        totalTeachers,
        totalStudents,
        totalAnswerPapers,
        totalQuestionPapers,
        totalFeedbacks,
        answerPapersStatus,
        feedbackMessagesStatus,
        totalExams,
    });

}

module.exports.logoutAdmin = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}
