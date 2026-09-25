import React, { useState, useEffect } from 'react';
import { datasetService, modelService } from '../services/api';
import { Button, Card, PageWrapper, Badge } from '../components/ui';
import { Play, CheckCircle, AlertCircle, Trash2, Brain, Database, Sparkles, Cpu, Target, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ModelTraining = () => {
  const [datasets, setDatasets] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [algorithm, setAlgorithm] = useState('Decision Tree');
  const [hyperparams, setHyperparams] = useState({});
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState(null);

  const algorithms = [
    { name: 'Decision Tree', icon: '🌳', color: 'emerald', description: 'Great for interpretable models' },
    { name: 'Naive Bayes', icon: '📊', color: 'blue', description: 'Fast probabilistic classifier' },
    { name: 'Logistic Regression', icon: '📈', color: 'purple', description: 'Simple but effective' },
    { name: 'SVM', icon: '🎯', color: 'orange', description: 'Powerful for complex data' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    datasetService.list()
      .then(res => {
        if (Array.isArray(res.data)) {
          setDatasets(res.data);
        } else {
          setDatasets([]);
        }
      })
      .catch(() => setDatasets([]));

    modelService.list()
      .then(res => {
        if (Array.isArray(res.data)) {
          setModels(res.data);
        } else {
          setModels([]);
        }
      })
      .catch(() => setModels([]));
  };

  const handleTrain = async () => {
    if (!selectedDataset) return;
    setTraining(true);
    setResult(null);
    try {
      const res = await modelService.train({
        dataset: selectedDataset,
        algorithm,
        hyperparams
      });
      setResult(res.data);
      toast.success('Model trained successfully! 🎉');
      loadData();
    } catch (error) {
      toast.error('Training failed: ' + (error.response?.data?.msg || error.message));
    } finally {
      setTraining(false);
    }
  };

  const handleDelete = async (modelId) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    try {
      await modelService.delete(modelId);
      toast.success('Model deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete model');
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
          >
            <span className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
              <Brain className="w-6 h-6 text-white" />
            </span>
            Model Training
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 ml-14">Train and manage your ML models</p>
        </div>
        <Badge variant="info" className="flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          {models.length} Models Trained
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-t-4 border-t-purple-500">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </span>
              Configuration
            </h3>
            
            <div className="space-y-6">
              {/* Dataset Selection */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-500" />
                  Select Dataset
                </label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none border-2 border-gray-200 dark:border-gray-700 dark:bg-dark-card dark:text-white rounded-xl shadow-sm p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                  >
                    <option value="">-- Choose a dataset --</option>
                    {Array.isArray(datasets) && datasets.map(ds => <option key={ds} value={ds}>{ds}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Algorithm Selection - Visual Cards */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-500" />
                  Select Algorithm
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {algorithms.map((algo) => (
                    <motion.button
                      key={algo.name}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAlgorithm(algo.name)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        algorithm === algo.name
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {algorithm === algo.name && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-purple-500" />
                        </div>
                      )}
                      <span className="text-2xl mb-2 block">{algo.icon}</span>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{algo.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{algo.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Hyperparameters */}
              <AnimatePresence mode="wait">
                {algorithm === 'Decision Tree' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Max Depth (optional)
                    </label>
                    <input 
                      type="number" 
                      className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-dark-card dark:text-white rounded-xl shadow-sm p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                      placeholder="Leave empty for auto"
                      onChange={(e) => setHyperparams({...hyperparams, max_depth: e.target.value ? parseInt(e.target.value) : null})}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                onClick={handleTrain} 
                disabled={training || !selectedDataset}
                loading={training}
                className="w-full py-3.5"
              >
                {!training && <Play className="w-4 h-4 mr-2" />}
                {training ? 'Training Model...' : 'Start Training'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Training Complete!</h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Model is ready for predictions</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Accuracy', value: JSON.parse(result.metrics).accuracy, color: 'purple' },
                      { label: 'Precision', value: JSON.parse(result.metrics).precision, color: 'pink' },
                      { label: 'Recall', value: JSON.parse(result.metrics).recall, color: 'cyan' },
                      { label: 'ROC AUC', value: JSON.parse(result.metrics).roc_auc, color: 'orange', isRaw: true },
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm"
                      >
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {metric.isRaw ? metric.value.toFixed(3) : `${(metric.value * 100).toFixed(1)}%`}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white/50 dark:bg-dark-card/50 rounded-xl p-4 text-sm space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Model ID:</span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">{result.model_id}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Saved to:</span>
                      <span className="font-mono text-xs text-gray-900 dark:text-white truncate max-w-[200px]">{result.filepath}</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : training ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-purple-600 dark:text-purple-400 font-medium">Training in progress...</p>
                <p className="text-sm text-purple-400 dark:text-purple-500">This may take a few moments</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <Target className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Training Results</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Configure and train to see metrics</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Existing Models */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
          <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
            <Cpu className="w-5 h-5 text-white" />
          </span>
          Trained Models
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.model_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="relative group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(model.model_id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Model"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">
                    {algorithms.find(a => a.name === model.algorithm)?.icon || '🤖'}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{model.algorithm}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{model.model_id}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Accuracy</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${model.metrics.accuracy * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white w-14 text-right">
                        {(model.metrics.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Precision</span>
                    <span className="font-medium text-gray-900 dark:text-white">{(model.metrics.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Recall</span>
                    <span className="font-medium text-gray-900 dark:text-white">{(model.metrics.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {new Date(model.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {models.length === 0 && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No models trained yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Train your first model to see it here</p>
              </Card>
            </div>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default ModelTraining;
