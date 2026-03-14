const express = require("express");
const { body } = require("express-validator");
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

const router = express.Router();

router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 }
      ]),
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("name")
            .isLength({ min: 3 })
            .withMessage("Name should be at least 3 characters long"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password should be at least 3 characters long"),
        body("roll_no")
            .notEmpty()
            .withMessage("Roll number is required"),
        body("section")
            .notEmpty()
            .withMessage("section is required"),
        body("semester")
            .isNumeric()
            .withMessage("Semester should be a number"),
    ],
    studentController.registerStudent
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password should be at least 3 characters long"),
    ],
    studentController.loginStudent
);

router.get('/profile', authMiddleware.authStudent, studentController.getStudentProfile);

router.get('/answerPaper', authMiddleware.authStudent, studentController.answerPaper);

router.get('/logout', authMiddleware.authStudent, studentController.logoutStudent);

module.exports = router;