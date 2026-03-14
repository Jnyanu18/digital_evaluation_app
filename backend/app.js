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

app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);
app.use('/answerpaper', answerpaperRoutes);
app.use('/questionPaper',questionPaperRoutes);
app.use('/marks',marksRoutes);
app.use('/question',questionRoutes);
app.use('/exam',examRoutes);
app.use('/subject',subjectRoute);
app.use('/section', sectionRoutes);

module.exports = app;
