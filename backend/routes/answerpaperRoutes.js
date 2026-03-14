const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const answerpaperController = require("../controllers/answerpaperController");
const auth = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

router.post(
  "/create",
  upload.single("answerSheet"),
  [
    
    body("subject").notEmpty().withMessage("subject is required"),
    body("total_marks")
      .notEmpty()
      .isNumeric()
      .withMessage("valid number is required"),
    body("studentEmail").notEmpty().withMessage("student is required"),
    body("exam").notEmpty().withMessage("exam is required"),
    body("subject").notEmpty().withMessage("subject is required"),
  ],
  answerpaperController.createAnswerPaper
);

router.get("/allAnswerPaper", answerpaperController.getAllAnswerPapers);

// assigning answerpaper to teacher for checking
router.patch(
  "/assign/:answerpaperId",
  [auth.authAdmin, body("teacherEmail").notEmpty().withMessage("teacher is required")],
  answerpaperController.assignanswerPaper
);

// checking answerpaper and giving marks
router.patch(
  "/check/:answerpaperId",
  [

    // Validate that "marks" is an array
    body("marksArray")
      .isArray({ min: 1 })
      .withMessage("Marks must be an array and cannot be empty"),

    // Validate each item inside the "marks" array
    body("marksArray.*.questionId")
      .notEmpty()
      .withMessage("Each mark must have a questionId"),

    body("marksArray.*.obtainMarks")
      .isInt({ min: 0 })
      .withMessage("Marks obtained must be a non-negative integer"),
  ],
  answerpaperController.checkanswerPaper
);

router.patch("/update-marks", answerpaperController.updateMarks);

router.get("/:answerSheetId", answerpaperController.getPaper);



module.exports = router;