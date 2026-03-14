const Exam = require('../models/examModel');
const Student = require('../models/studentModel');

// filepath: /c:/Users/himan/OneDrive/Desktop/digitalEvaluationSystem/backend/controllers/examController.js

// Controller to add an exam
exports.addExam = async (req, res) => {
    try {
        const newExam = new Exam(req.body);
        await newExam.save();
        res.status(201).json(newExam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to delete an exam
exports.deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExam = await Exam.findByIdAndDelete(id);
        if (!deletedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to get all exams
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('subjectWiseData.subject').populate('subjectWiseData.questionPaper').populate('subjectWiseData.answerPapers');
        res.status(200).json(exams);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getExamData = async (req, res) => {
    try {
        const studentId = req.student._id; 
        const { examId } = req.params;

        
    
        const student = await Student.findById(studentId)
          .populate({
            path: 'answerpapers',
            match: { exam: examId },
            populate: [
                { path: 'subject', select: 'subjectName' }
              ]
          });
    
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        res.json(student.answerpapers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}