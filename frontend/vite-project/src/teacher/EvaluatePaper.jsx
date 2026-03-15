import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";

const EvaluateAnswerSheet = () => {
  const { answerSheetId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [marksArray, setMarksArray] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [marksSubmitted, setMarksSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const addToast = useToast();

  useEffect(() => {
    const fetchAnswerSheetAndQuestions = async () => {
      try {
        setIsLoading(true);
        const answerSheetResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/answerpaper/${answerSheetId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        setAnswerSheetUrl(answerSheetResponse.data.answerSheet);
        if (answerSheetResponse.data.status === "Evaluated") {
          setMarksSubmitted(true);
          setMarksArray(answerSheetResponse.data.marksArray || []);
        }

        const questionPaperId = answerSheetResponse.data.questionPaper;
        
        if (questionPaperId) {
            const questionsResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/questionPaper/${questionPaperId}`,
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );
            setQuestions(questionsResponse.data.questions);
            
            // Initialize marks array if not already set by evaluated status
            if (answerSheetResponse.data.status !== "Evaluated" && questionsResponse.data.questions.length > 0) {
               const initialMarks = questionsResponse.data.questions.map(q => ({
                   questionId: q._id,
                   obtainMarks: "" // Empty string for easier input handling
               }));
               setMarksArray(initialMarks);
            }
        }
      } catch (error) {
        console.error("Error fetching answer sheet or questions:", error);
        addToast({ title: "Error", description: "Failed to load evaluation data.", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAnswerSheetAndQuestions();
  }, [answerSheetId, addToast]);
    
  const handleMarkChange = (event) => {
    const value = event.target.value;
    const newMarksArray = [...marksArray];
    
    // Allow empty string to clear input, otherwise parse as float
    const numValue = value === "" ? "" : parseFloat(value);
    
    // Ensure we don't exceed max marks if a number is entered
    const maxMarks = questions[currentQuestionIndex]?.maxMarks;
    if (numValue !== "" && maxMarks && numValue > maxMarks) {
       addToast({ title: "Warning", description: `Marks cannot exceed ${maxMarks}`, status: "warning" });
       return;
    }

    newMarksArray[currentQuestionIndex] = {
      ...newMarksArray[currentQuestionIndex],
      questionId: questions[currentQuestionIndex]._id, // Ensure ID is set
      obtainMarks: numValue,
    };
    setMarksArray(newMarksArray);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateTotalScore = () => {
    let obtained = 0;
    let max = 0;
    marksArray.forEach(m => obtained += (Number(m.obtainMarks) || 0));
    questions.forEach(q => max += (Number(q.maxMarks) || 0));
    return { obtained, max };
  };

  const handleSubmitMarks = async () => {
    // Validate all marks are entered
    const isComplete = marksArray.every(m => m.obtainMarks !== "" && m.obtainMarks !== null);
    if (!isComplete) {
       addToast({ title: "Incomplete", description: "Please enter marks for all questions before submitting.", status: "error" });
       return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/answerpaper/check/${answerSheetId}`,
        { marksArray },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      addToast({ title: "Success", description: "Marks submitted successfully!", status: "success" });
      setMarksSubmitted(true);
      // Let user manually navigate back instead of forcing it immediately
    } catch (error) {
      console.error("Error submitting marks:", error);
      addToast({ title: "Submission Failed", description: "Failed to submit marks.", status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const totalScore = calculateTotalScore();
  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="pt-24 px-4 pb-4 flex-1 flex flex-col max-w-[1600px] mx-auto w-full gap-4">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-[--color-border-default] shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold mb-1 flex items-center gap-3">
                Evaluate Paper
                {marksSubmitted && (
                   <span className="text-sm font-sans flex items-center gap-1.5 px-2.5 py-1 rounded bg-[--color-accent-green]/10 text-[--color-accent-green] border border-[--color-accent-green]/20">
                     <FiCheckCircle /> Evaluated
                   </span>
                )}
              </h1>
              <p className="text-sm text-[--color-text-secondary]">Review the answer sheet and assign marks.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-[--color-text-muted] uppercase tracking-wider font-semibold mb-1">Total Score</p>
              <p className="font-heading text-xl font-bold text-[--color-text-primary]">
                {totalScore.obtained} <span className="text-[--color-text-secondary] text-base font-normal">/ {totalScore.max}</span>
              </p>
            </div>
            
            {!marksSubmitted && (
               <Button 
                onClick={handleSubmitMarks} 
                isLoading={isSubmitting}
                disabled={marksArray.some(m => m.obtainMarks === "" || m.obtainMarks === null)}
                icon={FiCheckCircle}
              >
                 Submit Evaluation
               </Button>
            )}
          </div>
        </div>

        {/* Main Content: Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 relative">
          
          {/* Left: PDF Viewer (Split Screen 60%) */}
          <div className="lg:w-[60%] flex-1 flex flex-col min-h-0 bg-[rgba(10,10,15,0.4)] backdrop-blur-3xl rounded-[--radius-large] border border-[rgba(255,255,255,0.08)] overflow-hidden relative group shadow-2xl">
             {/* Header Bar for PDF */}
             <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10 flex items-center px-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Student Submission</span>
             </div>
             {answerSheetUrl ? (
               <iframe
                 src={`${answerSheetUrl}#toolbar=0`}
                 className="w-full h-full border-none object-contain pt-4"
                 title="Answer Sheet PDF Viewer"
               />
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[--color-text-muted] gap-3">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <FiCheckCircle className="w-8 h-8 opacity-50" />
                   </div>
                   <p>No document attached to this submission.</p>
                </div>
             )}
          </div>

          {/* Right: Modern Grading Panel (Split Screen 40%) */}
          <div className="lg:w-[40%] flex flex-col shrink-0 min-h-0">
            <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 h-full border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,30,0.65)] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl">
              
              {/* Progress Bar Header */}
              <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,15,0.3)] shrink-0">
                 <div className="flex justify-between items-end mb-4">
                    <h3 className="font-heading font-semibold text-lg text-white">
                       Question Panel
                    </h3>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                       Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                 </div>
                 <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 relative shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}></div>
                    </motion.div>
                 </div>
              </div>

              {/* Question Form Area */}
              <div className="flex-1 overflow-y-auto p-8 relative">
                 <AnimatePresence mode="wait">
                   {questions.length > 0 ? (
                      <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="h-full flex flex-col"
                      >
                         <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-300 font-semibold text-xs tracking-wider uppercase mb-5 border border-fuchsia-500/20 shadow-inner">
                               <span>Part {currentQ?.part || 'A'}</span>
                               <span className="w-1 h-1 rounded-full bg-fuchsia-400"></span>
                               <span>Max: {currentQ?.maxMarks} Marks</span>
                            </div>
                            <h4 className="text-xl text-zinc-100 leading-relaxed font-medium">
                               {currentQ?.questionText}
                            </h4>
                         </div>

                         <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.05)]">
                            <div className="flex items-center justify-between mb-4">
                               <label className="text-sm font-medium text-zinc-400">
                                  Award Marks
                               </label>
                               
                               {/* AI Grading Mock Button */}
                               {!marksSubmitted && (
                                  <button type="button" className="text-xs flex items-center gap-1.5 font-medium px-3 py-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                     AI Suggestion
                                  </button>
                               )}
                            </div>
                            
                            <div className="relative group">
                               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                               <input
                                  type="number"
                                  min="0"
                                  max={currentQ?.maxMarks}
                                  value={marksArray[currentQuestionIndex]?.obtainMarks ?? ""}
                                  onChange={handleMarkChange}
                                  disabled={marksSubmitted}
                                  placeholder="0.0"
                                  className="relative w-full bg-[rgba(15,15,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl px-6 py-5 text-3xl font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed shadow-inner z-10"
                               />
                               {marksArray[currentQuestionIndex]?.obtainMarks !== "" && (
                                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 text-xl font-bold pointer-events-none z-20">
                                     <span className="text-zinc-600 font-normal mr-1">/</span> {currentQ?.maxMarks}
                                  </div>
                               )}
                            </div>
                            {marksArray[currentQuestionIndex]?.obtainMarks > currentQ?.maxMarks && (
                               <motion.p 
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: 'auto' }}
                                 className="text-red-400 text-sm mt-3 flex items-center gap-2 bg-red-400/10 px-3 py-2 rounded border border-red-400/20"
                               >
                                 <FiAlertCircle className="shrink-0" /> Exceeds maximum marks ({currentQ?.maxMarks})
                               </motion.p>
                            )}
                         </div>

                      </motion.div>
                   ) : (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
                         <div className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                            <FiBook className="w-5 h-5 opacity-50" />
                         </div>
                         <p>Loading questions...</p>
                      </div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,15,0.4)] shrink-0 flex gap-4">
                 <Button
                   variant="secondary"
                   onClick={handlePreviousQuestion}
                   disabled={currentQuestionIndex === 0}
                   className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 h-12"
                 >
                   <FiChevronLeft className="w-5 h-5 mr-1" /> Previous
                 </Button>
                 
                 <Button
                   variant="secondary"
                   onClick={handleNextQuestion}
                   disabled={currentQuestionIndex === questions.length - 1}
                   className="flex-1 border-white/10 bg-gradient-to-r hover:from-blue-600/20 hover:to-violet-600/20 h-12 transition-all duration-300"
                 >
                   Next <FiChevronRight className="w-5 h-5 ml-1" />
                 </Button>
              </div>

            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EvaluateAnswerSheet;
