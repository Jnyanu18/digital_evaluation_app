import React from 'react';
import { motion } from 'framer-motion';

const AnimatedPage = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`min-h-screen w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
