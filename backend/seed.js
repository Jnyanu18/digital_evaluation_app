const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Section = require('./models/sectionModel');
const Subject = require('./models/subjectModel');
const Exam = require('./models/examModel');

async function seed() {
  await mongoose.connect(process.env.DB_CONNECT);
  console.log('Connected to DB');

  // Seed Section
  const section = await Section.findOneAndUpdate(
    { sectionName: 'A' },
    { sectionName: 'A', branch: 'Computer Science', course: 'B.Tech' },
    { upsert: true, new: true }
  );
  console.log('Seed Section A');

  // Seed Subject
  const subject = await Subject.findOneAndUpdate(
    { subjectCode: 'CS101' },
    { subjectName: 'Computer Science', subjectCode: 'CS101' },
    { upsert: true, new: true }
  );
  console.log('Seed Subject CS101');

  // Seed Exam
  const exam = await Exam.findOneAndUpdate(
    { name: 'Midterm 2026' },
    { name: 'Midterm 2026', examType: 'midterm', dateOfExam: new Date() },
    { upsert: true, new: true }
  );
  console.log('Seed Exam Midterm 2026');

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
