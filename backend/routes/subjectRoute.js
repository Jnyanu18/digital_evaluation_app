const express = require('express')
const router = express.Router();
const subjectController = require('../controllers/subjectController');


router.get('/all',subjectController.getAllSubject);

module.exports = router;