import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiX, FiPlus, FiCalendar, FiBookOpen, FiChevronDown, FiChevronUp, FiTrash2 } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import AnimatedPage from "../components/AnimatedPage";
import { GlassCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const ExamCard = ({ exam, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDelete(exam._id)}
          className="p-2 text-[--color-text-muted] hover:text-[--color-accent-red] hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete Exam"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>

      <div 
        className="cursor-pointer pr-12"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-[--color-accent-blue]/10 text-[--color-accent-blue]`}>
            <FiBookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-[--color-text-primary] capitalize">
            {exam.examType} Exam
          </h3>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-[--color-text-secondary] mt-4">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-4 h-4 text-[--color-text-muted]" />
            <span>{new Date(exam.dateOfExam).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[--color-accent-green]"></span>
            <span>{exam.subjectWiseData?.length || 0} Subjects</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors"
        >
          {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-[--color-border-default]">
              <h4 className="text-sm font-medium text-[--color-text-secondary] mb-3">Associated Subjects</h4>
              {exam.subjectWiseData && exam.subjectWiseData.length > 0 ? (
                <div className="space-y-2">
                  {exam.subjectWiseData.map((subject, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-[--color-bg-elevated] border border-[--color-border-default]/50 text-sm">
                      <span className="text-[--color-text-primary]">{subject.subjectId?.name || "Unknown Subject"}</span>
                      <span className="text-[--color-text-muted]">{subject.subjectId?.code || "--"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[--color-text-muted] italic">No subjects added yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

const AdminExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToast();

  const [newExam, setNewExam] = useState({
    examType: "midterm",
    dateOfExam: new Date().toISOString().split('T')[0],
    subjectWiseData: [],
  });

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
        console.error("Error fetching exams", error);
        addToast({ title: "Error", description: "Failed to load exams.", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [addToast]);

  const sortedExams = [...exams].sort((a, b) => new Date(b.dateOfExam) - new Date(a.dateOfExam));

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewExam({
      examType: "midterm",
      dateOfExam: new Date().toISOString().split('T')[0],
      subjectWiseData: [],
    });
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/exam/add`,
        { ...newExam, dateOfExam: new Date(newExam.dateOfExam).toISOString() },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExams([response.data, ...exams]);
      addToast({ title: "Success", description: "Exam created successfully.", status: "success" });
      handleCloseModal();
    } catch (error) {
      console.error("Error adding exam:", error);
      addToast({ title: "Error", description: error.response?.data?.message || "Failed to create exam.", status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/exam/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExams(exams.filter((exam) => exam._id !== id));
      addToast({ title: "Deleted", description: "Exam has been removed.", status: "info" });
    } catch (error) {
      console.error("Error deleting exam", error);
      addToast({ title: "Error", description: "Failed to delete exam.", status: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />
      
      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[--color-border-default]">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Exam Management</h1>
            <p className="text-[--color-text-secondary]">Create and organize examination schedules</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} icon={FiPlus}>
            Add New Exam
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
          </div>
        ) : sortedExams.length === 0 ? (
          <div className="text-center py-20 border border-[--color-border-default] rounded-[--radius-large] bg-[--color-bg-card]">
            <FiBookOpen className="w-12 h-12 text-[--color-text-muted] mx-auto mb-4" />
            <h3 className="text-xl font-medium text-[--color-text-primary] mb-2">No Exams Found</h3>
            <p className="text-[--color-text-secondary] mb-6">There are currently no exams scheduled in the system.</p>
            <Button onClick={() => setIsModalOpen(true)}>Create First Exam</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedExams.map((exam) => (
              <ExamCard key={exam._id} exam={exam} onDelete={handleDeleteExam} />
            ))}
          </div>
        )}
      </AnimatedPage>

      {/* Add Exam Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[--color-bg-elevated] rounded-[--radius-large] border border-[--color-border-bright] shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-[--color-border-default]">
                <h3 className="text-xl font-heading font-semibold text-[--color-text-primary]">Create New Exam</h3>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 text-[--color-text-muted] hover:text-[--color-text-primary] hover:bg-[--color-bg-card] rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddExam} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">Exam Type</label>
                  <div className="relative">
                    <select
                      value={newExam.examType}
                      onChange={(e) => setNewExam({...newExam, examType: e.target.value})}
                      className="w-full px-4 py-3 appearance-none rounded-[--radius-standard] bg-[--color-bg-card] border border-[--color-border-default] text-[--color-text-primary] focus:outline-none focus:border-[--color-border-bright] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all font-sans"
                      required
                    >
                      <option value="midterm">Midterm</option>
                      <option value="endterm">Endterm</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-[14px] text-[--color-text-muted] pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <Input
                  label="Date of Exam"
                  type="date"
                  icon={FiCalendar}
                  value={newExam.dateOfExam}
                  onChange={(e) => setNewExam({...newExam, dateOfExam: e.target.value})}
                  required
                />

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmitting} className="flex-1">
                    Create Exam
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExamsPage;
