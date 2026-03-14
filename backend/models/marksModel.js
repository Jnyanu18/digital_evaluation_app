const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({

    answerPaper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerPaper',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    }
},{timestamps:true});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;