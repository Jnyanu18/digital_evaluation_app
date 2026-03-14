import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import StudentProtectWrapper from "./components/StudentProtectWrapper";
import StudentDashboard from "./student/StudentDashboard";
import StudentLogout from "./pages/StudentLogout";
import TeacherProtectWrapper from "./components/TeacherProtectionWrapper";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherSignup from "./pages/TeacherSignup";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminLogout from "./pages/AdminLogout";
import TeacherLogout from "./pages/TeacherLogout";
import AdminProtectWrapper from "./components/AdminProtectorWrapper";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import AdminExamsPage from "./pages/AdminExamView";
import QuestionPaperDetail from "./components/QuestionPaperDetail";
import AllQuestionPaper from "./pages/AllQuestionPaper";
import AllAnswerPapers from "./pages/AllAnswerPapers";
import AssignedPapers from "./teacher/AssignedPapers";
import EvaluatePaper from "./teacher/EvaluatePaper";
import PendingPaper from "./teacher/PendingPaper";
import ViewAnswerpaper from "./pages/ViewAnswerpaper";
import CheckedPaper from "./teacher/CheckedPapers";
import UpdateMarks from "./teacher/UpdateMarks";
import LandingPage from "./pages/LandingPage";
import AdminContext from "./context/AdminContext"; // Import AdminContext

function App() {
  return (
    <AdminContext> {/* Wrap the entire application with AdminContext */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/signup" element={<TeacherSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/examView" element={<AdminExamsPage />} />
        <Route path="/all/AnswerPapers" element={<AllAnswerPapers />} />
        <Route path="/all/QuestionPaper" element={<AllQuestionPaper />} />
        <Route path="/question-paper/:id" element={<QuestionPaperDetail />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard />} />
        
        <Route path="/teacher/checked-papers" element={<CheckedPaper />} />
        <Route path="/teacher/update/:answerSheetId" element={<UpdateMarks />} />
        <Route path="/teacher/assigned-papers" element={<AssignedPapers />} />
      
        <Route path="/teacher/evaluate-paper/:answerSheetId" element={<EvaluatePaper />} />
        <Route path="/teacher/pending-papers" element={<PendingPaper />} />


        <Route
          path="/studentDashboard"
          element={
            <StudentProtectWrapper>
              <StudentDashboard />
            </StudentProtectWrapper>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <AdminProtectWrapper>
              <AdminDashboard />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/student/logout"
          element={
            <StudentProtectWrapper>
              <StudentLogout />
            </StudentProtectWrapper>
          }
        />
        <Route
          path="/admin/logout"
          element={
            <AdminProtectWrapper>
              <AdminLogout />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/teacher/logout"
          element={
            <TeacherProtectWrapper>
              <TeacherLogout />
            </TeacherProtectWrapper>
          }
        />
        <Route
          path="/student/subject/:answerSheetId"
          element={
            <ViewAnswerpaper  />
          }
        />
          
      </Routes>
    </AdminContext>
  );
}

export default App;
