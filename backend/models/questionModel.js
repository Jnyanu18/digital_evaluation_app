const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionNumber:{
        type:Number,
        required:true
    },
    questionText: {
        type: String,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    part: {
        type: String,
        required: true
    },
    QuestionpaperId: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionPaper',
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;