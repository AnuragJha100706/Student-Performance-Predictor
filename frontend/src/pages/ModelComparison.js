import React, { useState, useEffect } from 'react';
import { modelService } from '../services/api';
import { Card, PageWrapper } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';
import { Trophy, BarChart2, Table as TableIcon } from 'lucide-react';

const ModelComparison = () => {
  const { isDarkMode } = useTheme();
  const [models, setModels] = useState([]);

  useEffect(() => {
    modelService.list().then(res => {
      if (Array.isArray(res.data)) {
        setModels(res.data);
      }
    });
  }, []);

  const chartData = models.map(m => ({
    name: `${m.algorithm} (${m.model_id.split('_')[1]?.substring(0, 8) || 'ID'})`,
    accuracy: (m.metrics?.accuracy || 0) * 100,
    precision: (m.metrics?.precision || 0) * 100,
    recall: (m.metrics?.recall || 0) * 100,
    roc_auc: (m.metrics?.roc_auc || 0) * 100,
  }));

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Model Comparison</h1>
            <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Analyze and compare the performance of your trained models.</p>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Trophy className="w-4 h-4 mr-2" />
              {models.length} Models Trained
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={item}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-secondary" />
                  Performance Metrics
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{fontSize: 12, fill: isDarkMode ? '#94A3B8' : '#6B7280'}} />
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
                    <Legend />
                    <Bar dataKey="accuracy" fill="#0D9488" name="Accuracy %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" fill="#F59E0B" name="Precision %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recall" fill="#3B82F6" name="Recall %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary flex items-center">
                  <TableIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-secondary" />
                  Detailed Metrics
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Algorithm</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accuracy</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precision</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recall</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ROC AUC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                    {models.map((m, i) => (
                      <motion.tr 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-dark-text-primary">{m.algorithm}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text-secondary">{(m.metrics?.accuracy * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text-secondary">{(m.metrics?.precision * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text-secondary">{(m.metrics?.recall * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text-secondary">{(m.metrics?.roc_auc * 100).toFixed(1)}%</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default ModelComparison;
