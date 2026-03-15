const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const answerpaperRoutes = require('./routes/answerpaperRoutes');
const questionPaperRoutes = require('./routes/questionPaperRoutes')
const marksRoutes = require('./routes/marksRoutes')
const questionRoutes = require('./routes/questionRoute')
const examRoutes = require('./routes/examRoutes.js')
const subjectRoute = require('./routes/subjectRoute.js')
const sectionRoutes = require('./routes/sectionRoutes.js')

connectToDb();

app.use(cors({
    origin: [
        "https://digital-evaluation-system-8666.vercel.app", 
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/answerpaper', answerpaperRoutes);
app.use('/api/questionPaper',questionPaperRoutes);
app.use('/api/marks',marksRoutes);
app.use('/api/question',questionRoutes);
app.use('/api/exam',examRoutes);
app.use('/api/subject',subjectRoute);
app.use('/api/section', sectionRoutes);

module.exports = app;
