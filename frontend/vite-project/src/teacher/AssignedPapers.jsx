import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFolder, FiFileText, FiUser, FiClock, FiCheckCircle } from "react-icons/fi";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/Card";
import AnimatedPage from "../components/AnimatedPage";
import Navbar from "../components/Navbar";
import { useToast } from "../hooks/useToast";

const AssignedPapers = () => {
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const addToast = useToast();

  const fetchAssignedPapers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/teacher/assignedPaper`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAssignedPapers(response.data);
      groupPapersBySection(response.data);
    } catch (error) {
      console.error("Error fetching assigned papers", error);
      addToast({ title: "Error", description: "Failed to load assigned papers.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const groupPapersBySection = (papers) => {
    const grouped = {};
    papers.forEach((paper) => {
      const section = paper.student?.section?.sectionName || "Unassigned";
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(paper);
    });
    setGroupedPapers(grouped);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  useEffect(() => {
    fetchAssignedPapers();
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "Evaluated":
        return { icon: FiCheckCircle, color: "text-[--color-accent-green]", bg: "bg-[--color-accent-green]/10", border: "border-[--color-accent-green]/20" };
      case "Pending":
        return { icon: FiClock, color: "text-[--color-accent-orange]", bg: "bg-[--color-accent-orange]/10", border: "border-[--color-accent-orange]/20" };
      case "Under_Review":
        return { icon: FiFileText, color: "text-[--color-accent-violet]", bg: "bg-[--color-accent-violet]/10", border: "border-[--color-accent-violet]/20" };
      default:
        return { icon: FiFileText, color: "text-[--color-text-muted]", bg: "bg-[--color-bg-elevated]", border: "border-[--color-border-default]" };
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />

      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[--color-border-default]">
          <Button
            variant="ghost"
            onClick={() => selectedSection ? setSelectedSection(null) : navigate("/teacherDashboard")}
            className="p-2"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold mb-1">
              {selectedSection ? `Section ${selectedSection}` : "Assigned Papers"}
            </h1>
            <p className="text-[--color-text-secondary]">
              {selectedSection ? "Papers assigned from this section" : "Select a section to view assigning papers"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
          </div>
        ) : !selectedSection ? (
          /* View: Folders by Section */
          Object.keys(groupedPapers).length === 0 ? (
            <div className="text-center py-20 border border-[--color-border-default] rounded-[--radius-large] bg-[--color-bg-card]">
              <FiFolder className="w-12 h-12 text-[--color-text-muted] mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[--color-text-primary] mb-2">No Papers Assigned</h3>
              <p className="text-[--color-text-secondary]">You have no papers currently assigned to you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.keys(groupedPapers).map((section) => (
                <GlassCard
                  key={section}
                  className="cursor-pointer group hover:border-[--color-accent-blue]/50 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-[--color-accent-blue]/10 text-[--color-accent-blue] group-hover:scale-110 transition-transform">
                      <FiFolder className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-[--color-text-primary] group-hover:text-[--color-accent-blue] transition-colors">
                        Section {section}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-[--color-border-default]">
                    <span className="text-[--color-text-secondary]">Total Papers</span>
                    <span className="font-bold text-[--color-text-primary] bg-[--color-bg-elevated] px-2.5 py-1 rounded-md border border-[--color-border-default]">
                      {groupedPapers[section].length}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )
        ) : (
          /* View: List of Papers in Selected Section */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedPapers[selectedSection].map((paper) => {
              const statusDisplay = getStatusDisplay(paper.status);
              const StatusIcon = statusDisplay.icon;
              
              return (
                <GlassCard key={paper._id} className="relative group flex flex-col h-full">
                  <div className="mb-5 pr-4 flex items-start justify-between">
                     <div className="flex items-center gap-2">
                        <div className="p-2 rounded bg-[--color-bg-elevated] text-[--color-text-secondary]">
                           <FiBookOpen className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-heading font-semibold text-[--color-text-primary] leading-tight line-clamp-2">
                          {paper.subject?.subjectName || "Unknown Subject"}
                        </h3>
                     </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1 text-sm bg-[--color-bg-elevated] p-3 rounded-lg border border-[--color-border-default]/50">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[--color-text-muted] flex items-center gap-2">
                         <FiUser className="w-4 h-4" /> Student
                      </span>
                      <span className="font-medium text-[--color-text-primary] truncate max-w-[60%]" title={paper.student?.email}>
                         {paper.student?.email || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[--color-text-muted] flex items-center gap-2">
                         <StatusIcon className="w-4 h-4" /> Status
                      </span>
                      <span className={`font-medium px-2 py-0.5 rounded text-xs uppercase tracking-wider border ${statusDisplay.color} ${statusDisplay.bg} ${statusDisplay.border}`}>
                         {paper.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <Link to={`/teacher/evaluate-paper/${paper._id}`} className="mt-auto block">
                    <Button 
                      fullWidth 
                      variant={paper.status === "Evaluated" ? "secondary" : "primary"}
                    >
                      {paper.status === "Evaluated" ? "Review Evaluation" : "Evaluate Paper"}
                    </Button>
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        )}
      </AnimatedPage>
    </div>
  );
};

export default AssignedPapers;