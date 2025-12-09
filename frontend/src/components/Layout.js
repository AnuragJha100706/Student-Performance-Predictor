import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { LogOut, Menu, X, Home, Database, Brain, Activity, History as HistoryIcon, BarChart2, Sun, Moon } from 'lucide-react';

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
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-primary/10 text-primary dark:text-primary-light' 
            : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-lighter hover:text-gray-900 dark:hover:text-dark-text-primary'
        }`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      <nav className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary dark:text-primary-light">StudentPredictor</span>
              </Link>
              {user && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                  <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
                  <NavLink to="/dataset" icon={Database}>Datasets</NavLink>
                  <NavLink to="/training" icon={Brain}>Training</NavLink>
                  <NavLink to="/comparison" icon={BarChart2}>Compare</NavLink>
                  <NavLink to="/prediction" icon={Activity}>Predict</NavLink>
                  <NavLink to="/history" icon={HistoryIcon}>History</NavLink>
                </div>
              )}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-lighter focus:outline-none"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-lighter"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="text-gray-500 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary font-medium">Login</Link>
                  <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">Register</Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="sm:hidden bg-white dark:bg-dark-card border-t dark:border-dark-lighter"
          >
            <div className="pt-2 pb-3 space-y-1 px-4">
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
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-lighter hover:text-gray-900 dark:hover:text-dark-text-primary"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-lighter">Login</Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary-dark hover:bg-gray-50 dark:hover:bg-dark-lighter">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
