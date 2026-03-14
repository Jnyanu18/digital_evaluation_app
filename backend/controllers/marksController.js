const Marks = require('../models/marksModel');
const AnswerPaper = require('../models/answerpaperModel');

// Submit marks for a student’s answer sheet
exports.submitMarks = async (req, res) => {
    try {
        const { studentId, answerSheetId, marksArray } = req.body;

        // Ensure marksArray is an array of objects where each contains `questionId` and `mark`
        if (!Array.isArray(marksArray)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Build the bulk operations
        const bulkOps = marksArray.map((markObj) => ({
            updateOne: {
                filter: {
                    studentId: studentId,
                    answerSheetId: answerSheetId,
                    // questionId: markObj.questionId, // Filter by student, answer sheet, and question
                },
                update: {
                    $set: { marksObtained: markObj.mark }, // Set the new mark for the question
                },
                upsert: true, // Create a new entry if one doesn't exist
            },
        }));

        // Execute the bulkWrite operation
        const result = await Marks.bulkWrite(bulkOps);

        // Calculate total obtained marks
        const totalObtainedMarks = marksArray.reduce((total, markObj) => total + markObj.mark, 0);

        // Update the AnswerPaper with the obtained marks and status
        await AnswerPaper.findByIdAndUpdate(answerSheetId, {
            obtained_marks: totalObtainedMarks,
            status: 'Evaluated',
            evaluation_date: new Date()
        });

        res.status(201).json({
            message: "Marks submitted successfully",
            result: result,
        });
    } catch (error) {
        console.error("Error submitting marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch marks for a specific answer sheet
exports.getMarksById = async (req, res) => {
    try {
        const marks = await Marks.findById(req.params.id).populate('answerPaper').populate('questionId');
        if (!marks) {
            return res.status(404).json({ message: 'Marks not found' });
        }
        res.status(200).json(marks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update marks for a specific answer sheet
exports.updateMarksById = async (req, res) => {
    try {
        const marks = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!marks) {
            return res.status(404).json({ message: 'Marks not found' });
        }
        res.status(200).json(marks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch marks for a specific student
exports.getMarksByStudentId = async (req, res) => {
    try {
        const marks = await Marks.find({ studentId: req.params.studentId }).populate('answerPaper').populate('questionId');
        if (!marks) {
            return res.status(404).json({ message: 'Marks not found' });
        }
        res.status(200).json(marks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};