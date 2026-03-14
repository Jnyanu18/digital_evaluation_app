const mongoose = require('mongoose');

const answerpaperSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
        
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    marks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marks'
    }
    ],
    questionPaper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questionPaper"
      }
,
   elavuation_date: {
        type: Date
    },
    assigned_date: {
        type: Date
    },
        feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    status: {
        type: String,
        enum: ['Not_Assigned', "Pending" , 'Evaluated','Under_Review'],
        default: 'Not_Assigned'
    },
    answerSheet: {
        type: String,
        required: true
    }
    
}, { timestamps: true });

const AnswerPaper = mongoose.model('AnswerPaper', answerpaperSchema);

module.exports = AnswerPaper;