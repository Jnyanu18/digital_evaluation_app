import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiBookOpen, FiShield } from "react-icons/fi";
import { GlassCard } from "../components/ui/Card";
import AnimatedPage from "../components/AnimatedPage";
import { motion } from "framer-motion";

const LandingPage = () => {
  const roles = [
    {
      title: "Student Portal",
      description: "Access your exams, view subjects, and review evaluated answer sheets.",
      icon: <FiUser className="w-8 h-8" />,
      loginPath: "/student/login",
      signupPath: "/student/signup",
      color: "text-[--color-accent-blue]",
      bg: "bg-[--color-accent-blue]/10",
      border: "border-[--color-accent-blue]/20",
      hoverRing: "group-hover:ring-[--color-accent-blue]/30"
    },
    {
      title: "Teacher Portal",
      description: "Manage assigned papers, evaluate student submissions, and update marks.",
      icon: <FiBookOpen className="w-8 h-8" />,
      loginPath: "/teacher/login",
      signupPath: "/teacher/signup",
      color: "text-[--color-accent-orange]",
      bg: "bg-[--color-accent-orange]/10",
      border: "border-[--color-accent-orange]/20",
      hoverRing: "group-hover:ring-[--color-accent-orange]/30"
    },
    {
      title: "Administrator",
      description: "Oversee the platform, manage exams, and analyze evaluation metrics.",
      icon: <FiShield className="w-8 h-8" />,
      loginPath: "/admin/login",
      signupPath: "/admin/signup",
      color: "text-[--color-accent-violet]",
      bg: "bg-[--color-accent-violet]/10",
      border: "border-[--color-accent-violet]/20",
      hoverRing: "group-hover:ring-[--color-accent-violet]/30"
    }
  ];

  return (
    <div className="min-h-screen bg-[--color-bg-primary] text-[--color-text-primary] flex flex-col relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[--color-accent-blue] opacity-5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[--color-accent-violet] opacity-5 rounded-full blur-[120px] pointer-events-none"></div>

      <AnimatedPage className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-20 z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mb-16">
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[--color-bg-elevated] border border-[--color-border-default] mb-6 text-sm font-medium text-[--color-text-secondary]"
           >
              <span className="w-2 h-2 rounded-full bg-[--color-accent-green] animate-pulse"></span>
              Platform Active
           </motion.div>
           <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 leading-tight tracking-tight">
             Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--color-accent-blue] to-[--color-accent-violet]">Evaluation</span> System
           </h1>
           <p className="text-lg md:text-xl text-[--color-text-secondary] leading-relaxed max-w-2xl mx-auto">
             A modern, streamlined platform for academic assessments. Select your role to securely log in or register a new account.
           </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {roles.map((role, index) => (
            <motion.div 
               key={index}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
            >
               <GlassCard className={`group h-full flex flex-col items-center text-center p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/50 border-[--color-border-bright] hover:border-[--color-border-bright]`}>
                  <div className={`p-4 rounded-2xl mb-6 ${role.bg} ${role.color} border ${role.border} ring-4 ring-transparent transition-all duration-500 ${role.hoverRing} group-hover:scale-110`}>
                     {role.icon}
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-3 text-[--color-text-primary]">
                     {role.title}
                  </h2>
                  <p className="text-[--color-text-secondary] mb-8 leading-relaxed flex-1">
                     {role.description}
                  </p>
                  
                  <div className="flex flex-col w-full gap-3 mt-auto">
                     <Link to={role.loginPath} className="w-full">
                        <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${role.bg} ${role.color} hover:bg-opacity-20 flex items-center justify-center gap-2`}>
                           Log In
                        </button>
                     </Link>
                     <Link to={role.signupPath} className="w-full">
                        <button className="w-full py-3 rounded-lg font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] bg-transparent hover:bg-[--color-bg-elevated] transition-all duration-300">
                           Create Account
                        </button>
                     </Link>
                  </div>
               </GlassCard>
            </motion.div>
          ))}
        </div>

      </AnimatedPage>
    </div>
  );
};

export default LandingPage;
