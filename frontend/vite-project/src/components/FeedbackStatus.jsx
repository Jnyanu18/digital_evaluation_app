import React from 'react';
import { GlassCard } from './ui/Card';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

const FeedbackStatus = ({ data }) => {
  if (!data) return null;

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="mb-6 pb-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-heading font-semibold text-[--color-text-primary]">
          Feedback Overview
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[--color-accent-orange]/10 border border-[--color-accent-orange]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center w-full"
        >
          <FiClock className="w-8 h-8 text-[--color-accent-orange] mb-3" />
          <span className="text-3xl font-heading font-bold text-[--color-accent-orange] mb-1">
            {data.Pending || 0}
          </span>
          <span className="text-sm font-medium text-[--color-text-secondary]">Pending</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-[--color-accent-green]/10 border border-[--color-accent-green]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center w-full"
        >
          <FiCheckCircle className="w-8 h-8 text-[--color-accent-green] mb-3" />
          <span className="text-3xl font-heading font-bold text-[--color-accent-green] mb-1">
            {data.Resolved || 0}
          </span>
          <span className="text-sm font-medium text-[--color-text-secondary]">Resolved</span>
        </motion.div>
      </div>
    </GlassCard>
  );
};

export default FeedbackStatus;