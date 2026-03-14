const teacherModel = require("../models/teacherModel");
const teacherServer = require("../services/teacherServer");
const { validationResult } = require("express-validator");
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils");
const blackListTokenModel = require("../models/blackListTokenModel");

module.exports.registerTeacher = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const isTeacherAlready = await teacherModel.findOne({ email });

  if (isTeacherAlready) {
    return res.status(400).json({ message: "Teacher already exists" });
  }

  const avatar = req.files?.avatar?.[0];

  let avatarUrl = null;

  if (avatar) {
    // Upload avatar to Cloudinary
    const avatarUploadResponse = await uploadOnCloudinary(
      avatar.path,
      "avatar",
      avatar.mimetype
    );
    console.log(avatarUploadResponse);
    avatarUrl = avatarUploadResponse.url;
  }

  const hashedPassword = await teacherModel.hashPassword(password);

  const teacher = await teacherServer.createTeacher({
    name,
    email,
    avatar: avatarUrl,
    password: hashedPassword,
  });

  const token = teacher.generateAuthToken();

  res.status(201).json({ token, teacher });
};

module.exports.loginTeacher = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const teacher = await teacherModel.findOne({ email }).select("+password");

  if (!teacher) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await teacher.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = teacher.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, teacher });
};

module.exports.getTeacherProfile = async (req, res, next) => {
  res.status(200).json(req.teacher);
};

module.exports.assignedPaper = async (req, res, next) => {
  const teacher = await teacherModel
    .findById(req.teacher._id)
    .populate({
      path: 'assignedPapers',
      populate: [
          { path: 'student', model: 'Student' , populate: { path: 'section', model: 'Section' } },
          { path: 'subject', model: 'Subject' } 
      ]
  });

  const papers = teacher.assignedPapers;

  res.status(200).json(papers);
};
module.exports.pendingPaper = async (req, res, next) => {
  const teacher = await teacherModel
    .findById(req.teacher._id)
    .populate({
      path: 'assignedPapers',
      match: { status: 'Pending' },
      populate: [
        { path: 'student', model: 'Student', populate: { path: 'section', model: 'Section' } },
        { path: 'subject', model: 'Subject' }
      ]
    });

  const papers = teacher.assignedPapers;

  res.status(200).json(papers);
};
module.exports.checkedPaper = async (req, res, next) => {
  const teacher = await teacherModel
    .findById(req.teacher._id)
    .populate({
      path: 'assignedPapers',
      match: { status: 'Evaluated' },
      populate: [
        { path: 'student', model: 'Student', populate: { path: 'section', model: 'Section' } },
        { path: 'subject', model: 'Subject' }
      ]
    });

  const papers = teacher.assignedPapers;

  res.status(200).json(papers);
};



module.exports.logoutTeacher = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};

module.exports.getTeacherDashboard = async (req, res, next) => {

  const id = req.teacherId;
  if(!id){
    return res.status(400).json({message: "Teacher not found"});
  }
  const teacher = await teacherModel
  .findById(id)
  .populate({
      path: 'assignedPapers',
      
  });
  const papers = teacher.assignedPapers;
  res.status(200).json(papers);
};
