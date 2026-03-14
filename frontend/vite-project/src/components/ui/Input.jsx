import React, { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[--color-text-secondary] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[--color-text-muted]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[--color-bg-elevated] border 
            ${error ? 'border-[--color-accent-red]' : 'border-[--color-border-default]'} 
            rounded-[--radius-standard] px-4 py-2.5 
            text-[--color-text-primary] placeholder-[--color-text-muted]
            focus-ring-custom transition-all shadow-sm
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[--color-accent-red] animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
