import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion, AnimatePresence } from "framer-motion";

const AnswerPaperForm = ({ open, handleClose, fetchAnswerPapers = () => {} }) => {
  const [formData, setFormData] = useState({
    subjectId: "",
    examId: "",
    studentEmail: "",
    total_marks: "",
    answerSheet: null,
  });

  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    const fetchSubjectsAndExams = async () => {
      try {
        const subjectsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subject/all`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSubjects(subjectsResponse.data);

        const examsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam/all`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setExams(examsResponse.data);
      } catch (error) {
        console.error("Error fetching subjects or exams", error);
      }
    };

    if (open) {
      fetchSubjectsAndExams();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, answerSheet: file });
    } else {
      addToast({ title: "Invalid File", description: "Please upload a PDF file.", status: "error" });
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.examId || !formData.studentEmail || !formData.total_marks || !formData.answerSheet) {
        addToast({ title: "Validation Error", description: "Please fill all fields.", status: "error" });
        return;
    }

    setIsLoading(true);
    try {
      const selectedSubject = subjects.find(s => s._id === formData.subjectId);
      const selectedExam = exams.find(ex => ex._id === formData.examId);

      const formDataToSend = new FormData();
      formDataToSend.append("subject", selectedSubject?.subjectName || selectedSubject?.name || ""); // Backend expects name string in original, but ID is better. Keeping original logic for now if it relies on names, though selecting by ID
      formDataToSend.append("exam", selectedExam?.name || selectedExam?.examType || "");
      formDataToSend.append("studentEmail", formData.studentEmail);
      formDataToSend.append("total_marks", formData.total_marks);
      formDataToSend.append("answerSheet", formData.answerSheet);

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/answerpaper/create`, formDataToSend, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      addToast({ title: "Success", description: "Answer paper uploaded successfully.", status: "success" });
      if (typeof fetchAnswerPapers === 'function') {
        fetchAnswerPapers();
      }
      handleCompleteClose();
    } catch (error) {
      console.error("Error creating answer paper", error);
      addToast({ title: "Upload Failed", description: error.response?.data?.message || "Failed to upload.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteClose = () => {
    setFormData({ subjectId: "", examId: "", studentEmail: "", total_marks: "", answerSheet: null });
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCompleteClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[--color-bg-elevated] rounded-[--radius-large] border border-[--color-border-bright] shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-[--color-border-default]">
              <h3 className="text-xl font-heading font-semibold text-[--color-text-primary] flex items-center gap-2">
                <FiUploadCloud className="text-[--color-accent-blue]" /> Upload Answer Paper
              </h3>
              <button 
                onClick={handleCompleteClose}
                className="p-2 text-[--color-text-muted] hover:text-[--color-text-primary] hover:bg-[--color-bg-card] rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">Subject</label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[--radius-standard] bg-[--color-bg-card] border border-[--color-border-default] text-[--color-text-primary] focus:outline-none focus:border-[--color-border-bright] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all font-sans"
                  required
                >
                  <option value="">Select a subject...</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.subjectName || s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">Exam</label>
                <select
                  name="examId"
                  value={formData.examId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[--radius-standard] bg-[--color-bg-card] border border-[--color-border-default] text-[--color-text-primary] focus:outline-none focus:border-[--color-border-bright] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all font-sans"
                  required
                >
                  <option value="">Select an exam...</option>
                  {exams.map(e => (
                    <option key={e._id} value={e._id}>{e.name || e.examType}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Student Email"
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Total Marks"
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleInputChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">Paper PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-[--color-text-secondary]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[--color-bg-card] file:text-[--color-text-primary]
                    file:border file:border-[--color-border-default]
                    hover:file:bg-[--color-bg-elevated] hover:file:cursor-pointer
                    transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" onClick={handleCompleteClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Upload PDF
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnswerPaperForm;