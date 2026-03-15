import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, padding = 'p-6', ...props }) => {
  return (
    <motion.div
      className={`bg-[--color-bg-card] border border-[--color-border-default] rounded-[--radius-large] shadow-lg ${padding} ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const GlassCard = ({ children, className = '', hover = false, padding = 'p-6', ...props }) => {
  return (
    <motion.div
      className={`glass-panel relative overflow-hidden rounded-[--radius-large] shadow-xl ${padding} ${hover ? 'hover-lift' : ''} ${className} border border-[rgba(255,255,255,0.08)] bg-[rgba(25,25,35,0.4)] backdrop-blur-2xl before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(255,255,255,0.05)] before:to-transparent before:pointer-events-none`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.02)] to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none duration-1000" />
      {children}
    </motion.div>
  );
};
