const express = require('express');
const marksController = require('../controllers/marksController');

const router = express.Router();

router.post('/submit', marksController.submitMarks);

router.get('/:id', marksController.getMarksById);

router.put('/:id', marksController.updateMarksById);

router.get('/student/:studentId', marksController.getMarksByStudentId);

module.exports = router;