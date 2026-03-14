const { validationResult } = require('express-validator');
const Question = require('../models/questionModel');
const QuestionPaper = require('../models/questionPaperModel');

exports.createQuestion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { questionNumber, questionText, maxMarks, QuestionpaperId , part } = req.body;

    try {
        const questionPaper = await QuestionPaper.findById(QuestionpaperId);
        if (!questionPaper) {
            return res.status(404).json({ message: 'Question Paper not found' });
        }

        const question = new Question({
            questionNumber,
            questionText,
            maxMarks,
            part,
            QuestionpaperId
        });

        await question.save();

        questionPaper.questions.push(question._id);
        await questionPaper.save();

        res.status(201).json({ message: 'Question created successfully', question });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const questionPaper = await QuestionPaper.findById(question.QuestionpaperId);
        if (questionPaper) {
            questionPaper.questions.pull(question._id);
            await questionPaper.save();
        }

        await Question.findByIdAndDelete(id);

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Question.findByIdAndUpdate(id, req.body, { new: true });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question updated successfully', question });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};