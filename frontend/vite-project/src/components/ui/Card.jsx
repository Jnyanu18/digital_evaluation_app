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
      className={`glass-panel border border-[--color-border-bright] rounded-[--radius-large] shadow-xl ${padding} ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
