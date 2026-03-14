const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authStudent } = require('../middlewares/authMiddleware');


router.post('/add', examController.addExam);


router.delete('/delete/:id', examController.deleteExam);


router.get('/all', examController.getAllExams);

router.get('/data/:examId', authStudent , examController.getExamData);

module.exports = router;