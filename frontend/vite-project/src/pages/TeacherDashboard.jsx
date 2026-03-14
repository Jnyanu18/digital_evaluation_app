import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiClock, FiFileText, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import { GlassCard } from '../components/ui/Card';
import WeeklyChart from '../components/WeeklyChart';
import TodaysAssignedPapers from '../components/TodayAssignedPapers';
import { useToast } from '../hooks/useToast';

// Helper component for the completion ring
const CompletionRing = ({ evaluated, total, size = 160, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = total > 0 ? (evaluated / total) * 100 : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-bg-elevated)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-accent-blue)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{ strokeDasharray: circumference }}
          className="drop-shadow-[0_0_8px_var(--color-accent-blue)]"
        />
      </svg>
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-heading font-bold text-[--color-text-primary]">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs font-medium text-[--color-text-secondary] uppercase tracking-wider mt-1">
          Completed
        </span>
      </div>
    </div>
  );
};

const StatTile = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <GlassCard padding="p-5 flex items-center gap-4 group">
      <div className={`p-4 rounded-xl ${colorClass.bg} ${colorClass.text} transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-[--color-text-secondary] mb-1">{title}</p>
        <h4 className="text-2xl font-heading font-bold text-[--color-text-primary] leading-none">
          {value}
        </h4>
      </div>
    </GlassCard>
  </motion.div>
);


const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/teacher/dashboard`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        addToast({ title: "Error", description: "Failed to load dashboard data.", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [addToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[--color-accent-blue]/20 border-t-[--color-accent-blue] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallbacks if data is missing or structured differently
  const stats = dashboardData || {
    totalAssignedPapers: 0,
    evaluatedPapers: 0,
    pendingPapers: 0,
    underReviewPapers: 0,
    weeklyData: [],
    todaysAssignedPapers: []
  };

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] pb-12">
      <Navbar />

      <AnimatedPage className="container mx-auto px-4 pt-32 max-w-7xl">
        <div className="mb-8 border-b border-[--color-border-default] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Teacher Workspace</h1>
            <p className="text-[--color-text-secondary]">Manage, evaluate, and track your assigned student papers.</p>
          </div>
        </div>

        {/* Top Row: Quick Stats & Completion Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Main Progress Card (Spans 1 col on large screens) */}
          <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center text-center py-8">
             <h3 className="text-lg font-medium text-[--color-text-primary] mb-8 w-full text-left pl-2">
                Overall Progress
             </h3>
             <CompletionRing 
               evaluated={stats.evaluatedPapers} 
               total={stats.totalAssignedPapers} 
             />
             <div className="mt-8 flex gap-6 text-sm">
                <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1.5 text-[--color-text-secondary] mb-1">
                      <span className="w-2 h-2 rounded-full bg-[--color-border-default]"></span> Total
                   </div>
                   <span className="font-semibold text-lg">{stats.totalAssignedPapers}</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1.5 text-[--color-accent-blue] mb-1">
                      <span className="w-2 h-2 rounded-full bg-[--color-accent-blue]"></span> Done
                   </div>
                   <span className="font-semibold text-lg">{stats.evaluatedPapers}</span>
                </div>
             </div>
          </GlassCard>

          {/* Stat Tiles (Spans 3 cols on large screens via grid inside div) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 h-fit content-start">
             <StatTile 
               title="Pending Evaluation" 
               value={stats.pendingPapers} 
               icon={FiClock} 
               colorClass={{ bg: 'bg-[--color-accent-orange]/10', text: 'text-[--color-accent-orange]' }}
               delay={0.1}
             />
             <StatTile 
               title="Under Review" 
               value={stats.underReviewPapers} 
               icon={FiFileText} 
               colorClass={{ bg: 'bg-[--color-accent-violet]/10', text: 'text-[--color-accent-violet]' }}
               delay={0.2}
             />
             <StatTile 
               title="Evaluated Papers" 
               value={stats.evaluatedPapers} 
               icon={FiCheckCircle} 
               colorClass={{ bg: 'bg-[--color-accent-green]/10', text: 'text-[--color-accent-green]' }}
               delay={0.3}
             />
             <StatTile 
               title="Total Assigned" 
               value={stats.totalAssignedPapers} 
               icon={FiAward} 
               colorClass={{ bg: 'bg-[--color-accent-blue]/10', text: 'text-[--color-accent-blue]' }}
               delay={0.4}
             />
          </div>
        </div>

        {/* Bottom Row: Charts & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyChart data={stats.weeklyData} />
          </div>
          <div className="lg:col-span-1">
            <TodaysAssignedPapers data={stats.todaysAssignedPapers} />
          </div>
        </div>

      </AnimatedPage>
    </div>
  );
};

export default TeacherDashboard;