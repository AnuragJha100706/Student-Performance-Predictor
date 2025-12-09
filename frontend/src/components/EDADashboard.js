import React, { useEffect, useState } from 'react';
import { datasetService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card } from './ui';

// Updated palette based on user request
const COLORS = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#A78BFA', '#FBBF24'];

const EDADashboard = ({ filename }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await datasetService.getDistributions(filename);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (filename) fetchData();
  }, [filename]);

  if (loading) return <div>Loading EDA...</div>;
  if (!data) return null;

  const renderBarChart = (title, key) => {
    if (!data[key]) return null;
    const chartData = Object.entries(data[key]).map(([name, value]) => ({ name, value }));
    
    return (
      <Card className="h-80">
        <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-dark-text-primary">{title}</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F8FAFC' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderPieChart = (title, key) => {
    if (!data[key]) return null;
    const chartData = Object.entries(data[key]).map(([name, value]) => ({ name, value }));

    return (
      <Card className="h-80">
        <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">{title}</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Exploratory Data Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderPieChart('Gender Distribution', 'sex')}
        {renderPieChart('Urban vs Rural', 'address')}
        {renderPieChart('Family Size', 'famsize')}
        {renderBarChart('Mother\'s Job', 'Mjob')}
        {renderBarChart('Father\'s Job', 'Fjob')}
        {renderBarChart('Reason for School', 'reason')}
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8">Academic Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderBarChart('G1 Grades', 'G1')}
        {renderBarChart('G2 Grades', 'G2')}
        {renderBarChart('G3 (Final) Grades', 'G3')}
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8">Behavioral Factors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderBarChart('Study Time', 'studytime')}
        {renderBarChart('Failures', 'failures')}
        {renderBarChart('Absences', 'absences')}
        {renderBarChart('Health', 'health')}
        {renderBarChart('Alcohol (Workday)', 'Dalc')}
        {renderBarChart('Alcohol (Weekend)', 'Walc')}
      </div>
    </div>
  );
};

export default EDADashboard;
