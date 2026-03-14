const studentModel = require("../models/studentModel");
const studentServer = require("../services/studentServer");
const { validationResult } = require("express-validator");
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils");
const blackListTokenModel = require("../models/blackListTokenModel");
const sectionModel = require("../models/sectionModel");

module.exports.registerStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, roll_no, section , semester } = req.body; 

  const isStudentAlready = await studentModel.findOne({ email });

  const sectionId = await sectionModel.findOne({ sectionName: section });

  if (!sectionId) {
    return res.status(404).json({ message: "Section not found" });
  }

  if (isStudentAlready) {
    return res.status(400).json({ message: "Student already exists" });
  }

  const avatar = req.files?.avatar?.[0];

  try {
    let avatarUrl = null;

    if (avatar) {
      // Upload avatar to Cloudinary
      const avatarUploadResponse = await uploadOnCloudinary(avatar.path, avatar.mimetype);
      console.log(avatarUploadResponse);
      avatarUrl = avatarUploadResponse.url;
    }

    const hashedPassword = await studentModel.hashPassword(password);

    const student = await studentServer.createStudent({
      name,
      email,
      section: sectionId,
      avatar: avatarUrl,
      roll_no,
      semester,
      password: hashedPassword,
    });

    const token = student.generateAuthToken();

    res.status(201).json({ token, student, avatarUrl });
  } catch (error) {
    console.error("Error during student registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.loginStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const student = await studentModel.findOne({ email }).select("+password");

  if (!student) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await student.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = student.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, student });
};

module.exports.getStudentProfile = async (req, res, next) => {
  res.status(200).json(req.student);
};

module.exports.answerPaper = async (req, res, next) => {
  const student = await studentModel.findById(req.student._id).populate('answerpapers');

    const papers = student.answerpapers

    res.status(200).json(papers);

};

module.exports.logoutStudent = async (req, res, next) => {
  res.clearCookie('token');
  const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: 'Logged out' });

}