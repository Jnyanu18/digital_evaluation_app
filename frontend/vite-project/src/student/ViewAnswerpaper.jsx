import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiFileText, FiAward } from "react-icons/fi";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/Card";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";
import { motion } from "framer-motion";

const ViewAnswerpaper = () => {
  const { answerSheetId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalMarks, setTotalMarks] = useState(0);
  const [maxPossibleMarks, setMaxPossibleMarks] = useState(0);
  
  const addToast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/answerpaper/${answerSheetId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        
        setAnswerSheetUrl(response.data.answerSheet);
        const initialMarks = response.data.marks || [];
        setMarks(initialMarks);
        calculateTotals(initialMarks);
      } catch (error) {
        console.error("Error fetching data:", error);
        addToast({ title: "Error", description: "Failed to load answer paper details.", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [answerSheetId, addToast]);

  const calculateTotals = (marksArray) => {
    let obtained = 0;
    let max = 0;
    marksArray.forEach((mark) => {
      obtained += (mark.marksObtained || 0);
      max += (mark.questionId?.maxMarks || 0);
    });
    setTotalMarks(obtained);
    setMaxPossibleMarks(max);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
      </div>
    );
  }

  const percentage = maxPossibleMarks > 0 ? Math.round((totalMarks / maxPossibleMarks) * 100) : 0;
  
  // Determine grade color
  const getGradeColor = () => {
     if (percentage >= 80) return "text-[--color-accent-green] drop-shadow-[0_0_8px_var(--color-accent-green)]";
     if (percentage >= 60) return "text-[--color-accent-blue] drop-shadow-[0_0_8px_var(--color-accent-blue)]";
     if (percentage >= 40) return "text-[--color-accent-yellow] drop-shadow-[0_0_8px_var(--color-accent-yellow)]";
     return "text-[--color-accent-red] drop-shadow-[0_0_8px_var(--color-accent-red)]";
  };

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
                Evaluation Results
              </h1>
              <p className="text-sm text-[--color-text-secondary]">Review your graded paper and marks breakdown.</p>
            </div>
          </div>
        </div>

        {/* Main Content: Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Left: PDF Viewer */}
          <div className="flex-1 flex flex-col min-h-0 bg-[--color-bg-elevated] rounded-[--radius-large] border border-[--color-border-default] overflow-hidden relative">
             <div className="p-4 border-b border-[--color-border-default] bg bg-[--color-bg-card]/50 shrink-0 flex items-center gap-2 text-[--color-text-secondary]">
                <FiFileText /> <span className="text-sm font-medium uppercase tracking-wider">Submitted Answer Sheet</span>
             </div>
             {answerSheetUrl ? (
               <iframe
                 src={`${answerSheetUrl}#toolbar=0`}
                 className="w-full h-full border-none object-contain bg-white/5"
                 title="Student Answer Sheet Viewer"
               />
             ) : (
                <div className="flex-1 flex items-center justify-center text-[--color-text-muted]">
                   No answer sheet available to view.
                </div>
             )}
          </div>

          {/* Right: Score Breakdown Panel */}
          <div className="w-full lg:w-[450px] flex flex-col shrink-0 min-h-0 gap-4">
            
            {/* Final Score Card */}
            <GlassCard className="shrink-0 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FiAward className="w-24 h-24" />
               </div>
               
               <h3 className="text-sm uppercase tracking-widest text-[--color-text-secondary] font-semibold mb-2">
                  Total Score
               </h3>
               
               <div className="flex items-baseline justify-center gap-2 mb-2 relative z-10">
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`font-heading text-6xl font-bold ${getGradeColor()}`}
                  >
                     {totalMarks}
                  </motion.span>
                  <span className="text-2xl text-[--color-text-muted] font-medium">/ {maxPossibleMarks}</span>
               </div>
               
               <div className="mt-4 px-4 py-1.5 rounded-full bg-[--color-bg-elevated] border border-[--color-border-default] text-sm font-medium">
                  Result: {percentage}%
               </div>
            </GlassCard>

            {/* Detailed Marks Table */}
            <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 h-full">
              <div className="p-5 border-b border-[--color-border-default] bg bg-[--color-bg-card]/50 shrink-0">
                 <h3 className="font-heading font-semibold text-lg text-[--color-text-primary] flex items-center gap-2">
                    <FiCheckCircle className="text-[--color-accent-blue]" /> Question Breakdown
                 </h3>
              </div>

              <div className="flex-1 overflow-y-auto">
                 {marks.length > 0 ? (
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="lowercase tracking-wider text-[--color-text-muted] font-semibold sticky top-0 bg-[--color-bg-elevated] border-b border-[--color-border-default] z-10">
                        <tr>
                           <th className="px-5 py-4"># Question</th>
                           <th className="px-5 py-4 text-center">Score</th>
                           <th className="px-5 py-4 text-center">Max</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[--color-border-default]/50">
                        {marks.map((mark, index) => {
                           const isFullMarks = mark.marksObtained === mark.questionId?.maxMarks;
                           
                           return (
                              <tr key={index} className="hover:bg-[--color-bg-elevated] transition-colors group">
                                 <td className="px-5 py-4 font-medium max-w-[200px] truncate" title={mark.questionId?.questionText}>
                                    <span className="text-[--color-text-muted] mr-2">Q{mark.questionId?.questionNumber || index+1}</span>
                                    {mark.questionId?.questionText || "Question details missing"}
                                 </td>
                                 <td className="px-5 py-4 text-center">
                                    <span className={`inline-flex min-w-[2.5rem] justify-center px-2 py-1 rounded text-sm font-bold border ${isFullMarks ? "text-[--color-accent-green] bg-[--color-accent-green]/10 border-[--color-accent-green]/20" : "text-[--color-text-primary] bg-[--color-bg-primary] border-[--color-border-default]"}`}>
                                       {mark.marksObtained !== undefined ? mark.marksObtained : "-"}
                                    </span>
                                 </td>
                                 <td className="px-5 py-4 text-center text-[--color-text-muted]">
                                    {mark.questionId?.maxMarks || "-"}
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                   </table>
                 ) : (
                   <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                      <FiFileText className="w-12 h-12 text-[--color-text-muted]/50 mb-4" />
                      <p className="text-[--color-text-secondary]">No detailed marks available to display.</p>
                   </div>
                 )}
              </div>
            </GlassCard>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswerpaper;