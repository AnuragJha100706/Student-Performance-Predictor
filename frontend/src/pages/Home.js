import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Brain, Shield, Sparkles, Zap, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Button, PageWrapper, GradientCard } from '../components/ui';

const Home = () => {
  const features = [
    { 
      icon: BarChart2, 
      title: "Smart Analytics", 
      desc: "Visualize student data with beautiful charts and AI-powered insights.",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20"
    },
    { 
      icon: Brain, 
      title: "ML Training", 
      desc: "Train Decision Trees, SVMs, Neural Networks with just a few clicks.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    },
    { 
      icon: Shield, 
      title: "Privacy First", 
      desc: "Your data stays local. No external servers. Complete privacy.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
    }
  ];

  const stats = [
    { value: "99%", label: "Accuracy Rate", icon: Target },
    { value: "10K+", label: "Predictions Made", icon: TrendingUp },
    { value: "50+", label: "ML Models", icon: Zap },
  ];

  return (
    <PageWrapper>
      <div className="relative">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center relative">
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl opacity-20 blur-sm"
          />
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 right-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-sm"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl opacity-20 blur-sm"
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI-Powered Education Analytics
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            <span className="text-gray-900 dark:text-white">Predict Student </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Success with AI
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed"
          >
            Transform educational data into actionable insights. Upload datasets, 
            train cutting-edge ML models, and predict academic performance with 
            <span className="text-purple-600 dark:text-purple-400 font-semibold"> unprecedented accuracy</span>.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register">
              <Button className="px-8 py-4 text-lg group">
                Start Free Trial 
                <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-4 text-lg">
                Login to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm shadow-lg shadow-purple-500/10"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help educators and institutions make data-driven decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${item.bgGradient} border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-purple-500/5 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/10`}>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative py-20"
        >
          <div className="relative max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-2xl shadow-purple-500/30 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>
            
            <div className="relative text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Education?</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of educators using AI to improve student outcomes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
                  >
                    View Demo
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-12 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 dark:text-gray-500">
            {['🔒 Secure', '⚡ Fast', '🎯 Accurate', '📊 Insightful'].map((badge, i) => (
              <span key={i} className="flex items-center gap-2 text-sm">
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Home;
