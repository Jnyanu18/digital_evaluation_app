import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiTrash2, FiFileText, FiTag, FiHash, FiAward } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import AnimatedPage from "./AnimatedPage";
import { GlassCard } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const QuestionPaperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [questionPaper, setQuestionPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState({
    questionNumber: "",
    questionText: "",
    maxMarks: "",
    part: "",
    QuestionpaperId: id,
  });

  const partOptions = ['A', 'B', 'C', 'D']; 

  const fetchQuestionPaper = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/questionPaper/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestionPaper(response.data);
    } catch (error) {
      console.error("Error fetching question paper", error);
      addToast({ title: "Error", description: "Failed to load question details.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionPaper();
  }, [id, addToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/question/create`,
        newQuestion,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      addToast({ title: "Success", description: "Question added successfully.", status: "success" });
      fetchQuestionPaper();
      setNewQuestion({ 
        questionNumber: "", 
        questionText: "", 
        maxMarks: "", 
        part: "",
        QuestionpaperId: id 
      });
    } catch (error) {
      console.error("Error adding question", error);
      addToast({ title: "Error", description: error.response?.data?.message || "Failed to add question.", status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/question/delete/${questionId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Deleted", description: "Question removed.", status: "info" });
      fetchQuestionPaper();
    } catch (error) {
      console.error("Error deleting question", error);
      addToast({ title: "Error", description: "Failed to delete question.", status: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[--color-accent-violet]/20 border-t-[--color-accent-violet] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!questionPaper) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex flex-col items-center justify-center text-[--color-text-secondary]">
        <p>Question paper not found.</p>
        <Button className="mt-4" onClick={() => navigate('/all/Questionpaper')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12 pt-8">
      <AnimatedPage className="container mx-auto px-4 max-w-5xl text-left">
        
        {/* Header Strip */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[--color-border-default]">
           <Button variant="ghost" onClick={() => navigate("/all/Questionpaper")} className="p-2">
             <FiArrowLeft className="w-5 h-5" />
           </Button>
           <div>
             <h1 className="text-3xl font-heading font-bold mb-1">
               {questionPaper.subject?.subjectname || "Subject"} Questions
             </h1>
             <p className="text-[--color-text-secondary] flex items-center gap-2">
               <span>{questionPaper.exam?.examType || "Exam"}</span>
               <span className="w-1 h-1 rounded-full bg-[--color-text-muted]"></span>
               <span>{new Date(questionPaper.exam?.dateOfExam).toLocaleDateString()}</span>
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: List of Questions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-heading font-semibold text-[--color-text-primary] flex items-center gap-2 mb-4">
              <FiFileText className="text-[--color-accent-violet]" /> Added Questions ({questionPaper.questions?.length || 0})
            </h2>
            
            {questionPaper.questions && questionPaper.questions.length > 0 ? (
              questionPaper.questions.map((question) => (
                <div key={question._id} className="p-5 rounded-[--radius-standard] bg-[--color-bg-card] border border-[--color-border-default] hover:border-[--color-border-bright] transition-colors relative group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[--color-bg-elevated] border border-[--color-border-bright] font-bold text-[--color-text-primary]">
                          {question.questionNumber}
                        </span>
                        {question.part && (
                           <span className="text-xs font-semibold px-2 py-1 rounded bg-[--color-accent-blue]/10 text-[--color-accent-blue]">
                             Part {question.part}
                           </span>
                        )}
                      </div>
                      <p className="text-[--color-text-primary] leading-relaxed ml-11">
                        {question.questionText}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[--color-accent-green]/10 text-[--color-accent-green] font-medium text-sm">
                        <FiAward className="w-4 h-4" /> {question.maxMarks} Marks
                      </div>
                      <button 
                        onClick={() => handleDeleteQuestion(question._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[--color-text-muted] hover:text-[--color-accent-red] hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Question"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center py-16 border border-[--color-border-default] border-dashed rounded-[--radius-large] bg-[--color-bg-card]">
                  <p className="text-[--color-text-secondary]">No questions added yet. Use the form to add one.</p>
               </div>
            )}
          </div>

          {/* Right Column: Add Question Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <GlassCard padding="p-6 text-left">
                <h3 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
                  <FiPlus className="text-[--color-accent-blue]" /> Add New Question
                </h3>
                
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Question No."
                      type="text"
                      name="questionNumber"
                      icon={FiHash}
                      value={newQuestion.questionNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 1a"
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">Part (Optional)</label>
                      <div className="relative">
                        <select
                          name="part"
                          value={newQuestion.part}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 appearance-none rounded-[--radius-standard] bg-[--color-bg-card] border border-[--color-border-default] text-[--color-text-primary] focus:outline-none focus:border-[--color-border-bright] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all font-sans"
                        >
                          <option value="">None</option>
                          {partOptions.map(p => <option key={p} value={p}>Part {p}</option>)}
                        </select>
                        <FiTag className="absolute right-4 top-[14px] text-[--color-text-muted] pointer-events-none w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                     <label className="block text-sm font-medium text-[--color-text-secondary] mb-2">Question Text</label>
                     <textarea
                       name="questionText"
                       value={newQuestion.questionText}
                       onChange={handleInputChange}
                       placeholder="Enter the question description here..."
                       rows={4}
                       className="w-full px-4 py-3 rounded-[--radius-standard] bg-[--color-bg-card] border border-[--color-border-default] text-[--color-text-primary] placeholder-[--color-text-muted] focus:outline-none focus:border-[--color-border-bright] focus:ring-1 focus:ring-[--color-accent-blue]/50 transition-all resize-y font-sans"
                       required
                     />
                  </div>

                  <Input
                    label="Max Marks"
                    type="number"
                    name="maxMarks"
                    icon={FiAward}
                    min="1"
                    value={newQuestion.maxMarks}
                    onChange={handleInputChange}
                    placeholder="e.g. 10"
                    required
                  />

                  <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
                    Add Question
                  </Button>
                </form>
              </GlassCard>
            </div>
          </div>

        </div>
      </AnimatedPage>
    </div>
  );
};

export default QuestionPaperDetail;