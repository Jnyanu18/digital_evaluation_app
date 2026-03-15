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
      
      {/* Dynamic Background mesh & Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"></div>
      
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }}></div>

      <AnimatedPage className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-20 z-10 relative">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mb-20">
           <motion.div
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] mb-8 text-sm font-semibold text-zinc-300 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]"
           >
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Digital Evaluation Platform Active
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
             className="text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-8 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-sm"
           >
             Next-Gen <br className="hidden md:block"/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
               Evaluation
             </span> System
           </motion.h1>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
             className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium"
           >
             Experience an ultra-modern workspace for academic assessments. Leverage real-time analytics and seamless workflows constructed for students, teachers, and admins.
           </motion.p>
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
