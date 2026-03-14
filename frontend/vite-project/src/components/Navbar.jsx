import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ role, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/adminDashboard' },
          { name: 'Exams', path: '/admin/examView' },
          { name: 'Question Papers', path: '/all/QuestionPaper' },
          { name: 'Answer Papers', path: '/all/AnswerPapers' },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', path: '/teacherDashboard' },
          { name: 'Assigned', path: '/teacher/assigned-papers' },
          { name: 'Pending', path: '/teacher/pending-papers' },
          { name: 'Evaluated', path: '/teacher/checked-papers' },
        ];
      case 'student':
        return [
          { name: 'Dashboard', path: '/studentDashboard' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[--color-border-default] shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={`/${role}Dashboard`} className="flex items-center gap-3 group hover-lift">
          <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <span className="text-white font-bold font-heading text-lg">D</span>
          </div>
          <span className="text-white font-heading font-bold text-xl tracking-tight hidden sm:block">
            DigitalEval
          </span>
        </Link>

        {/* Center Links */}
        {role && (
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-[#4f8fff]/10 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Section */}
        {role && user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-[--color-border-default]">
               <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white font-semibold text-sm shadow-inner shadow-white/20">
                 {initial}
               </div>
               <span className="text-sm font-medium text-zinc-300 hidden sm:block">{user.name}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-[--color-accent-red] hover:bg-[--color-accent-red]/10 rounded-lg transition-colors focus-ring-custom"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             {/* Fallback for unauthenticated state if Navbar is rendered there */}
             <Link to="/admin/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Admin</Link>
             <Link to="/teacher/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Teacher</Link>
             <Link to="/student/login" className="text-sm text-[--color-accent-blue] font-medium hover:text-blue-400 transition-colors">Student</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;