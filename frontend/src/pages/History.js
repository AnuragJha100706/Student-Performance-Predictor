import React, { useState, useEffect } from 'react';
import { predictService } from '../services/api';
import { Card, PageWrapper, Button } from '../components/ui';
import { Check, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  useEffect(() => {
    predictService.history()
      .then(res => {
        if (Array.isArray(res.data)) {
          // Sort by timestamp desc
          const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setHistory(sorted);
        } else {
          setHistory([]);
        }
      })
      .catch(() => setHistory([]));
  }, []);

  const handleFeedback = async (item, actual) => {
    try {
      await predictService.submitFeedback({
        timestamp: item.timestamp,
        model_id: item.model_id,
        actual_result: actual
      });
      setFeedbackGiven({ ...feedbackGiven, [item.timestamp]: true });
      toast.success('Feedback submitted!');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-dark-text-primary">Prediction History</h1>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lighter">
            <thead className="bg-gray-50 dark:bg-dark-lighter">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Model ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Prediction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Feedback</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-lighter">
              {Array.isArray(history) && history.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-lighter transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text-primary">{item.model_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.prediction === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.prediction === 1 ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{(item.probability * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {feedbackGiven[item.timestamp] ? (
                        <span className="text-green-600 flex items-center"><Check className="w-4 h-4 mr-1" /> Thank you</span>
                    ) : (
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleFeedback(item, item.prediction)}
                                className="text-gray-400 hover:text-green-500"
                                title="Correct"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleFeedback(item, item.prediction === 1 ? 0 : 1)}
                                className="text-gray-400 hover:text-red-500"
                                title="Incorrect (Report Error)"
                            >
                                <AlertTriangle className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-dark-text-secondary">No history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
};

export default History;
