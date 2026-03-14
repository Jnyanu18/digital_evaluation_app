const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const teacherController = require("../controllers/teacherController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 }
  ]),
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("First name should be 3 characters long"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long"),
  ],
  teacherController.registerTeacher
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long"),
  ],
  teacherController.loginTeacher
);

router.get('/profile', authMiddleware.authTeacher, teacherController.getTeacherProfile);


router.get('/assignedPaper', authMiddleware.authTeacher, teacherController.assignedPaper);

router.get('/pendingPaper', authMiddleware.authTeacher, teacherController.pendingPaper);

router.get('/checkedPaper', authMiddleware.authTeacher, teacherController.checkedPaper);

//logout route
router.get('/logout', authMiddleware.authTeacher, teacherController.logoutTeacher);

router.get('/dashboard', authMiddleware.authTeacher, teacherController.getTeacherDashboard);

module.exports = router;
