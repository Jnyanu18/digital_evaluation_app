import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FiUsers, FiFileText, FiMessageSquare, FiBookOpen } from 'react-icons/fi';
import { GlassCard } from './ui/Card';

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) {
        setCount(end);
        return;
    }

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * (end - start) + start));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

const StatCardItem = ({ title, value, colorClass, icon: Icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group h-full"
    >
      <GlassCard 
        padding="p-6" 
        className="h-full relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[--color-border-bright]"
      >
        {/* Radial Glow */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`} />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-[--color-text-secondary] font-medium text-sm pr-4 line-clamp-2">
            {title}
          </h3>
          <div className={`p-2 rounded-lg bg-[--color-bg-elevated] border border-[--color-border-default] group-hover:border-[--color-border-bright] transition-all`}>
            <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
        </div>
        
        <div className="relative z-10">
          <span className={`text-4xl font-heading font-bold tracking-tight ${colorClass.replace('bg-', 'text-')}`}>
            <AnimatedCounter value={value} />
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const StatCard = ({ data }) => {
  if (!data) return null;

  const stats = [
    { title: 'Total Teachers', value: data.totalTeachers, colorClass: 'bg-[--color-accent-blue]', icon: FiUsers },
    { title: 'Total Students', value: data.totalStudents, colorClass: 'bg-[--color-accent-orange]', icon: FiUsers },
    { title: 'Answer Papers', value: data.totalAnswerPapers, colorClass: 'bg-[--color-accent-green]', icon: FiFileText },
    { title: 'Question Papers', value: data.totalQuestionPapers, colorClass: 'bg-[--color-accent-violet]', icon: FiFileText },
    { title: 'Total Feedback', value: data.totalFeedbacks, colorClass: 'bg-[--color-accent-red]', icon: FiMessageSquare },
    { title: 'Total Exams', value: data.totalExams, colorClass: 'bg-[--color-accent-yellow]', icon: FiBookOpen },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCardItem
          key={index}
          title={stat.title}
          value={stat.value}
          colorClass={stat.colorClass}
          icon={stat.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default StatCard;