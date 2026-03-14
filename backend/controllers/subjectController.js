const Subject = require('../models/subjectModel'); // Assuming you have a Subject model

// Get all subjects
exports.getAllSubject = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};