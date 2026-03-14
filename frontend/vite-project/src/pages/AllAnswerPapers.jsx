import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiUserCheck, FiFilter, FiFileText, FiX } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import Navbar from "../components/Navbar";
import AnimatedPage from "../components/AnimatedPage";
import { GlassCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";

const AllAnswerPapers = () => {
  const [answerPapers, setAnswerPapers] = useState([]);
  const [groupedPapers, setGroupedPapers] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("section");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openSingleAssignDialog, setOpenSingleAssignDialog] = useState(false);
  const [bulkTeacherEmail, setBulkTeacherEmail] = useState("");
  const [singleTeacherEmail, setSingleTeacherEmail] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const navigate = useNavigate();
  const addToast = useToast();

  const groupPapers = (papers, criteria) => {
    const grouped = {};
    papers.forEach((paper) => {
      let key;
      switch (criteria) {
        case "section":
          key = paper.student?.section || "Unassigned";
          break;
        case "exam":
          key = paper.exam?.examType || "Unknown Exam";
          break;
        case "status":
          key = paper.status || "Unknown Status";
          break;
        default:
          key = paper.student?.section || "Unassigned";
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(paper);
    });
    setGroupedPapers(grouped);
  };

  const fetchAnswerPapers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/answerpaper/allAnswerPaper`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnswerPapers(response.data);
      groupPapers(response.data, sortCriteria);
    } catch (error) {
      console.error("Error fetching answer papers", error);
      addToast({ title: "Error", description: "Failed to load answer papers.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswerPapers();
  }, []);

  useEffect(() => {
    groupPapers(answerPapers, sortCriteria);
  }, [sortCriteria, answerPapers]);

  const handleDeleteAnswerPaper = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specific answer paper?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/answerpaper/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Deleted", description: "Answer paper deleted.", status: "info" });
      fetchAnswerPapers();
    } catch (error) {
      console.error("Error deleting answer paper", error);
      addToast({ title: "Error", description: "Failed to delete answer paper.", status: "error" });
    }
  };

  const handleBulkAssign = async (e) => {
    e.preventDefault();
    setIsAssigning(true);
    try {
      const papersToAssign = groupedPapers[selectedGroup].filter(paper => !paper.teacherEmail);
      if (papersToAssign.length === 0) {
        addToast({ title: "Info", description: "All papers in this group are already assigned.", status: "info" });
        setOpenAssignDialog(false);
        return;
      }
      
      let successCount = 0;
      for (const paper of papersToAssign) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/answerpaper/assign/${paper._id}`,
          { teacherEmail: bulkTeacherEmail },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        successCount++;
      }
      addToast({ title: "Success", description: `Assigned ${successCount} papers to ${bulkTeacherEmail}.`, status: "success" });
      setOpenAssignDialog(false);
      setBulkTeacherEmail("");
      fetchAnswerPapers();
    } catch (error) {
      console.error("Error bulk assigning answer papers", error);
      addToast({ title: "Error", description: "Bulk assignment failed.", status: "error" });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSingleAssign = async (e) => {
    e.preventDefault();
    if (!selectedPaper || !singleTeacherEmail) return;
    setIsAssigning(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/answerpaper/assign/${selectedPaper._id}`,
        { teacherEmail: singleTeacherEmail },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      addToast({ title: "Assigned", description: "Paper assigned successfully.", status: "success" });
      setOpenSingleAssignDialog(false);
      setSingleTeacherEmail("");
      fetchAnswerPapers();
    } catch (error) {
      console.error("Error assigning paper", error);
      addToast({ title: "Error", description: "Failed to assign paper.", status: "error" });
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Evaluated": return "text-[--color-accent-green] bg-[--color-accent-green]/10 border-[--color-accent-green]/20";
      case "Pending": return "text-[--color-accent-orange] bg-[--color-accent-orange]/10 border-[--color-accent-orange]/20";
      case "Under_Review": return "text-[--color-accent-violet] bg-[--color-accent-violet]/10 border-[--color-accent-violet]/20";
      default: return "text-[--color-accent-red] bg-[--color-accent-red]/10 border-[--color-accent-red]/20";
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />
      
      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[--color-border-default]">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                onClick={() => selectedGroup ? setSelectedGroup(null) : navigate("/adminDashboard")}
                className="p-2"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold mb-1">
                {selectedGroup ? `Papers in ${selectedGroup}` : "All Answer Papers"}
              </h1>
              <p className="text-[--color-text-secondary]">
                {selectedGroup ? "Assign or review papers in this group" : "Manage uploaded student answer sheets"}
              </p>
            </div>
          </div>

          {!selectedGroup && (
            <div className="flex items-center gap-2 bg-[--color-bg-card] p-1.5 rounded-lg border border-[--color-border-default]">
              <div className="p-2 text-[--color-text-muted]"><FiFilter className="w-4 h-4" /></div>
              <select
                value={sortCriteria}
                onChange={(e) => {
                  setSortCriteria(e.target.value);
                  setSelectedGroup(null);
                }}
                className="bg-transparent text-sm font-medium text-[--color-text-primary] px-2 py-1 focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="section">Group by Section</option>
                <option value="exam">Group by Exam type</option>
                <option value="status">Group by Status</option>
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
          </div>
        ) : !selectedGroup ? (
          /* View: Groups */
          Object.keys(groupedPapers).length === 0 ? (
             <div className="text-center py-20 border border-[--color-border-default] rounded-[--radius-large] bg-[--color-bg-card]">
                <FiFileText className="w-12 h-12 text-[--color-text-muted] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[--color-text-primary] mb-2">No Papers Found</h3>
                <p className="text-[--color-text-secondary]">Upload answer papers from the Admin Dashboard.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.keys(groupedPapers).map((group) => (
                <GlassCard 
                  key={group}
                  className="cursor-pointer group hover:border-[--color-accent-blue]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center p-8"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="w-16 h-16 rounded-full bg-[--color-bg-elevated] border border-[--color-border-default] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiFileText className="w-8 h-8 text-[--color-accent-blue]" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-[--color-text-primary] mb-2">
                    {group}
                  </h3>
                  <span className="text-xs font-medium uppercase tracking-wider text-[--color-text-muted] mb-1">
                    {sortCriteria}
                  </span>
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-[--color-bg-elevated] text-sm text-[--color-text-secondary] border border-[--color-border-default]">
                    <span className="font-bold text-[--color-text-primary]">{groupedPapers[group].length}</span> Papers
                  </div>
                </GlassCard>
              ))}
            </div>
          )
        ) : (
          /* View: Papers within selected group */
          <>
            <div className="flex justify-end mb-6">
              <Button onClick={() => setOpenAssignDialog(true)} icon={FiUserCheck} variant="secondary">
                Bulk Assign Group to Teacher
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPapers[selectedGroup].map((paper) => (
                <GlassCard key={paper._id} className="relative group flex flex-col h-full">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setSelectedPaper(paper); setOpenSingleAssignDialog(true); }}
                      className="p-2 text-[--color-text-muted] hover:text-[--color-accent-blue] hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Assign to Teacher"
                    >
                      <FiUserCheck className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAnswerPaper(paper._id)}
                      className="p-2 text-[--color-text-muted] hover:text-[--color-accent-red] hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Paper"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4 pr-16 bg">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide border mb-3 ${getStatusColor(paper.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {paper.status || "Unknown"}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-[--color-text-primary] truncate" title={paper.student?.email}>
                      {paper.student?.email || "Unknown Student"}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-6 flex-1 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-[--color-border-default]/30">
                      <span className="text-[--color-text-muted]">Subject</span>
                      <span className="font-medium text-right line-clamp-1 max-w-[60%]">{paper.subject?.subjectname || "None"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[--color-border-default]/30">
                      <span className="text-[--color-text-muted]">Exam</span>
                      <span className="font-medium">{paper.exam?.examType || "None"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[--color-border-default]/30">
                      <span className="text-[--color-text-muted]">Assigned To</span>
                      <span className={`font-medium ${paper.teacherEmail ? 'text-[--color-text-primary]' : 'text-[--color-accent-orange] italic'}`}>
                        {paper.teacherEmail || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <Link to={`/answer-paper/${paper._id}`} className="mt-auto block">
                    <Button fullWidth variant="ghost" className="border border-[--color-border-default]">
                      Select Paper
                    </Button>
                  </Link>
                </GlassCard>
              ))}
            </div>
          </>
        )}
      </AnimatedPage>

      {/* Reusable Modal Component using Framer Motion (can abstract this later if needed) */}
      <AnimatePresence>
        {(openAssignDialog || openSingleAssignDialog) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setOpenAssignDialog(false); setOpenSingleAssignDialog(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[--color-bg-elevated] rounded-[--radius-large] border border-[--color-border-bright] shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-[--color-border-default]">
                <h3 className="text-xl font-heading font-semibold text-[--color-text-primary]">
                  {openAssignDialog ? `Bulk Assign: ${selectedGroup}` : 'Assign Paper'}
                </h3>
                <button 
                  onClick={() => { setOpenAssignDialog(false); setOpenSingleAssignDialog(false); }}
                  className="p-2 text-[--color-text-muted] hover:text-[--color-text-primary] hover:bg-[--color-bg-card] rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={openAssignDialog ? handleBulkAssign : handleSingleAssign} className="p-6 space-y-4">
                <p className="text-sm text-[--color-text-secondary] mb-4">
                  {openAssignDialog 
                    ? `Assign all unassigned papers in this group to a specific teacher's email address.` 
                    : `Assign this paper from ${selectedPaper?.student?.email} to a teacher.`}
                </p>

                <Input
                  label="Teacher Email Address"
                  type="email"
                  value={openAssignDialog ? bulkTeacherEmail : singleTeacherEmail}
                  onChange={(e) => openAssignDialog ? setBulkTeacherEmail(e.target.value) : setSingleTeacherEmail(e.target.value)}
                  placeholder="teacher@example.com"
                  required
                  autoFocus
                />

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => { setOpenAssignDialog(false); setOpenSingleAssignDialog(false); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isAssigning} className="flex-1">
                    Confirm Assign
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

export default AllAnswerPapers;