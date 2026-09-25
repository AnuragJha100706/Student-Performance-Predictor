import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const Button = ({ children, onClick, variant = 'primary', className = '', loading = false, icon: Icon, ...props }) => {
  const baseStyle = "relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2 overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:shadow-lg hover:shadow-purple-500/30 focus:ring-purple-500 btn-shine",
    secondary: "bg-gradient-to-r from-cyan-500 to-teal-400 text-white hover:shadow-lg hover:shadow-cyan-500/30 focus:ring-cyan-500 btn-shine",
    success: "bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:shadow-lg hover:shadow-emerald-500/30 focus:ring-emerald-500 btn-shine",
    danger: "bg-gradient-to-r from-red-500 to-rose-400 text-white hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500 btn-shine",
    outline: "border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:ring-purple-500 dark:text-purple-400",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
    glass: "glass text-gray-800 dark:text-white hover:shadow-lg border border-white/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export const Input = ({ label, error, icon: Icon, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-3 border-2 rounded-xl shadow-sm 
          bg-white dark:bg-dark-card
          border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20
          transition-all duration-300
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}`}
        {...props}
      />
    </div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-sm text-red-500 flex items-center gap-1"
      >
        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </motion.p>
    )}
  </div>
);

export const Card = ({ children, className = '', gradient = false, hover = true, glow = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
    className={`
      relative rounded-2xl p-6 
      ${gradient 
        ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-500/20' 
        : 'bg-white dark:bg-dark-card'
      }
      ${hover ? 'hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20' : ''}
      ${glow ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20' : 'shadow-lg shadow-gray-200/50 dark:shadow-none'}
      border border-gray-100 dark:border-gray-800
      transition-all duration-300
      dark:text-white
      ${className}
    `}
  >
    {children}
  </motion.div>
);

export const GlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className={`
      glass rounded-2xl p-6 
      backdrop-blur-xl
      border border-white/20 dark:border-white/10
      shadow-xl shadow-purple-500/10
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </motion.div>
);

export const GradientCard = ({ children, className = '', colors = 'from-purple-500 via-pink-500 to-orange-500' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className={`relative p-[2px] rounded-2xl bg-gradient-to-r ${colors} ${className}`}
  >
    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 h-full">
      {children}
    </div>
  </motion.div>
);

export const PageWrapper = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className={`container mx-auto px-4 py-8 ${className}`}
  >
    {children}
  </motion.div>
);

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const StatCard = ({ icon: Icon, label, value, trend, trendUp, color = 'purple' }) => {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-rose-500',
    cyan: 'from-cyan-500 to-teal-500',
    emerald: 'from-emerald-500 to-green-500',
    orange: 'from-orange-500 to-amber-500',
    blue: 'from-blue-500 to-indigo-500',
  };

  const bgColors = {
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
  };

  const iconColors = {
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    orange: 'text-orange-600 dark:text-orange-400',
    blue: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <Card className={`border-l-4 border-l-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${bgColors[color]}`}>
          <Icon className={`w-8 h-8 ${iconColors[color]}`} />
        </div>
      </div>
    </Card>
  );
};

export const SectionTitle = ({ children, subtitle, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        {Icon && (
          <span className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Icon className="w-5 h-5 text-white" />
          </span>
        )}
        {children}
      </h2>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
    {action && action}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-4">
      <Icon className="w-8 h-8 text-purple-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">{description}</p>
    {action}
  </motion.div>
);

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-purple-200 dark:border-purple-800"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"></div>
    </div>
  );
};

export const Sparkle = ({ className = '' }) => (
  <Sparkles className={`w-4 h-4 text-yellow-400 animate-pulse ${className}`} />
);
