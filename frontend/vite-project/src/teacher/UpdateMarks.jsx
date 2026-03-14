import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/Card";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";

const UpdateMarks = () => {
  const { answerSheetId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [marksArray, setMarksArray] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedMarks, setUpdatedMarks] = useState([]);
  
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
        setMarksArray(answerSheetResponse.data.marks || []);
    
        const qPaperId = answerSheetResponse.data.questionPaper;
    
        if (!qPaperId) {
          console.error("Question Paper ID not found in marks data");
          addToast({ title: "Error", description: "Question Paper ID missing.", status: "error" });
          setIsLoading(false);
          return;
        }
    
        const questionsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/questionPaper/${qPaperId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
    
        setQuestions(questionsResponse.data.questions);
      } catch (error) {
        console.error("Error fetching data:", error);
        addToast({ title: "Error", description: "Failed to load paper data.", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswerSheetAndQuestions();
  }, [answerSheetId, addToast]);

  const handleMarkChange = (event) => {
    const valueStr = event.target.value;
    const value = valueStr === "" ? "" : parseFloat(valueStr);
    const maxMarks = questions[currentQuestionIndex]?.maxMarks || 0;
    const currentMarkId = marksArray[currentQuestionIndex]?._id;

    if (value !== "" && value > maxMarks) {
        addToast({ title: "Warning", description: `Marks cannot exceed ${maxMarks}`, status: "warning" });
        return;
    }

    const newMarksArray = [...marksArray];
    newMarksArray[currentQuestionIndex] = {
      ...newMarksArray[currentQuestionIndex],
      marksObtained: value,
    };
    setMarksArray(newMarksArray);

    if (value !== "") {
      const existingUpdateIndex = updatedMarks.findIndex(mark => mark.id === currentMarkId);
      if (existingUpdateIndex !== -1) {
        const newUpdatedMarks = [...updatedMarks];
        newUpdatedMarks[existingUpdateIndex] = { id: currentMarkId, obtainMarks: value };
        setUpdatedMarks(newUpdatedMarks);
      } else {
        setUpdatedMarks([...updatedMarks, { id: currentMarkId, obtainMarks: value }]);
      }
    }
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
    marksArray.forEach(m => obtained += (Number(m.marksObtained) || 0));
    questions.forEach(q => max += (Number(q.maxMarks) || 0));
    return { obtained, max };
  };

  const handleUpdateMarks = async () => {
    if (updatedMarks.length === 0) {
        addToast({ title: "Info", description: "No marks were changed.", status: "info" });
        return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/answerpaper/update-marks`,
        { updatedMarks },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      addToast({ title: "Updated", description: "Marks updated successfully!", status: "success" });
      navigate("/teacherDashboard");
    } catch (error) {
      console.error("Error updating marks:", error);
      addToast({ title: "Update Failed", description: "Failed to update marks.", status: "error" });
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
  const isCurrentUpdated = updatedMarks.some(mark => mark.id === marksArray[currentQuestionIndex]?._id);

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="pt-24 px-4 pb-4 flex-1 flex flex-col max-w-[1600px] mx-auto w-full gap-4">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-[--color-border-default] shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate(-1)} className="p-2">
              <FiArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold mb-1 flex items-center gap-3">
                Update Marks
              </h1>
              <p className="text-sm text-[--color-text-secondary]">Modify evaluation scores for this answer sheet.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-[--color-text-muted] uppercase tracking-wider font-semibold mb-1">Total Score</p>
              <p className="font-heading text-xl font-bold text-[--color-text-primary]">
                {totalScore.obtained} <span className="text-[--color-text-secondary] text-base font-normal">/ {totalScore.max}</span>
              </p>
            </div>
            
            <Button 
                onClick={handleUpdateMarks} 
                isLoading={isSubmitting}
                disabled={updatedMarks.length === 0}
                icon={FiCheckCircle}
                className={updatedMarks.length > 0 ? "shadow-[0_0_15px_var(--color-accent-blue)]" : ""}
            >
                Save Changes
            </Button>
          </div>
        </div>

        {/* Main Content: Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Left: PDF Viewer */}
          <div className="flex-1 flex flex-col min-h-0 bg-[--color-bg-elevated] rounded-[--radius-large] border border-[--color-border-default] overflow-hidden relative">
             {answerSheetUrl ? (
               <iframe
                 src={`${answerSheetUrl}#toolbar=0`}
                 className="w-full h-full border-none object-contain bg-white/5"
                 title="Answer Sheet PDF Viewer"
               />
             ) : (
                <div className="flex-1 flex items-center justify-center text-[--color-text-muted]">
                   No answer sheet available.
                </div>
             )}
          </div>

          {/* Right: Evaluation Panel */}
          <div className="w-full lg:w-[450px] flex flex-col shrink-0 min-h-0">
            <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 h-full border-[--color-border-bright]">
              
              {/* Progress Bar Header */}
              <div className="p-6 border-b border-[--color-border-default] bg bg-[--color-bg-card]/50 shrink-0">
                 <div className="flex justify-between items-end mb-3">
                    <h3 className="font-heading font-semibold text-lg text-[--color-text-primary]">
                       Question Review
                    </h3>
                    <span className="text-sm font-medium text-[--color-accent-blue]">
                       {currentQuestionIndex + 1} of {questions.length}
                    </span>
                 </div>
                 <div className="h-2 w-full bg-[--color-bg-primary] rounded-full overflow-hidden border border-[--color-border-default] inset-shadow-sm">
                    <motion.div 
                      className="h-full bg-[--color-accent-blue] relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}></div>
                    </motion.div>
                 </div>
              </div>

              {/* Question Form Area */}
              <div className="flex-1 overflow-y-auto p-6 relative">
                 <AnimatePresence mode="wait">
                   {questions.length > 0 ? (
                      <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-full flex flex-col"
                      >
                         <div className="mb-6">
                            <div className="inline-block px-3 py-1 rounded-md bg-[--color-accent-violet]/10 text-[--color-accent-violet] font-semibold text-sm mb-4 border border-[--color-accent-violet]/20">
                               Max Marks: {currentQ?.maxMarks}
                            </div>
                            <h4 className="text-lg text-[--color-text-primary] leading-relaxed font-medium">
                               {currentQ?.questionText}
                            </h4>
                         </div>

                         <div className="mt-8">
                            <label className="block text-sm font-medium text-[--color-text-secondary] mb-3">
                               Update Marks
                            </label>
                            
                            <div className="relative">
                               <input
                                  type="number"
                                  min="0"
                                  max={currentQ?.maxMarks}
                                  value={marksArray[currentQuestionIndex]?.marksObtained ?? ""}
                                  onChange={handleMarkChange}
                                  placeholder={`Enter marks (0-${currentQ?.maxMarks})`}
                                  className={`w-full bg-[--color-bg-primary] border-2 rounded-xl px-5 py-4 text-xl font-bold text-[--color-text-primary] focus:outline-none focus:ring-4 transition-all font-sans
                                     ${isCurrentUpdated 
                                        ? "border-[--color-accent-green] focus:border-[--color-accent-green] focus:ring-[--color-accent-green]/20 bg-[--color-accent-green]/5" 
                                        : "border-[--color-border-bright] focus:border-[--color-accent-blue] focus:ring-[--color-accent-blue]/20"
                                     }
                                  `}
                               />
                               {marksArray[currentQuestionIndex]?.marksObtained !== "" && (
                                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[--color-text-muted] font-medium pointer-events-none">
                                     / {currentQ?.maxMarks}
                                  </div>
                               )}
                            </div>
                            {isCurrentUpdated && (
                               <p className="text-[--color-accent-green] text-sm mt-3 flex items-center gap-1.5 font-medium">
                                 <FiCheckCircle className="w-4 h-4" /> Marks modified (unsaved)
                               </p>
                            )}
                         </div>

                      </motion.div>
                   ) : (
                      <div className="flex items-center justify-center h-full text-[--color-text-muted]">
                         No questions found for this paper.
                      </div>
                   )}
                 </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="p-6 border-t border-[--color-border-default] bg bg-[--color-bg-card]/50 shrink-0 flex gap-4">
                 <Button
                   variant="secondary"
                   onClick={handlePreviousQuestion}
                   disabled={currentQuestionIndex === 0}
                   className="flex-1"
                 >
                   <FiChevronLeft className="w-5 h-5 mr-1" /> Previous
                 </Button>
                 
                 <Button
                   variant="secondary"
                   onClick={handleNextQuestion}
                   disabled={currentQuestionIndex === questions.length - 1}
                   className="flex-1"
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

export default UpdateMarks;
