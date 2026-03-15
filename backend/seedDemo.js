const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/adminModel');
const Teacher = require('./models/teacherModel');
const Student = require('./models/studentModel');
const Section = require('./models/sectionModel');
const Subject = require('./models/subjectModel');
const Exam = require('./models/examModel');
const QuestionPaper = require('./models/questionPaperModel');
const Question = require('./models/questionModel');
const AnswerPaper = require('./models/answerpaperModel');
const Feedback = require('./models/feedbackModel');

async function seed() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to DB');

        // Admin
        const adminPass = await Admin.hashPassword('admin123');
        const admin = await Admin.findOneAndUpdate(
            { email: 'admin@demo.com' },
            { name: 'Demo Admin', email: 'admin@demo.com', password: adminPass },
            { upsert: true, new: true }
        );
        console.log('Admin created: admin@demo.com | admin123');

        // Teacher
        const teacherPass = await Teacher.hashPassword('teacher123');
        const teacher = await Teacher.findOneAndUpdate(
            { email: 'teacher@demo.com' },
            { name: 'Demo Teacher', email: 'teacher@demo.com', password: teacherPass },
            { upsert: true, new: true }
        );
        console.log('Teacher created: teacher@demo.com | teacher123');

        // Grab or create base records
        let section = await Section.findOne({ sectionName: 'A' });
        if(!section) section = await Section.create({ sectionName: 'A', branch: 'Computer Science', course: 'B.Tech' });

        let subject = await Subject.findOne({ subjectCode: 'CS101' });
        if(!subject) subject = await Subject.create({ subjectName: 'Computer Science', subjectCode: 'CS101' });

        let exam = await Exam.findOne({ name: 'Midterm 2026' });
        if(!exam) exam = await Exam.create({ name: 'Midterm 2026', examType: 'midterm', dateOfExam: new Date() });

        // Student
        const studentPass = await Student.hashPassword('student123');
        const student = await Student.findOneAndUpdate(
            { email: 'student@demo.com' },
            { name: 'Demo Student', email: 'student@demo.com', password: studentPass, roll_no: 'DEMO001', section: section._id, semester: 3 },
            { upsert: true, new: true }
        );
        console.log('Student created: student@demo.com | student123');

        // Create initial Question Paper
        let qp = await QuestionPaper.findOneAndUpdate(
            { exam: exam._id, subject: subject._id },
            { 
                exam: exam._id, 
                subject: subject._id, 
                total_marks: 100,
                questions: []
            },
            { upsert: true, new: true }
        );

        // Generate specific Questions and link them to the paper
        const q1 = await Question.findOneAndUpdate(
            { QuestionpaperId: qp._id, questionNumber: 1 },
            { questionNumber: 1, questionText: 'Describe the main features of Node.js', maxMarks: 50, part: 'A', QuestionpaperId: qp._id },
            { upsert: true, new: true }
        );
        const q2 = await Question.findOneAndUpdate(
            { QuestionpaperId: qp._id, questionNumber: 2 },
            { questionNumber: 2, questionText: 'Explain the Virtual DOM in React.', maxMarks: 50, part: 'B', QuestionpaperId: qp._id },
            { upsert: true, new: true }
        );

        // Update Question paper with the generated question IDs
        qp = await QuestionPaper.findByIdAndUpdate(qp._id, { questions: [q1._id, q2._id] }, { new: true });
        console.log('Question Paper and Questions properly linked.');

        // Answer Papers (one for each status)
        const statuses = ['Not_Assigned', 'Pending', 'Evaluated'];
        const createdAnswerPapers = [];
        
        for(let i = 0; i < statuses.length; i++) {
            const ap = await AnswerPaper.findOneAndUpdate(
                { student: student._id, exam: exam._id, status: statuses[i] },
                {
                    student: student._id, 
                    exam: exam._id, 
                    subject: subject._id, 
                    teacher: statuses[i] !== 'Not_Assigned' ? teacher._id : null,
                    total_marks: 100,
                    questionPaper: qp._id,
                    status: statuses[i],
                    answerSheet: 'https://example.com/mock-ans.pdf'
                },
                { upsert: true, new: true }
            );
            createdAnswerPapers.push(ap);
        }
        
        // Link answer papers to student
        await Student.findByIdAndUpdate(student._id, {
            $addToSet: { answerpapers: { $each: createdAnswerPapers.map(ap => ap._id) } }
        });
        
        // Link assigned papers to teacher (only those that are assigned)
        const assignedPapers = createdAnswerPapers.filter(ap => ap.status !== 'Not_Assigned');
        await Teacher.findByIdAndUpdate(teacher._id, {
            $addToSet: { assignedPapers: { $each: assignedPapers.map(ap => ap._id) } }
        });
        
        console.log('Multiple Answer Papers created and linked to Student and Teacher.');

        // Feedback
        const evalAnswerPaper = await AnswerPaper.findOne({ student: student._id, status: 'Evaluated' });
        if(evalAnswerPaper) {
            await Feedback.findOneAndUpdate(
                { student: student._id, teacher: teacher._id, answerpaper: evalAnswerPaper._id },
                { 
                    student: student._id, 
                    teacher: teacher._id,
                    answerpaper: evalAnswerPaper._id,
                    feedbackMessage: 'The newly deployed system is looking fantastic!', 
                    status: 'Pending' 
                },
                { upsert: true, new: true }
            );
            console.log('Feedback Mock Data created.');
        }

        console.log('Demo data seeded universally! You can now check the live admin dashboard.');
        process.exit(0);
    } catch (err) {
        require('fs').writeFileSync('error.txt', err.message + '\n' + err.stack);
        process.exit(1);
    }
}
seed();
