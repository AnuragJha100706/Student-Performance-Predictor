import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Dataset from './pages/Dataset';
import ModelTraining from './pages/ModelTraining';
import Prediction from './pages/Prediction';
import History from './pages/History';
import ModelComparison from './pages/ModelComparison';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition>
              <Dashboard />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/dataset" element={
          <ProtectedRoute>
            <PageTransition>
              <Dataset />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/training" element={
          <ProtectedRoute>
            <PageTransition>
              <ModelTraining />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/comparison" element={
          <ProtectedRoute>
            <PageTransition>
              <ModelComparison />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/prediction" element={
          <ProtectedRoute>
            <PageTransition>
              <Prediction />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <PageTransition>
              <History />
            </PageTransition>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster position="top-right" />
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
