import React, { useEffect, useState } from 'react';
import { datasetService, modelService, predictService } from '../services/api';
import { Card, PageWrapper, Badge } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { Database, Brain, Activity, TrendingUp, Users, CheckCircle, Sparkles, ArrowUpRight, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
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
  const GRADIENT_COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#06B6D4'];

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

  const statCards = [
    { 
      label: 'Total Datasets', 
      value: stats.datasets, 
      icon: Database, 
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-l-blue-500'
    },
    { 
      label: 'Trained Models', 
      value: stats.models, 
      icon: Brain, 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-l-purple-500'
    },
    { 
      label: 'Total Predictions', 
      value: stats.predictions, 
      icon: Activity, 
      gradient: 'from-orange-500 to-amber-400',
      bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-l-orange-500'
    },
  ];

  return (
    <PageWrapper>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
            >
              <span className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </span>
              Dashboard
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 ml-14">Welcome back! Here's your performance overview.</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Badge variant="success" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Operational
            </Badge>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card className={`relative overflow-hidden border-l-4 ${stat.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                    <p className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>Active</span>
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgGradient}`}>
                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
                {/* Decorative gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-50`}></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={item}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                  Prediction Distribution
                </h3>
                <Badge variant="info">Live</Badge>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="failGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={historyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {historyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? 'url(#passGradient)' : 'url(#failGradient)'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#F8FAFC' : '#1F2937',
                        padding: '12px 16px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-gray-600 dark:text-gray-300 font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </span>
                  Model Performance
                </h3>
                <Badge variant="gradient">Accuracy %</Badge>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="50%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: isDarkMode ? '#94A3B8' : '#6B7280', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: isDarkMode ? '#94A3B8' : '#6B7280', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      cursor={{ fill: isDarkMode ? '#334155' : '#F3F4F6', radius: 8 }}
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        color: isDarkMode ? '#F8FAFC' : '#1F2937',
                        padding: '12px 16px'
                      }}
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Accuracy']}
                    />
                    <Bar 
                      dataKey="accuracy" 
                      fill="url(#barGradient)" 
                      radius={[8, 8, 0, 0]} 
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
                  <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </span>
                Recent Activity
              </h3>
              <Badge variant="primary">{recentPredictions.length} recent</Badge>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider rounded-tl-xl">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider rounded-tr-xl">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {recentPredictions.map((pred, idx) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(pred.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {pred.model_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={pred.prediction === 1 ? 'success' : 'danger'}>
                          {pred.prediction === 1 ? '✓ Pass' : '✗ Fail'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${pred.prediction === 1 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`}
                              style={{ width: `${pred.probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {(pred.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {recentPredictions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                            <Activity className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">No recent predictions found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">Make your first prediction to see it here</p>
                        </div>
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
