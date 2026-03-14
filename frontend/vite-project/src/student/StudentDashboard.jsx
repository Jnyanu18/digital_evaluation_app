import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBook, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import AnimatedPage from "../components/AnimatedPage";
import { GlassCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examLoading, setExamLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setExamLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/exam/data/${selectedExam}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/student/subject/${subjectId}`);
  };

  // Helper function for status styling
  const getStatusConfig = (status) => {
    const normalizedStatus = (status || "").toLowerCase();
    if (normalizedStatus.includes("evaluated")) {
      return { text: "Evaluated", colorClass: "text-[--color-accent-green] bg-[--color-accent-green]/10 border-[--color-accent-green]/20" };
    } else if (normalizedStatus.includes("pending") || normalizedStatus.includes("review")) {
      return { text: "Pending Review", colorClass: "text-[--color-accent-orange] bg-[--color-accent-orange]/10 border-[--color-accent-orange]/20" };
    }
    return { text: "Not Attempted", colorClass: "text-[--color-text-secondary] bg-[--color-bg-elevated] border-[--color-border-default]" };
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />
      
      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="mb-8 border-b border-[--color-border-default] pb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">Student Portal</h1>
          <p className="text-[--color-text-secondary]">Select an exam to view your subjects and answers.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Panel: Exam Selection Form */}
          <div className="w-full lg:w-1/3 shrink-0">
            <GlassCard className="sticky top-32">
              <div className="mb-6 flex items-center gap-3 pb-4 border-b border-[--color-border-default]">
                 <div className="p-2.5 rounded-lg bg-[--color-accent-blue]/10 text-[--color-accent-blue]">
                    <FiBook className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-heading font-semibold text-[--color-text-primary]">
                   Select Exam
                 </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">
                    Available Exams
                  </label>
                  <div className="relative">
                     <select
                       value={selectedExam}
                       onChange={(e) => {
                          setSelectedExam(e.target.value);
                          setSubjects([]); // Clear previous subjects on change
                       }}
                       disabled={examLoading}
                       className="w-full bg-[--color-bg-elevated] border border-[--color-border-default] rounded-xl px-4 py-3.5 text-[--color-text-primary] focus:outline-none focus:border-[--color-accent-blue] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                       required
                     >
                       <option value="" disabled>Select an exam session...</option>
                       {exams.map((exam) => (
                         <option key={exam._id} value={exam._id}>
                           {exam.name || exam.examType || "Unknown Exam"}
                         </option>
                       ))}
                     </select>
                     {/* Custom dropdown arrow */}
                     <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[--color-text-muted]">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                     </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || !selectedExam}
                  isLoading={loading}
                  className="py-3"
                >
                  Load Subjects
                </Button>
              </form>
            </GlassCard>
          </div>

          {/* Right Panel: Subjects List */}
          <div className="flex-1">
            <GlassCard className="h-full min-h-[500px] flex flex-col p-0 overflow-hidden">
               <div className="p-6 border-b border-[--color-border-default] bg-[--color-bg-card]/50 flex justify-between items-end">
                  <div>
                     <h2 className="text-xl font-heading font-semibold text-[--color-text-primary]">
                       Your Subjects
                     </h2>
                     <p className="text-sm text-[--color-text-secondary] mt-1">
                       {selectedExam ? "Subjects for selected exam" : "Select an exam first"}
                     </p>
                  </div>
                  {subjects.length > 0 && (
                     <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[--color-bg-elevated] text-[--color-text-secondary] border border-[--color-border-default]">
                        {subjects.length} Found
                     </span>
                  )}
               </div>

               <div className="flex-1 p-6 bg-[--color-bg-primary]/30 relative">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-10 h-10 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
                    </div>
                  ) : subjects.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                       <div className="w-16 h-16 rounded-full bg-[--color-bg-elevated] flex items-center justify-center mb-4 border border-[--color-border-default]">
                          <FiAlertCircle className="w-8 h-8 text-[--color-text-muted]" />
                       </div>
                       <h3 className="text-lg font-medium text-[--color-text-primary] mb-1">
                          {selectedExam ? "No Subjects Found" : "Awaiting Selection"}
                       </h3>
                       <p className="text-sm text-[--color-text-secondary] max-w-sm">
                          {selectedExam 
                            ? "There are no subjects assigned to you for this particular exam." 
                            : "Please select an exam from the left panel to load your corresponding subjects."}
                       </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subjects.map((subject, index) => {
                         const statusConfig = getStatusConfig(subject.status);
                         return (
                            <motion.div
                              key={subject._id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              onClick={() => handleSubjectClick(subject._id)}
                              className="group flex items-center justify-between p-4 rounded-xl bg-[--color-bg-elevated] border border-[--color-border-default] hover:border-[--color-accent-blue]/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[--color-accent-blue]/5"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-[--color-bg-card] border border-[--color-border-default] flex items-center justify-center group-hover:bg-[--color-accent-blue]/10 group-hover:text-[--color-accent-blue] transition-colors">
                                     <FiBook className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                                  </div>
                                  <div>
                                     <h4 className="text-lg font-heading font-semibold text-[--color-text-primary] group-hover:text-[--color-accent-blue] transition-colors">
                                        {subject.subject?.subjectName || "Subject Name"}
                                     </h4>
                                     <div className="flex items-center mt-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${statusConfig.colorClass}`}>
                                           {statusConfig.text}
                                        </span>
                                     </div>
                                  </div>
                               </div>
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[--color-bg-primary] border border-[--color-border-default] text-[--color-text-muted] group-hover:bg-[--color-accent-blue] group-hover:text-white group-hover:border-[--color-accent-blue] transition-all">
                                  <FiChevronRight className="w-5 h-5" />
                               </div>
                            </motion.div>
                         );
                      })}
                    </div>
                  )}
               </div>
            </GlassCard>
          </div>
        </div>
      </AnimatedPage>
    </div>
  );
};

export default StudentDashboard;