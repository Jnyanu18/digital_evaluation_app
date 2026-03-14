import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = "No Data Found",
  message = "There's nothing to display here yet.",
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-12 text-center bg-[--color-bg-card] border border-[--color-border-default] rounded-[--radius-large] shadow-inner ${className}`}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-[--color-bg-elevated] border border-[--color-border-bright] flex items-center justify-center text-[--color-text-muted]">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-[--color-text-primary] mb-2">{title}</h3>
      <p className="text-[--color-text-secondary] max-w-sm mb-6">{message}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-[#4f8fff]/10 text-[--color-accent-blue] hover:bg-[#4f8fff]/20 rounded-full font-medium transition-colors focus-ring-custom"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
