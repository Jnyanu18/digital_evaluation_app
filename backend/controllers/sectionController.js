const Section = require("../models/sectionModel");
const AnswerPaper = require("../models/answerpaperModel");


// Fetch all available sections
exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find({}, "sectionName");
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAnswerPapersBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const answerPapers = await AnswerPaper.find({ section }).populate("subject exam student");
    res.json(answerPapers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};