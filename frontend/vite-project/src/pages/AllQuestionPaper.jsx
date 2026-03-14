import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiFileText, FiBookOpen, FiClock, FiSettings } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import Navbar from "../components/Navbar";
import AnimatedPage from "../components/AnimatedPage";
import { GlassCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const AllQuestionPaper = () => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const addToast = useToast();

  const fetchQuestionPapers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/questionPaper/all`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestionPapers(response.data);
      groupPapersByExamName(response.data);
    } catch (error) {
      console.error("Error fetching question papers", error);
      addToast({ title: "Error", description: "Failed to load question papers.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const groupPapersByExamName = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const examName = paper.exam.name;
      if (!grouped[examName]) {
        grouped[examName] = [];
      }
      grouped[examName].push(paper);
    });
    setGroupedPapers(grouped);
  };

  const handleDeleteQuestionPaper = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question paper?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/question-papers/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Success", description: "Question paper deleted successfully.", status: "success" });
      fetchQuestionPapers();
    } catch (error) {
      console.error("Error deleting question paper", error);
      addToast({ title: "Error", description: "Failed to delete question paper.", status: "error" });
    }
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />
      
      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[--color-border-default]">
          <Button 
            variant="ghost" 
            onClick={() => selectedExam ? setSelectedExam(null) : navigate("/adminDashboard")}
            className="p-2"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold mb-1">
              {selectedExam ? `Papers for ${selectedExam}` : "All Question Papers"}
            </h1>
            <p className="text-[--color-text-secondary]">
              {selectedExam ? "Manage individual subject papers for this exam" : "Select an exam to view its associated question papers"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
          </div>
        ) : !selectedExam ? (
          /* View: List of Exams with Grouped Papers */
          Object.keys(groupedPapers).length === 0 ? (
             <div className="text-center py-20 border border-[--color-border-default] rounded-[--radius-large] bg-[--color-bg-card]">
                <FiFileText className="w-12 h-12 text-[--color-text-muted] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[--color-text-primary] mb-2">No Question Papers Found</h3>
                <p className="text-[--color-text-secondary]">Create a question paper from the Admin Dashboard first.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(groupedPapers).map((examName) => (
                <GlassCard 
                  key={examName}
                  className="cursor-pointer group hover:border-[--color-accent-blue]/50 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setSelectedExam(examName)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[--color-accent-blue]/10 text-[--color-accent-blue] group-hover:scale-110 transition-transform">
                      <FiBookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-[--color-text-primary] mb-2 group-hover:text-[--color-accent-blue] transition-colors">
                        {examName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[--color-text-secondary] bg-[--color-bg-elevated] px-3 py-1 rounded-full w-fit border border-[--color-border-default]">
                        <span className="w-2 h-2 rounded-full bg-[--color-accent-green]"></span>
                        {groupedPapers[examName].length} Papers
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )
        ) : (
          /* View: List of Question Papers for Selected Exam */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedPapers[selectedExam]?.map((paper) => (
              <GlassCard key={paper._id} className="relative group flex flex-col h-full">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteQuestionPaper(paper._id)}
                    className="p-2 text-[--color-text-muted] hover:text-[--color-accent-red] hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Paper"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-start gap-3 mb-6 pr-10">
                  <div className="p-2.5 rounded-lg bg-[--color-accent-violet]/10 text-[--color-accent-violet]">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-[--color-text-primary] leading-tight">
                      {paper.subject?.subjectname || "Unknown Subject"}
                    </h3>
                    <p className="text-sm text-[--color-text-muted] mt-1">{paper.exam?.name}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center justify-between text-sm p-2 rounded bg-[--color-bg-elevated] border border-[--color-border-default]/50">
                    <span className="text-[--color-text-secondary] flex items-center gap-2">
                       <FiClock className="w-4 h-4" /> Date
                    </span>
                    <span className="text-[--color-text-primary] font-medium">
                      {new Date(paper.exam?.dateOfExam).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 rounded bg-[--color-bg-elevated] border border-[--color-border-default]/50">
                    <span className="text-[--color-text-secondary] flex items-center gap-2">
                      Total Marks
                    </span>
                    <span className="text-[--color-text-primary] font-medium bg-[--color-accent-green]/10 text-[--color-accent-green] px-2 py-0.5 rounded">
                      {paper.total_marks || 0}
                    </span>
                  </div>
                </div>

                <Link to={`/question-paper/${paper._id}`} className="mt-auto block">
                  <Button fullWidth variant="secondary" icon={FiSettings}>
                    Manage Questions
                  </Button>
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </AnimatedPage>
    </div>
  );
};

export default AllQuestionPaper;