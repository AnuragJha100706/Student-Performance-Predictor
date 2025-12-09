import React, { useEffect, useState } from 'react';
import { datasetService, modelService, predictService } from '../services/api';
import { Card, PageWrapper } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { Database, Brain, Activity, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({ datasets: 0, models: 0, predictions: 0 });
  const [historyData, setHistoryData] = useState([]);
  const [modelData, setModelData] = useState([]);
  const [recentPredictions, setRecentPredictions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datasets, models, history] = await Promise.all([
          datasetService.list(),
          modelService.list(),
          predictService.history()
        ]);
        
        const historyList = Array.isArray(history.data) ? history.data : [];
        const modelsList = Array.isArray(models.data) ? models.data : [];

        setStats({
          datasets: Array.isArray(datasets.data) ? datasets.data.length : 0,
          models: modelsList.length,
          predictions: historyList.length
        });

        // Process History for Pie Chart
        const passCount = historyList.filter(h => h.prediction === 1).length;
        const failCount = historyList.filter(h => h.prediction === 0).length;
        setHistoryData([
          { name: 'Pass', value: passCount },
          { name: 'Fail', value: failCount }
        ]);

        // Process Models for Bar Chart (Accuracy)
        const mData = modelsList.map(m => ({
          name: m.algorithm,
          accuracy: (m.metrics?.accuracy || 0) * 100
        }));
        setModelData(mData);

        // Recent Predictions
        setRecentPredictions(historyList.slice(-5).reverse());

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#10B981', '#EF4444']; // Green for Pass, Red for Fail

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Dashboard Overview</h1>
            <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Welcome back! Here's what's happening with your models.</p>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              System Operational
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div variants={item}>
            <Card className="flex items-center space-x-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                <Database className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Total Datasets</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">{stats.datasets}</h3>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="flex items-center space-x-4 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600 dark:text-indigo-400">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Trained Models</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">{stats.models}</h3>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="flex items-center space-x-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Total Predictions</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">{stats.predictions}</h3>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={item}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-secondary" />
                  Prediction Distribution
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={historyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {historyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#F8FAFC' : '#1F2937'
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-secondary" />
                  Model Accuracy Comparison
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94A3B8' : '#6B7280' }} />
                    <Tooltip 
                      cursor={{ fill: isDarkMode ? '#334155' : '#F3F4F6' }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#F8FAFC' : '#1F2937'
                      }}
                    />
                    <Bar dataKey="accuracy" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-secondary" />
                Recent Activity
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                  {recentPredictions.map((pred, idx) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                        {new Date(pred.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        {pred.model_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pred.prediction === 1 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {pred.prediction === 1 ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                        {(pred.probability * 100).toFixed(1)}%
                      </td>
                    </motion.tr>
                  ))}
                  {recentPredictions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-dark-text-secondary">
                        No recent predictions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

export default Dashboard;
