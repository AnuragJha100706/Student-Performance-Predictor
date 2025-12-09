import React, { useState, useEffect } from 'react';
import { datasetService, modelService } from '../services/api';
import { Button, Card, PageWrapper } from '../components/ui';
import { Play, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ModelTraining = () => {
  const [datasets, setDatasets] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [algorithm, setAlgorithm] = useState('Decision Tree');
  const [hyperparams, setHyperparams] = useState({});
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState(null);

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
      toast.success('Model trained successfully!');
      loadData(); // Reload models list
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
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-dark-text-primary">Train Model</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-dark-text-primary">Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Select Dataset</label>
              <select 
                className="w-full border-gray-300 dark:border-dark-lighter dark:bg-dark-bg dark:text-dark-text-primary rounded-md shadow-sm p-2 border"
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
              >
                <option value="">-- Select Dataset --</option>
                {Array.isArray(datasets) && datasets.map(ds => <option key={ds} value={ds}>{ds}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Algorithm</label>
              <select 
                className="w-full border-gray-300 dark:border-dark-lighter dark:bg-dark-bg dark:text-dark-text-primary rounded-md shadow-sm p-2 border"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                <option>Decision Tree</option>
                <option>Naive Bayes</option>
                <option>Logistic Regression</option>
                <option>SVM</option>
              </select>
            </div>

            {/* Simple Hyperparams for Demo */}
            {algorithm === 'Decision Tree' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Max Depth</label>
                <input 
                  type="number" 
                  className="w-full border-gray-300 dark:border-dark-lighter dark:bg-dark-bg dark:text-dark-text-primary rounded-md shadow-sm p-2 border"
                  placeholder="None"
                  onChange={(e) => setHyperparams({...hyperparams, max_depth: e.target.value ? parseInt(e.target.value) : null})}
                />
              </div>
            )}

            <Button 
              onClick={handleTrain} 
              disabled={training || !selectedDataset}
              className="w-full mt-4 flex justify-center items-center"
            >
              {training ? 'Training...' : <><Play className="w-4 h-4 mr-2" /> Start Training</>}
            </Button>
          </div>
        </Card>

        <div>
          {result && (
            <Card className="bg-green-50 border border-green-200 dark:bg-success/10 dark:border-success/20">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-success mr-2" />
                <h3 className="text-xl font-semibold text-green-800 dark:text-success">Training Complete</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-dark-bg p-3 rounded shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Accuracy</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">{(JSON.parse(result.metrics).accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white dark:bg-dark-bg p-3 rounded shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Precision</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">{(JSON.parse(result.metrics).precision * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white dark:bg-dark-bg p-3 rounded shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Recall</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">{(JSON.parse(result.metrics).recall * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white dark:bg-dark-bg p-3 rounded shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">ROC AUC</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">{(JSON.parse(result.metrics).roc_auc).toFixed(3)}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  <p><strong>Model ID:</strong> {result.model_id}</p>
                  <p><strong>Saved to:</strong> {result.filepath}</p>
                </div>
              </div>
            </Card>
          )}
          
          {!result && !training && (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-dark-text-secondary border-2 border-dashed border-gray-200 dark:border-dark-lighter rounded-lg min-h-[300px]">
              Training results will appear here
            </div>
          )}
        </div>
      </div>

      {/* Existing Models List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-text-primary">Existing Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <Card key={model.model_id} className="relative hover:shadow-lg transition-shadow">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => handleDelete(model.model_id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete Model"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-dark-text-primary">{model.algorithm}</h3>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-4">ID: {model.model_id}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Accuracy:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-text-primary">{(model.metrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Precision:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-text-primary">{(model.metrics.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Recall:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-text-primary">{(model.metrics.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Created:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-text-primary">{new Date(model.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
          {models.length === 0 && (
            <div className="col-span-full text-center text-gray-500 dark:text-dark-text-secondary py-8">
              No trained models found.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ModelTraining;
