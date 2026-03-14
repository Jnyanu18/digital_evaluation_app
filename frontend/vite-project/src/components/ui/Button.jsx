import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md', // sm, md, lg
  isLoading = false,
  className = '',
  icon: Icon,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus-ring-custom rounded-full active:scale-95';
  
  const variants = {
    primary: 'bg-primary-gradient text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:opacity-90',
    secondary: 'bg-[--color-bg-elevated] text-[--color-text-primary] border border-[--color-border-bright] hover:bg-[--color-border-default]',
    ghost: 'bg-transparent text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg-elevated]',
    danger: 'bg-[--color-accent-red]/10 text-[--color-accent-red] hover:bg-[--color-accent-red]/20',
  };

  const sizes = {
    sm: 'text-sm px-4 py-1.5',
    md: 'text-sm px-6 py-2.5',
    lg: 'text-base px-8 py-3',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className={`-ml-1 mr-2 ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}`} />
      ) : null}
      {children}
    </motion.button>
  );
};
