const answerpaperModel = require("../models/answerpaperModel");
const { validationResult } = require("express-validator");
const studentModel = require("../models/studentModel");
const teacherModel = require("../models/teacherModel");
const marksModel = require("../models/marksModel");
const examModel = require("../models/examModel");
const subjectModel = require("../models/subjectModel");
const questionPaperModel = require("../models/questionPaperModel");

exports.createAnswerPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subject, exam, studentEmail, total_marks } = req.body;

  try {
    const studentDetail = await studentModel.findOne({ email: studentEmail });
    if (!studentDetail) {
      return res.status(404).json({ message: "Student not found" });
    }

    const examData = await examModel.findOne({ name: exam });
    if (!examData) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const subjectData = await subjectModel.findOne({ subjectName: subject });
    if (!subjectData) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const pdf = req.file;
    if (!pdf) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const answerSheetUrl = pdf.location; // S3 URL

    // 🔍 Find the matching question paper
    const questionPaper = await questionPaperModel.findOne({
      exam: examData._id,
      subject: subjectData._id
    });

    if (!questionPaper) {
      return res.status(404).json({ message: "Question paper not found for the given exam and subject" });
    }

    const newPaper = new answerpaperModel({
      subject: subjectData._id,
      exam: examData._id,
      student: studentDetail._id,
      total_marks,
      answerSheet: answerSheetUrl,
      questionPaper: questionPaper._id 
    });

    await newPaper.save();

    studentDetail.answerpapers.push(newPaper._id);
    await studentDetail.save();

    res.status(201).json({ message: "Paper created successfully", paper: newPaper });
  } catch (error) {
    console.error("Error in createAnswerPaper:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.assignanswerPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { teacherEmail } = req.body;
  const answerpaperId = req.params.answerpaperId;

  try {
   const paper = await answerpaperModel.findById(answerpaperId);

if (!paper) {
  return res.status(404).json({ message: "Paper not found" });
}

const teacher = await teacherModel.findOne({ email: teacherEmail });

if (!teacher) {
  return res.status(404).json({ message: "Teacher not found" });
}

if (paper.marks && paper.marks.length > 0) {
  await marksModel.deleteMany({ _id: { $in: paper.marks } });
}

paper.teacher = teacher._id;
paper.assigned_date = new Date();
paper.marks = []; 
paper.status = "Pending";
paper.elavuation_date = null;
await paper.save();

    if (!teacher.assignedPapers.includes(paper._id)) {
      teacher.assignedPapers.push(paper._id);
      await teacher.save();
    }

    res.status(200).json({ message: "Paper assigned successfully", paper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkanswerPaper = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  
  const marks = req.body.marksArray;
  const answerpaperId = req.params.answerpaperId;
  
  console.log(req.body.marks);
  if (!Array.isArray(marks)) {
    return res.status(400).json({ message: "Marks must be an array" });
  }

  try {
    const paper = await answerpaperModel.findById(answerpaperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    for (const mark of marks) {
      if (mark.obtainMarks < 0) {
        return res.status(400).json({ message: "Marks cannot be negative" });
      }

      if (mark.obtainMarks > paper.total_marks) {
        return res.status(400).json({ message: "Marks cannot be greater than total marks" });
      }

      const marksCreate = await marksModel.create({
        marksObtained: mark.obtainMarks,
        questionId: mark.questionId,
        answerPaper: answerpaperId,
      });

      paper.marks.push(marksCreate._id);
      paper.status = "Evaluated";
      paper.elavuation_date = new Date(); 
    }

    await paper.save();

    res.status(200).json({ message: "Paper checked successfully", paper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateMarks = async (req, res) => {
  try {
    const { updatedMarks } = req.body;

    if (!Array.isArray(updatedMarks)) {
      return res.status(400).json({ message: "Marks must be an array" });
    }

    for (const mark of updatedMarks) {
      const existingMark = await marksModel.findById(mark.id);
      if (!existingMark) {
        return res.status(404).json({ message: `Mark with ID ${mark.markId} not found` });
      }

      if (mark.obtainMarks < 0) {
        return res.status(400).json({ message: "Marks cannot be negative" });
      }

      existingMark.marksObtained = mark.obtainMarks;
      await existingMark.save();
    }

    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllAnswerPapers = async (req, res) => {
  try {
    const papers = await answerpaperModel.find().populate("subject").populate("exam").populate("student");
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPaper = async (req, res) => {
  const id = req.params.answerSheetId;
  try {
    const paper = await answerpaperModel.findById(id).populate(
      {
        path: "marks",
      populate: { path: "questionId" }
      }
    );
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};