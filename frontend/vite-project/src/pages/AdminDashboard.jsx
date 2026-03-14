import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus, FiUploadCloud, FiFileText, FiList } from "react-icons/fi";
import Navbar from "../components/Navbar";
import AnswerPapersStatus from "../components/AnswerPaperStatus";
import FeedbackStatus from "../components/FeedbackStatus";
import StatCard from "../components/StatCard";
import QuestionPaperForm from "../components/QuestionPaperForm";
import AnswerPaperForm from "../components/AnswerPaperForm";
import AnimatedPage from "../components/AnimatedPage";
import { GlassCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [openQPaperForm, setOpenQPaperForm] = useState(false);
  const [openAPaperForm, setOpenAPaperForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />
      
      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="mb-8 border-b border-[--color-border-default] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
            <p className="text-[--color-text-secondary]">Monitor system statistics and manage evaluation workflows.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8">
          <StatCard data={dashboardData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area - Status Panels */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <AnswerPapersStatus data={dashboardData?.answerPapersStatus} />
              <FeedbackStatus data={dashboardData?.feedbackMessagesStatus} />
            </div>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <GlassCard className="h-full">
              <div className="mb-6 pb-4 border-b border-[--color-border-default]">
                <h3 className="text-lg font-heading font-semibold">Quick Actions</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[--color-bg-elevated] border border-[--color-border-default] hover:border-[--color-accent-blue]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[--color-accent-blue]/10 text-[--color-accent-blue]">
                      <FiPlus className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Question Paper</h4>
                      <p className="text-xs text-[--color-text-muted] mb-3">Create and distribute a new examination</p>
                      <Button size="sm" onClick={() => setOpenQPaperForm(true)} fullWidth>Create New</Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[--color-bg-elevated] border border-[--color-border-default] hover:border-[--color-accent-green]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[--color-accent-green]/10 text-[--color-accent-green]">
                      <FiUploadCloud className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Answer Paper</h4>
                      <p className="text-xs text-[--color-text-muted] mb-3">Upload scanned papers for evaluation</p>
                      <Button size="sm" variant="secondary" onClick={() => setOpenAPaperForm(true)} fullWidth>Upload Papers</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[--color-border-default] grid grid-cols-2 gap-3">
                  <Link to="/all/Questionpaper" className="block">
                    <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-4 gap-2 border border-[--color-border-default] hover:border-[--color-accent-violet]/50 hover:bg-[--color-accent-violet]/5">
                      <FiFileText className="w-5 h-5 text-[--color-accent-violet]" />
                      <span className="text-xs">View Questions</span>
                    </Button>
                  </Link>
                  <Link to="/all/Answerpapers" className="block">
                    <Button variant="ghost" size="sm" className="w-full flex-col h-auto py-4 gap-2 border border-[--color-border-default] hover:border-[--color-accent-orange]/50 hover:bg-[--color-accent-orange]/5">
                      <FiList className="w-5 h-5 text-[--color-accent-orange]" />
                      <span className="text-xs">View Answers</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </AnimatedPage>

      {/* Modals */}
      <QuestionPaperForm
        open={openQPaperForm}
        handleClose={() => setOpenQPaperForm(false)}
        fetchQuestionPapers={() => {}}
      />
      
      <AnswerPaperForm
        open={openAPaperForm}
        handleClose={() => setOpenAPaperForm(false)}
      />
    </div>
  );
};

export default AdminDashboard;
