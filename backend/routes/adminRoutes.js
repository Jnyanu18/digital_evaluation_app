const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

router.post(
  "/register",
  upload.single("avatar"),
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("name should be 3 characters long"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long"),
  ],
  adminController.registerAdmin
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long"),
  ],
  adminController.loginAdmin
);

router.get('/profile', authMiddleware.authAdmin, adminController.getAdminProfile);

//admin dashboard
router.get('/dashboard', authMiddleware.authAdmin, adminController.getDashboard);

//logout
router.get('/logout', authMiddleware.authAdmin, adminController.logoutAdmin);

module.exports = router;
