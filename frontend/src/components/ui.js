import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
    secondary: "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">{label}</label>}
    <input
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-dark-bg dark:border-dark-lighter dark:text-dark-text-primary ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-dark-card rounded-lg shadow-md p-6 dark:text-dark-text-primary ${className}`}
  >
    {children}
  </motion.div>
);

export const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className="container mx-auto px-4 py-8"
  >
    {children}
  </motion.div>
);
