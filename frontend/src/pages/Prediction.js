import React, { useState, useEffect } from 'react';
import { modelService, predictService } from '../services/api';
import { Button, Input, Card, PageWrapper } from '../components/ui';
import { Upload, Activity, Info, Download, User, BookOpen, Heart, Home, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import PredictionReport from '../components/PredictionReport';

const Prediction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [inputData, setInputData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [batchFile, setBatchFile] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Field Metadata for better UI
  const fieldMetadata = {
    school: { type: 'select', options: ['GP', 'MS'], label: 'School', tooltip: 'GP: Gabriel Pereira, MS: Mousinho da Silveira' },
    sex: { type: 'select', options: ['F', 'M'], label: 'Sex' },
    age: { type: 'number', min: 15, max: 22, label: 'Age' },
    address: { type: 'select', options: ['U', 'R'], label: 'Address', tooltip: 'U: Urban, R: Rural' },
    famsize: { type: 'select', options: ['LE3', 'GT3'], label: 'Family Size', tooltip: 'LE3: <=3, GT3: >3' },
    Pstatus: { type: 'select', options: ['T', 'A'], label: 'Parent Status', tooltip: 'T: Together, A: Apart' },
    Medu: { type: 'select', options: ['0', '1', '2', '3', '4'], label: 'Mother Education', tooltip: '0: None, 4: Higher Education' },
    Fedu: { type: 'select', options: ['0', '1', '2', '3', '4'], label: 'Father Education', tooltip: '0: None, 4: Higher Education' },
    Mjob: { type: 'select', options: ['teacher', 'health', 'services', 'at_home', 'other'], label: 'Mother Job' },
    Fjob: { type: 'select', options: ['teacher', 'health', 'services', 'at_home', 'other'], label: 'Father Job' },
    reason: { type: 'select', options: ['home', 'reputation', 'course', 'other'], label: 'Reason for School' },
    guardian: { type: 'select', options: ['mother', 'father', 'other'], label: 'Guardian' },
    traveltime: { type: 'select', options: ['1', '2', '3', '4'], label: 'Travel Time', tooltip: '1: <15 min, 4: >1 hour' },
    studytime: { type: 'select', options: ['1', '2', '3', '4'], label: 'Study Time', tooltip: '1: <2 hours, 4: >10 hours' },
    failures: { type: 'number', min: 0, max: 4, label: 'Past Failures' },
    schoolsup: { type: 'select', options: ['yes', 'no'], label: 'School Support' },
    famsup: { type: 'select', options: ['yes', 'no'], label: 'Family Support' },
    paid: { type: 'select', options: ['yes', 'no'], label: 'Paid Classes' },
    activities: { type: 'select', options: ['yes', 'no'], label: 'Extra Activities' },
    nursery: { type: 'select', options: ['yes', 'no'], label: 'Nursery School' },
    higher: { type: 'select', options: ['yes', 'no'], label: 'Higher Ed' },
    internet: { type: 'select', options: ['yes', 'no'], label: 'Internet Access' },
    romantic: { type: 'select', options: ['yes', 'no'], label: 'Romantic Relationship' },
    famrel: { type: 'range', min: 1, max: 5, label: 'Family Relations', tooltip: '1: Very Bad, 5: Excellent' },
    freetime: { type: 'range', min: 1, max: 5, label: 'Free Time', tooltip: '1: Very Low, 5: Very High' },
    goout: { type: 'range', min: 1, max: 5, label: 'Going Out', tooltip: '1: Very Low, 5: Very High' },
    Dalc: { type: 'range', min: 1, max: 5, label: 'Workday Alcohol', tooltip: '1: Very Low, 5: Very High' },
    Walc: { type: 'range', min: 1, max: 5, label: 'Weekend Alcohol', tooltip: '1: Very Low, 5: Very High' },
    health: { type: 'range', min: 1, max: 5, label: 'Health Status', tooltip: '1: Very Bad, 5: Very Good' },
    absences: { type: 'number', min: 0, max: 93, label: 'Absences' }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User, fields: ['school', 'sex', 'age', 'address', 'Pstatus', 'guardian', 'reason', 'internet', 'nursery'] },
    { id: 'family', label: 'Family', icon: Home, fields: ['famsize', 'Medu', 'Fedu', 'Mjob', 'Fjob', 'famrel', 'famsup'] },
    { id: 'academic', label: 'Academic', icon: BookOpen, fields: ['traveltime', 'studytime', 'failures', 'schoolsup', 'paid', 'activities', 'higher', 'absences'] },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart, fields: ['romantic', 'freetime', 'goout', 'Dalc', 'Walc', 'health'] }
  ];

  useEffect(() => {
    modelService.list()
      .then(res => {
        if (Array.isArray(res.data)) {
          setModels(res.data);
        } else {
          console.error("Invalid models data:", res.data);
          setModels([]);
        }
      })
      .catch(err => {
        console.error("Error fetching models:", err);
        setModels([]);
      });
  }, []);

  const handleSinglePredict = async (e) => {
    e.preventDefault();
    if (!selectedModel) return;
    try {
      const res = await predictService.predict({
        model_id: selectedModel,
        input_data: inputData,
        save: true
      });
      setPrediction(res.data);
      toast.success('Prediction complete!');
    } catch (error) {
      toast.error('Prediction failed');
    }
  };

  const handleBatchPredict = async () => {
    if (!selectedModel || !batchFile) return;
    const formData = new FormData();
    formData.append('file', batchFile);
    formData.append('model_id', selectedModel);
    
    try {
      const res = await predictService.batchPredict(formData);
      setBatchResults(res.data);
      toast.success('Batch prediction complete!');
    } catch (error) {
      toast.error('Batch prediction failed');
    }
  };

  const generatePDF = () => {
    if (!prediction) return;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Student Performance Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Model Used: ${selectedModel}`, 20, 40);
    
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    doc.setFontSize(16);
    doc.text("Prediction Result", 20, 60);
    
    const resultText = prediction.prediction === 1 ? "PASS" : "FAIL";
    const color = prediction.prediction === 1 ? [0, 128, 0] : [255, 0, 0];
    
    doc.setTextColor(...color);
    doc.setFontSize(24);
    doc.text(resultText, 20, 75);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Probability: ${(prediction.probability * 100).toFixed(1)}%`, 20, 85);
    
    doc.text("Input Data Summary:", 20, 100);
    let y = 110;
    Object.entries(inputData).forEach(([key, value]) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${key}: ${value}`, 30, y);
      y += 7;
    });
    
    doc.save("student_report.pdf");
    toast.success("Report downloaded!");
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-dark-text-primary">Make Predictions</h1>
      
      {showOnboarding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 bg-primary/10 border-l-4 border-primary p-4 rounded-r shadow-sm flex justify-between items-start"
        >
          <div>
              <h4 className="font-bold text-primary-dark dark:text-primary-light flex items-center gap-2">
                <Info className="w-5 h-5" />
                Welcome to the Advanced Prediction Engine!
              </h4>
              <p className="text-sm text-primary dark:text-primary-light mt-2 ml-7">
                  1. <strong>Fill Details:</strong> Enter student information across the Personal, Family, Academic, and Lifestyle tabs.<br/>
                  2. <strong>Select Model:</strong> Choose a trained model from the dropdown.<br/>
                  3. <strong>Analyze:</strong> Get a detailed report with "What-If" scenarios and actionable recommendations.
              </p>
          </div>
          <button onClick={() => setShowOnboarding(false)} className="text-primary-light hover:text-primary-dark dark:text-primary dark:hover:text-primary-light p-1">
              <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Select Model</label>
        <select 
          className="w-full max-w-md border-gray-300 dark:border-dark-lighter dark:bg-dark-bg dark:text-dark-text-primary rounded-md shadow-sm p-2 border"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">-- Select Model --</option>
          {Array.isArray(models) && models.map(m => <option key={m.model_id} value={m.model_id}>{m.algorithm} ({m.model_id})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text-primary">Single Prediction</h3>
          <form onSubmit={handleSinglePredict} className="space-y-6">
            
            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-dark-bg p-1 rounded-lg overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-dark-card text-primary shadow-sm'
                        : 'text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary hover:bg-gray-200 dark:hover:bg-dark-lighter'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form Fields with Animation */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {tabs.find(t => t.id === activeTab).fields.map(field => {
                    const meta = fieldMetadata[field] || {};
                    return (
                      <div key={field} className="relative group">
                        <div className="flex items-center mb-1">
                          <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase mr-1">{meta.label || field}</label>
                          {meta.tooltip && (
                            <div className="group relative">
                              <Info className="w-3 h-3 text-gray-400 dark:text-dark-text-secondary cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-dark-lighter text-white dark:text-dark-text-primary text-xs rounded p-1 w-32 hidden group-hover:block z-10 pointer-events-none">
                                {meta.tooltip}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {meta.type === 'select' ? (
                          <select
                            className="w-full border-gray-300 dark:border-dark-lighter dark:bg-dark-bg dark:text-dark-text-primary rounded-md shadow-sm p-2 border text-sm focus:ring-primary focus:border-primary transition-colors"
                            onChange={(e) => setInputData({...inputData, [field]: e.target.value})}
                            value={inputData[field] || ''}
                            required
                          >
                            <option value="">Select...</option>
                            {meta.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : meta.type === 'range' ? (
                          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-dark-bg p-2 rounded-md border border-gray-200 dark:border-dark-lighter">
                            <input
                              type="range"
                              min={meta.min}
                              max={meta.max}
                              className="w-full accent-primary"
                              onChange={(e) => setInputData({...inputData, [field]: e.target.value})}
                              value={inputData[field] || Math.ceil((meta.max + meta.min) / 2)}
                            />
                            <span className="text-sm font-bold text-primary w-6 text-center">{inputData[field] || Math.ceil((meta.max + meta.min) / 2)}</span>
                          </div>
                        ) : (
                          <input
                            type={meta.type || 'text'}
                            min={meta.min}
                            max={meta.max}
                            className="w-full border-gray-300 dark:border-dark-lighter dark:bg-dark-bg dark:text-dark-text-primary rounded-md shadow-sm p-2 border text-sm focus:ring-primary focus:border-primary transition-colors"
                            onChange={(e) => setInputData({...inputData, [field]: e.target.value})}
                            value={inputData[field] || ''}
                            required
                          />
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-dark-lighter">
               <div className="text-xs text-gray-400 dark:text-dark-text-secondary flex items-center">
                  {Object.keys(inputData).length} / {Object.keys(fieldMetadata).length} fields filled
               </div>
               <Button type="submit" disabled={!selectedModel} className="bg-primary hover:bg-primary-dark text-white px-6">
                 Run Prediction
               </Button>
            </div>
          </form>
          
          {/* Prediction Result moved to bottom */}
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text-primary">Batch Prediction</h3>
          <div className="border-2 border-dashed border-gray-300 dark:border-dark-lighter rounded-lg p-8 text-center hover:border-primary transition-colors mb-4">
            <input
              type="file"
              id="batch-upload"
              className="hidden"
              accept=".csv"
              onChange={(e) => setBatchFile(e.target.files[0])}
            />
            <label htmlFor="batch-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-10 h-10 text-gray-400 dark:text-dark-text-secondary mb-2" />
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">{batchFile ? batchFile.name : 'Upload CSV for Batch Prediction'}</span>
            </label>
          </div>
          <Button onClick={handleBatchPredict} className="w-full" disabled={!selectedModel || !batchFile}>Run Batch Prediction</Button>

          {batchResults && (
            <div className="mt-6">
              <h4 className="font-medium mb-2 text-gray-900 dark:text-dark-text-primary">Results Preview</h4>
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lighter text-sm">
                  <thead className="bg-gray-50 dark:bg-dark-lighter">
                    <tr>
                      <th className="px-4 py-2 text-gray-500 dark:text-dark-text-secondary">Prediction</th>
                      <th className="px-4 py-2 text-gray-500 dark:text-dark-text-secondary">Probability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-lighter">
                    {batchResults.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-gray-900 dark:text-dark-text-primary">{row.prediction === 1 ? 'Pass' : 'Fail'}</td>
                        <td className="px-4 py-2 text-gray-900 dark:text-dark-text-primary">{(row.probability * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>

      {prediction && (
        <div className="mt-12">
            <PredictionReport 
                prediction={prediction} 
                model={models.find(m => m.model_id === selectedModel)} 
                inputData={inputData} 
            />
        </div>
      )}
    </PageWrapper>
  );
};

export default Prediction;
