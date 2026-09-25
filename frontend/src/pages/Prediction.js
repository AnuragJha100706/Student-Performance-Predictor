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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
          >
            <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
              <Activity className="w-6 h-6 text-white" />
            </span>
            Make Predictions
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 ml-14">AI-powered student performance analysis</p>
        </div>
      </div>
      
      {showOnboarding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-500/20 border border-purple-200/50 dark:border-purple-500/30 p-6 rounded-2xl shadow-lg shadow-purple-500/5 flex justify-between items-start"
        >
          <div>
              <h4 className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Info className="w-4 h-4 text-white" />
                </div>
                Welcome to the AI Prediction Engine! 🚀
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ml-10">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-sm font-bold">1</span>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Fill Details</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter student info across tabs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm font-bold">2</span>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Select Model</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose a trained ML model</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-sm font-bold">3</span>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Get Insights</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive detailed analysis</p>
                  </div>
                </div>
              </div>
          </div>
          <button onClick={() => setShowOnboarding(false)} className="p-2 rounded-lg hover:bg-purple-200/50 dark:hover:bg-purple-500/20 transition-colors">
              <X className="w-5 h-5 text-purple-500" />
          </button>
        </motion.div>
      )}

      {/* Model Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select AI Model</label>
        <div className="relative max-w-md">
          <select 
            className="w-full appearance-none border-2 border-gray-200 dark:border-gray-700 dark:bg-dark-card dark:text-white rounded-xl shadow-sm p-3 pl-4 pr-10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer font-medium"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">-- Choose a trained model --</option>
            {Array.isArray(models) && models.map(m => (
              <option key={m.model_id} value={m.model_id}>
                {m.algorithm} ({m.model_id})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single Prediction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-t-4 border-t-purple-500">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </span>
              Single Prediction
            </h3>
            <form onSubmit={handleSinglePredict} className="space-y-6">
              
              {/* Tabs Navigation - Enhanced */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-dark-bg p-1.5 rounded-xl overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-dark-card text-purple-600 dark:text-purple-400 shadow-md'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-purple-500' : ''}`} />
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      )}
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
                          <div className="flex items-center mb-2">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mr-1">
                              {meta.label || field}
                            </label>
                            {meta.tooltip && (
                              <div className="group/tooltip relative">
                                <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 cursor-help hover:text-purple-500 transition-colors" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 w-40 hidden group-hover/tooltip:block z-10 shadow-xl">
                                  {meta.tooltip}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {meta.type === 'select' ? (
                            <select
                              className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-dark-card dark:text-white rounded-xl shadow-sm p-2.5 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
                              onChange={(e) => setInputData({...inputData, [field]: e.target.value})}
                              value={inputData[field] || ''}
                              required
                            >
                              <option value="">Select...</option>
                              {meta.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : meta.type === 'range' ? (
                            <div className="flex items-center space-x-3 bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                              <input
                                type="range"
                                min={meta.min}
                                max={meta.max}
                                className="w-full accent-purple-500 h-2 rounded-full"
                                onChange={(e) => setInputData({...inputData, [field]: e.target.value})}
                                value={inputData[field] || Math.ceil((meta.max + meta.min) / 2)}
                              />
                              <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 w-8 h-8 flex items-center justify-center rounded-lg shadow">
                                {inputData[field] || Math.ceil((meta.max + meta.min) / 2)}
                              </span>
                            </div>
                          ) : (
                            <input
                              type={meta.type || 'text'}
                              min={meta.min}
                              max={meta.max}
                              className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-dark-card dark:text-white rounded-xl shadow-sm p-2.5 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
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

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                 <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                        style={{ width: `${(Object.keys(inputData).length / Object.keys(fieldMetadata).length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {Object.keys(inputData).length}/{Object.keys(fieldMetadata).length} fields
                    </span>
                 </div>
                 <Button type="submit" disabled={!selectedModel}>
                   <Activity className="w-4 h-4 mr-2" />
                   Run Prediction
                 </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Batch Prediction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-t-4 border-t-cyan-500">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <Upload className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </span>
              Batch Prediction
            </h3>
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 mb-6 ${
              batchFile 
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
            }`}>
              <input
                type="file"
                id="batch-upload"
                className="hidden"
                accept=".csv"
                onChange={(e) => setBatchFile(e.target.files[0])}
              />
              <label htmlFor="batch-upload" className="cursor-pointer flex flex-col items-center">
                <div className={`p-4 rounded-2xl mb-4 ${batchFile ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  {batchFile ? (
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <span className={`font-medium ${batchFile ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {batchFile ? batchFile.name : 'Drop CSV file here or click to browse'}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Supports .csv files with student data
                </span>
              </label>
            </div>
            <Button 
              onClick={handleBatchPredict} 
              className="w-full" 
              variant="secondary"
              disabled={!selectedModel || !batchFile}
            >
              <Activity className="w-4 h-4 mr-2" />
              Run Batch Prediction
            </Button>

            {batchResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Results Preview
                </h4>
                <div className="overflow-x-auto max-h-64 rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Prediction</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Probability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {batchResults.slice(0, 10).map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              row.prediction === 1 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {row.prediction === 1 ? '✓ Pass' : '✗ Fail'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                            {(row.probability * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>

      {prediction && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
            <PredictionReport 
                prediction={prediction} 
                model={models.find(m => m.model_id === selectedModel)} 
                inputData={inputData} 
            />
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default Prediction;
