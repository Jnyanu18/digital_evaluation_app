
const express = require("express");
const sectionController = require("../controllers/sectionController");

const router = express.Router();


router.get("/sections", sectionController.getSections);

// In sectionControllerRoutes.js
router.get("/section/:section", sectionController.getAnswerPapersBySection);

module.exports = router;