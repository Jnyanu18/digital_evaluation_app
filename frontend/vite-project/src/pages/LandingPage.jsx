import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiBookOpen, FiShield, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useToast } from "../hooks/useToast";
import { StudentDataContext } from "../context/StudentContext";
import { TeacherDataContext } from "../context/TeacherContext";
import { AdminDataContext } from "../context/AdminContext";
import { GlassCard } from "../components/ui/Card";
import AnimatedPage from "../components/AnimatedPage";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const addToast = useToast();
  const [loadingRole, setLoadingRole] = useState(null);

  const { setStudent } = useContext(StudentDataContext);
  const { setTeacher } = useContext(TeacherDataContext);
  const { setAdmin } = useContext(AdminDataContext);

  const roles = [
    {
      title: "Student Portal",
      description: "Access your exams, view subjects, and review evaluated answer sheets.",
      icon: <FiUser className="w-8 h-8" />,
      loginPath: "/student/login",
      demoUrl: "/student/login",
      demoEmail: "student@demo.com",
      demoPass: "student123",
      dashboardPath: "/studentDashboard",
      contextSetter: setStudent,
      contextField: "student",
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
      demoUrl: "/teacher/login",
      demoEmail: "teacher@demo.com",
      demoPass: "teacher123",
      dashboardPath: "/teacherDashboard",
      contextSetter: setTeacher,
      contextField: "teacher",
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
      demoUrl: "/admin/login",
      demoEmail: "admin@demo.com",
      demoPass: "admin123",
      dashboardPath: "/adminDashboard",
      contextSetter: setAdmin,
      contextField: "admin",
      color: "text-[--color-accent-violet]",
      bg: "bg-[--color-accent-violet]/10",
      border: "border-[--color-accent-violet]/20",
      hoverRing: "group-hover:ring-[--color-accent-violet]/30"
    }
  ];

  const handleDemoLogin = async (role) => {
    setLoadingRole(role.title);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${role.demoUrl}`, {
        email: role.demoEmail,
        password: role.demoPass
      });

      if (response.status === 200) {
        const data = response.data;
        role.contextSetter(data[role.contextField]);
        localStorage.setItem("token", data.token);
        
        addToast({ 
          title: "Demo Active", 
          description: `Logged in as ${role.title} Demo.`, 
          status: "success" 
        });
        
        navigate(role.dashboardPath);
      }
    } catch (error) {
      console.error(`Demo login failed for ${role.title}:`, error);
      addToast({ 
        title: "Demo Login Failed", 
        description: "Please ensure the backend is running and you have run 'npm run seed'.", 
        status: "error" 
      });
    } finally {
      setLoadingRole(null);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-24">
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
                     <button 
                       onClick={() => handleDemoLogin(role)}
                       disabled={loadingRole !== null}
                       className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${role.bg} ${role.color} hover:bg-opacity-20 flex items-center justify-center gap-2`}
                     >
                        {loadingRole === role.title ? (
                          <div className="w-5 h-5 border-2 border-inherit border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Try Demo Account"
                        )}
                     </button>
                     <Link to={role.loginPath} className="w-full">
                        <button className="w-full py-3 rounded-lg font-medium text-[--color-text-secondary] hover:text-[--color-text-primary] bg-transparent hover:bg-[--color-bg-elevated] transition-all duration-300">
                           Manual Login
                        </button>
                     </Link>
                  </div>
               </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-5xl">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="text-center mb-12"
           >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How it Works</h2>
              <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
                Explore our fully functional end-to-end evaluation flow using the demo accounts. No signup required.
              </p>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Desktop connecting lines */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[--color-accent-violet]/0 via-[--color-accent-blue]/20 to-[--color-accent-violet]/0 -z-10"></div>
              
              <GlassCard className="p-6 relative">
                 <div className="w-10 h-10 rounded-full bg-[--color-accent-violet] text-white flex items-center justify-center font-bold absolute -top-5 -left-5 shadow-[0_0_20px_rgba(155,109,255,0.4)]">1</div>
                 <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2 text-[--color-accent-violet]">Admin Creates Exam</h3>
                 <p className="text-sm text-[--color-text-secondary] leading-relaxed">
                   Administrators organize exams, upload question papers containing total marks and specific parts, and assign Answer Sheets to Teachers securely.
                 </p>
              </GlassCard>
              
              <GlassCard className="p-6 relative">
                 <div className="w-10 h-10 rounded-full bg-[--color-accent-orange] text-white flex items-center justify-center font-bold absolute -top-5 -left-5 shadow-[0_0_20px_rgba(255,140,66,0.4)]">2</div>
                 <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2 text-[--color-accent-orange]">Teacher Evaluates</h3>
                 <p className="text-sm text-[--color-text-secondary] leading-relaxed">
                   Teachers log into their stunning Split-Screen Workspace, visualizing the student PDF Answer Sheet while directly grading questions side-by-side.
                 </p>
              </GlassCard>
              
              <GlassCard className="p-6 relative">
                 <div className="w-10 h-10 rounded-full bg-[--color-accent-blue] text-white flex items-center justify-center font-bold absolute -top-5 -left-5 shadow-[0_0_20px_rgba(79,143,255,0.4)]">3</div>
                 <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2 text-[--color-accent-blue]">Student Monitors</h3>
                 <p className="text-sm text-[--color-text-secondary] leading-relaxed">
                   Students track their results, identify their subject proficiencies using interactive gamified Radar Charts, and communicate feedback to evaluation reviewers.
                 </p>
              </GlassCard>
           </div>
        </div>

      </AnimatedPage>
    </div>
  );
};

export default LandingPage;
