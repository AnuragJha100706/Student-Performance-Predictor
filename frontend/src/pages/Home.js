import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Brain, Shield } from 'lucide-react';
import { Button, PageWrapper } from '../components/ui';

const Home = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-900 dark:text-dark-text-primary mb-6"
        >
          Predict Student Success with <span className="text-primary">AI</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-dark-text-secondary mb-8 max-w-2xl"
        >
          Upload datasets, train machine learning models, and predict academic performance with our easy-to-use platform.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Link to="/register">
            <Button className="px-8 py-3 text-lg">Get Started <ArrowRight className="inline ml-2 w-5 h-5" /></Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="px-8 py-3 text-lg">Login</Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-5xl">
          {[
            { icon: BarChart2, title: "Data Analysis", desc: "Visualize student data distributions and correlations instantly." },
            { icon: Brain, title: "ML Training", desc: "Train Decision Trees, SVMs, and more with a few clicks." },
            { icon: Shield, title: "Secure & Local", desc: "Your data stays local. No external database required." }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <item.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 dark:text-dark-text-primary">{item.title}</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
