const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
    exam:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
    },
    total_marks: {
        type: Number,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);

module.exports = QuestionPaper;