const mongoose = require('mongoose');
const { answerPaper } = require('../controllers/studentController');

const subjectWiseDataSchema = new mongoose.Schema({
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    questionPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionPaper'
    },
    answerPapers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnswerPaper'
    }]
  });
  
  const examSchema = new mongoose.Schema({
    name: String,
    examType: {
      type: String,
      enum: ['midterm', 'endterm'],
      required: true
    },
    dateOfExam: {
      type: Date,
      required: true
    },
    subjectWiseData: [subjectWiseDataSchema]
  });
  
const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;