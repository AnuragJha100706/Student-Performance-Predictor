import React, { useEffect, useState } from 'react';
import { datasetService } from '../services/api';
import { motion } from 'framer-motion';

const CorrelationHeatmap = ({ filename }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await datasetService.getCorrelation(filename);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load correlation data');
      } finally {
        setLoading(false);
      }
    };
    if (filename) {
        fetchData();
    }
  }, [filename]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading Heatmap...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!data) return null;

  const { columns, values } = data;

  const getColor = (value) => {
    if (value === null) return '#f3f4f6';
    const val = parseFloat(value);
    // Blue for positive, Red for negative
    if (val >= 0) {
        return `rgba(59, 130, 246, ${val * 0.8 + 0.1})`; // blue-500 base
    } else {
        return `rgba(239, 68, 68, ${Math.abs(val) * 0.8 + 0.1})`; // red-500 base
    }
  };

  return (
    <div className="overflow-x-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">Correlation Matrix</h3>
      <div className="inline-block min-w-full">
        {/* Header Row */}
        <div className="flex">
            <div className="w-24 shrink-0"></div>
            {columns.map((col, i) => (
                <div key={i} className="w-16 shrink-0 text-xs font-medium text-gray-500 text-center rotate-0 truncate" title={col}>
                    {col.length > 6 ? col.substring(0, 6) + '..' : col}
                </div>
            ))}
        </div>
        
        {/* Data Rows */}
        {values.map((row, i) => (
            <div key={i} className="flex items-center mt-1">
                <div className="w-24 shrink-0 text-xs font-medium text-gray-600 truncate pr-2 text-right" title={columns[i]}>
                    {columns[i]}
                </div>
                {row.map((val, j) => (
                    <motion.div
                        key={`${i}-${j}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (i * 5 + j) * 0.005 }}
                        className="w-16 h-10 shrink-0 flex items-center justify-center text-[10px] text-gray-700 rounded-sm mx-[1px]"
                        style={{ backgroundColor: getColor(val) }}
                        title={`${columns[i]} vs ${columns[j]}: ${val}`}
                    >
                        {val}
                    </motion.div>
                ))}
            </div>
        ))}
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
