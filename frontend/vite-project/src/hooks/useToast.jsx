import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, status = 'info', duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, status }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onRemove }) => {
  const { title, description, status } = toast;

  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const statusStyles = {
    success: { border: 'border-l-[--color-accent-green]', icon: <FiCheckCircle className="text-[--color-accent-green] w-5 h-5" /> },
    error: { border: 'border-l-[--color-accent-red]', icon: <FiAlertCircle className="text-[--color-accent-red] w-5 h-5" /> },
    info: { border: 'border-l-[--color-accent-blue]', icon: <FiInfo className="text-[--color-accent-blue] w-5 h-5" /> },
  };

  const { border, icon } = statusStyles[status] || statusStyles.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`glass-panel border-l-4 ${border} p-4 rounded-xl shadow-xl flex items-start gap-3 w-80 pointer-events-auto`}
    >
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[--color-text-primary] font-semibold text-sm">{title}</h4>
        {description && <p className="text-[--color-text-secondary] text-xs mt-1 truncate">{description}</p>}
      </div>
      <button
        onClick={onRemove}
        className="text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors flex-shrink-0 focus-ring-custom rounded-md p-1 -m-1"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
