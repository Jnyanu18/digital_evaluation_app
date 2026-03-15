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
    <header className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-500 pointer-events-none ${scrolled ? 'pt-4' : 'pt-0'}`}>
      <div 
        className={`pointer-events-auto transition-all duration-500 flex items-center justify-between ${
          scrolled 
            ? 'w-[95%] max-w-7xl h-14 px-6 bg-[rgba(20,20,30,0.65)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
            : 'w-full max-w-7xl h-16 px-6 bg-gradient-to-b from-[rgba(10,10,15,0.8)] to-transparent border border-transparent'
        }`}
      >
        {/* Logo */}
        <Link to={`/${role}Dashboard`} className="flex items-center gap-3 group hover-lift shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <span className="text-white font-bold font-heading text-lg leading-none mt-[2px]">D</span>
          </div>
          <span className="text-white font-heading font-bold text-xl tracking-tight hidden sm:block">
            DigitalEval
          </span>
        </Link>

        {/* Center Links */}
        {role && (
          <nav className="hidden md:flex items-center gap-1 mx-4">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full border border-white/10"
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
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 pl-4 border-l border-[rgba(255,255,255,0.1)]">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-white/10 border border-white/5">
                 {initial}
               </div>
               <span className="text-sm font-medium text-zinc-300 hidden lg:block tracking-wide">{user.name}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-[--color-accent-red] hover:bg-red-500/10 rounded-full transition-all focus-ring-custom hover:rotate-12"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 shrink-0">
             {/* Fallback for unauthenticated state if Navbar is rendered there */}
             <Link to="/admin/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Admin</Link>
             <Link to="/teacher/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Teacher</Link>
             <Link to="/student/login" className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full font-medium transition-colors border border-white/5">Student</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;