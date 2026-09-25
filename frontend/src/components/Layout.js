import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Home, Database, Brain, Activity, History as HistoryIcon, BarChart2, Sun, Moon, Sparkles } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 text-purple-600 dark:text-purple-400 shadow-sm' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Icon className={`w-4 h-4 mr-2 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-500' : ''}`} />
        {children}
        {isActive && (
          <motion.div 
            layoutId="activeNav"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg transition-colors duration-500">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-80 h-80 bg-orange-300 dark:bg-orange-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-dark-card/70 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <div className="relative">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                    StudentPredictor
                  </span>
                  <Sparkles className="absolute -top-1 -right-4 w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </Link>
              {user && (
                <div className="hidden lg:ml-8 lg:flex lg:space-x-2 items-center">
                  <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
                  <NavLink to="/dataset" icon={Database}>Datasets</NavLink>
                  <NavLink to="/training" icon={Brain}>Training</NavLink>
                  <NavLink to="/comparison" icon={BarChart2}>Compare</NavLink>
                  <NavLink to="/prediction" icon={Activity}>Predict</NavLink>
                  <NavLink to="/history" icon={HistoryIcon}>History</NavLink>
                </div>
              )}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              </motion.button>
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="pt-2 pb-4 space-y-1 px-4">
                {user ? (
                  <>
                    <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
                    <NavLink to="/dataset" icon={Database}>Datasets</NavLink>
                    <NavLink to="/training" icon={Brain}>Training</NavLink>
                    <NavLink to="/comparison" icon={BarChart2}>Compare</NavLink>
                    <NavLink to="/prediction" icon={Activity}>Predict</NavLink>
                    <NavLink to="/history" icon={HistoryIcon}>History</NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2.5 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link to="/login" className="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-center">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className="relative">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">StudentPredictor</span>. Built with ❤️ for better education.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
