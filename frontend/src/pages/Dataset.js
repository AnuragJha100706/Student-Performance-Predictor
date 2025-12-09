import React, { useState, useEffect } from 'react';
import { datasetService } from '../services/api';
import { Button, Card, PageWrapper } from '../components/ui';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import EDADashboard from '../components/EDADashboard';

const Dataset = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const res = await datasetService.list();
      if (Array.isArray(res.data)) {
        setDatasets(res.data);
      } else {
        setDatasets([]);
      }
    } catch (error) {
      setDatasets([]);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      await datasetService.upload(formData);
      await loadDatasets();
      toast.success('Dataset uploaded successfully');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (filename) => {
    setSelectedDataset(filename);
    try {
      const res = await datasetService.preview(filename);
      setPreviewData(res.data);
    } catch (error) {
      toast.error('Preview failed');
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-dark-text-primary">Datasets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text-primary">Upload New Dataset</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-dark-lighter rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="dataset-upload"
                className="hidden"
                accept=".csv"
                onChange={handleUpload}
              />
              <label htmlFor="dataset-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-400 dark:text-dark-text-secondary mb-2" />
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">{uploading ? 'Uploading...' : 'Click to upload CSV'}</span>
              </label>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text-primary">Available Datasets</h3>
            <div className="space-y-2">
              {Array.isArray(datasets) && datasets.map((ds) => (
                <div 
                  key={ds}
                  onClick={() => handlePreview(ds)}
                  className={`p-3 rounded-md cursor-pointer flex items-center transition-colors ${selectedDataset === ds ? 'bg-primary/10 text-primary border border-primary/20 dark:text-primary-light' : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-lighter'}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="truncate">{ds}</span>
                </div>
              ))}
              {datasets.length === 0 && <p className="text-gray-500 dark:text-dark-text-secondary text-sm">No datasets found.</p>}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {previewData ? (
            <>
            <Card>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text-primary">Preview: {selectedDataset}</h3>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-dark-lighter p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Rows</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{previewData.stats.rows}</p>
                </div>
                <div className="bg-gray-50 dark:bg-dark-lighter p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Columns</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{previewData.stats.columns.length}</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lighter">
                  <thead className="bg-gray-50 dark:bg-dark-lighter">
                    <tr>
                      {previewData.stats.columns.map(col => (
                        <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-lighter">
                    {previewData.preview.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-dark-lighter transition-colors">
                        {previewData.stats.columns.map(col => (
                          <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <CorrelationHeatmap filename={selectedDataset} />
            <EDADashboard filename={selectedDataset} />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-dark-text-secondary border-2 border-dashed border-gray-200 dark:border-dark-lighter rounded-lg min-h-[400px]">
              Select a dataset to preview
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dataset;
