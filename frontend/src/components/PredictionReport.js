import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Download, RefreshCw, AlertTriangle, CheckCircle, ArrowRight, Sliders } from 'lucide-react';
import { Button, Card } from './ui';
import jsPDF from 'jspdf';
import { predictService } from '../services/api';
import toast from 'react-hot-toast';

const PredictionReport = ({ prediction, model, inputData, onRecalculate }) => {
  const [modifiedInput, setModifiedInput] = useState(inputData);
  const [currentPrediction, setCurrentPrediction] = useState(prediction);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModifiedInput(inputData);
    setCurrentPrediction(prediction);
  }, [prediction, inputData]);

  // Extract Feature Importance from Model
  const featureImportance = model?.feature_importance || {};
  const sortedFeatures = Object.entries(featureImportance)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 10)
    .map(([key, value]) => ({ name: key, value: Math.abs(value), originalValue: value }));

  // Generate Recommendations
  const getRecommendations = () => {
    const recs = [];
    const data = modifiedInput;

    if (data.failures > 0) recs.push("High number of past failures detected. Consider remedial classes.");
    if (data.absences > 10) recs.push("Attendance is low. Regular attendance is strongly correlated with success.");
    if (data.studytime < 3) recs.push("Study time is low. Increasing weekly study time to >5 hours is recommended.");
    if (data.goout > 3) recs.push("High frequency of going out may impact study time. Balance social life with academics.");
    if (data.Dalc > 2 || data.Walc > 3) recs.push("Alcohol consumption levels may be affecting performance.");
    if (data.health < 3) recs.push("Health status reported as low. Ensure physical well-being is prioritized.");
    if (data.schoolsup === 'no' && (data.G1 < 10 || data.G2 < 10)) recs.push("Consider seeking extra educational support from the school.");

    if (recs.length === 0) recs.push("Keep up the good work! Maintain your current study habits.");
    return recs;
  };

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const res = await predictService.predict({
        model_id: model.model_id,
        input_data: modifiedInput,
        save: false // Don't save what-if scenarios to history
      });
      setCurrentPrediction(res.data);
      toast.success('Updated prediction!');
    } catch (error) {
      toast.error('Failed to recalculate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // --- Header ---
    doc.setFillColor(63, 81, 181); // Indigo color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Student Performance Analysis", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30);

    // --- Student Profile ---
    let yPos = 55;
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Student Profile", 20, yPos);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const profileFields = [
        { label: "School", value: modifiedInput.school === 'GP' ? 'Gabriel Pereira' : 'Mousinho da Silveira' },
        { label: "Age", value: modifiedInput.age },
        { label: "Sex", value: modifiedInput.sex === 'F' ? 'Female' : 'Male' },
        { label: "Address", value: modifiedInput.address === 'U' ? 'Urban' : 'Rural' },
        { label: "Study Time", value: `${modifiedInput.studytime} (< ${(parseInt(modifiedInput.studytime) * 2.5)} hrs)` },
        { label: "Failures", value: modifiedInput.failures },
        { label: "Absences", value: modifiedInput.absences },
        { label: "Health", value: `${modifiedInput.health}/5` },
        { label: "Go Out", value: `${modifiedInput.goout}/5` },
        { label: "Alcohol (Workday)", value: `${modifiedInput.Dalc}/5` },
    ];

    // 2-column layout for profile
    profileFields.forEach((field, index) => {
        const xPos = index % 2 === 0 ? 20 : pageWidth / 2 + 10;
        const currentY = yPos + Math.floor(index / 2) * 10;
        
        doc.setFont("helvetica", "bold");
        doc.text(`${field.label}:`, xPos, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${field.value}`, xPos + 35, currentY);
    });

    yPos += Math.ceil(profileFields.length / 2) * 10 + 10;

    // --- Prediction Result ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Prediction Result", 20, yPos);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    
    yPos += 15;
    
    const isPass = currentPrediction.prediction === 1;
    const prob = (currentPrediction.probability * 100).toFixed(1);
    
    // Result Box
    doc.setFillColor(isPass ? 220 : 255, isPass ? 252 : 235, isPass ? 231 : 238); // Light Green or Light Red
    doc.setDrawColor(isPass ? 34 : 239, isPass ? 197 : 68, isPass ? 94 : 68); // Green or Red border
    doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, 'FD');
    
    doc.setFontSize(16);
    doc.setTextColor(isPass ? 21 : 185, isPass ? 128 : 28, isPass ? 61 : 28); // Dark Green or Dark Red
    doc.text(isPass ? "LIKELY TO PASS" : "AT RISK OF FAILURE", pageWidth / 2, yPos + 12, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Confidence Level: ${prob}%`, pageWidth / 2, yPos + 22, { align: 'center' });

    yPos += 45;

    // --- Key Drivers ---
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Key Influencing Factors", 20, yPos);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    if (sortedFeatures.length > 0) {
        const maxVal = sortedFeatures[0].value || 1;
        sortedFeatures.slice(0, 5).forEach((f, i) => {
            doc.text(`${i + 1}. ${f.name}`, 20, yPos);
            
            // Draw a simple bar
            const barWidth = (f.value / maxVal) * 80; // Normalize to max 80 width
            doc.setFillColor(100, 116, 139);
            doc.rect(60, yPos - 3, barWidth, 3, 'F');
            doc.text(`${f.value.toFixed(3)}`, 60 + barWidth + 5, yPos);
            
            yPos += 8;
        });
    } else {
        doc.text("No feature importance data available for this model.", 20, yPos);
        yPos += 10;
    }

    yPos += 10;

    // --- Recommendations ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Actionable Recommendations", 20, yPos);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const recs = getRecommendations();
    recs.forEach((rec) => {
        // Handle text wrapping
        const splitText = doc.splitTextToSize(`• ${rec}`, pageWidth - 40);
        doc.text(splitText, 20, yPos);
        yPos += (splitText.length * 6) + 2;
    });

    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Student Performance Predictor System", pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`Student_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // What-If Sliders for Numeric Fields
  const numericFields = ['age', 'failures', 'absences', 'G1', 'G2', 'studytime', 'freetime', 'goout', 'Dalc', 'Walc', 'health'];
  // Filter to only show fields that exist in inputData
  const availableNumericFields = numericFields.filter(f => inputData.hasOwnProperty(f));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Main Result Card */}
      <div className={`p-8 rounded-2xl text-white shadow-lg transition-all ${currentPrediction.prediction === 1 ? 'bg-gradient-to-r from-success to-emerald-600' : 'bg-gradient-to-r from-error to-red-600'}`}>
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold mb-2">{currentPrediction.prediction === 1 ? 'Likely to Pass' : 'At Risk of Failure'}</h2>
                <p className="text-white/90 text-lg">Confidence: {(currentPrediction.probability * 100).toFixed(1)}%</p>
            </div>
            {currentPrediction.prediction === 1 ? <CheckCircle className="w-16 h-16 text-white/80" /> : <AlertTriangle className="w-16 h-16 text-white/80" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Importance Chart */}
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-dark-text-primary">Key Drivers</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedFeatures} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F8FAFC' }} />
                        <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                            {sortedFeatures.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.originalValue > 0 ? '#10B981' : '#EF4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-4 text-center">Green: Positive Impact, Red: Negative Impact</p>
        </Card>

        {/* Recommendations */}
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-dark-text-primary">Actionable Insights</h3>
            <ul className="space-y-3">
                {getRecommendations().map((rec, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600 dark:text-dark-text-secondary bg-gray-50 dark:bg-dark-bg p-3 rounded-lg">
                        <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                        {rec}
                    </li>
                ))}
            </ul>
            <Button onClick={handleDownloadPDF} className="w-full mt-6 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Full Report
            </Button>
        </Card>
      </div>

      {/* What-If Analysis */}
      <Card className="p-6 border-t-4 border-primary">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">What-If Analysis</h3>
            </div>
            <Button onClick={handleRecalculate} disabled={loading} variant="outline" size="sm">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Simulate
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableNumericFields.map(field => (
                <div key={field} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <label className="font-medium text-gray-700 dark:text-dark-text-secondary capitalize">{field}</label>
                        <span className="text-primary font-bold">{modifiedInput[field]}</span>
                    </div>
                    <input 
                        type="range" 
                        min={field === 'absences' ? 0 : (field.includes('G') ? 0 : 1)} 
                        max={field === 'absences' ? 93 : (field.includes('G') ? 20 : 5)} 
                        value={modifiedInput[field] || 0} 
                        onChange={(e) => setModifiedInput({...modifiedInput, [field]: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 dark:bg-dark-lighter rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default PredictionReport;
