import React, { useState } from 'react';
import { Wand2, Download, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { aiService } from '../services/aiService';
import { pdfService } from '../services/pdfService';

const ResumeGenerator: React.FC = () => {
  const { 
    resumeData, 
    jobRequirement, 
    optimizedResume, 
    setOptimizedResume, 
    setLoading, 
    setError,
    isLoading 
  } = useResumeStore();
  
  const [generationStep, setGenerationStep] = useState<'idle' | 'analyzing' | 'optimizing' | 'complete'>('idle');

  const isFormValid = () => {
    return (
      resumeData.personalInfo.fullName &&
      resumeData.personalInfo.email &&
      resumeData.personalInfo.phone &&
      resumeData.objective &&
      resumeData.skills.length > 0
    );
  };

  const handleGenerateResume = async () => {
    if (!isFormValid()) {
      setError('Please fill in all required fields before generating resume');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setGenerationStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis

      setGenerationStep('optimizing');
      const optimized = await aiService.optimizeResume(resumeData, jobRequirement || undefined);
      
      setOptimizedResume(optimized);
      setGenerationStep('complete');
    } catch (error) {
      console.error('Resume generation failed:', error);
      setError('Failed to generate optimized resume. Please try again.');
      setGenerationStep('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!optimizedResume) return;

    try {
      setLoading(true);
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      await pdfService.downloadPDF(optimizedResume, filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getATSScoreLabel = (score: number) => {
    if (score >= 95) return 'Excellent - ATS Optimized';
    if (score >= 85) return 'Very Good - Minor improvements possible';
    if (score >= 75) return 'Good - Some optimization needed';
    return 'Needs Improvement - Significant optimization required';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <Wand2 className="w-5 h-5 mr-2 text-blue-600" />
        AI Resume Generator
      </h3>

      {/* Generation Status */}
      {generationStep !== 'idle' && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            {generationStep !== 'complete' && (
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            )}
            {generationStep === 'complete' && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            <div>
              <p className="text-sm font-medium text-blue-800">
                {generationStep === 'analyzing' && 'Analyzing job requirements...'}
                {generationStep === 'optimizing' && 'Optimizing resume with AI...'}
                {generationStep === 'complete' && 'Resume optimization complete!'}
              </p>
              {generationStep !== 'complete' && (
                <p className="text-xs text-blue-600">This may take a few moments</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Validation Status */}
      {!isFormValid() && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 mb-2">
                Please complete the following required fields:
              </p>
              <ul className="text-sm text-red-700 list-disc pl-5 space-y-1">
                {!resumeData.personalInfo.fullName && <li>Full Name</li>}
                {!resumeData.personalInfo.email && <li>Email Address</li>}
                {!resumeData.personalInfo.phone && <li>Phone Number</li>}
                {!resumeData.objective && <li>Professional Objective</li>}
                {resumeData.skills.length === 0 && <li>At least one skill</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="space-y-4">
        <button
          onClick={handleGenerateResume}
          disabled={!isFormValid() || isLoading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
          <span>
            {isLoading ? 'Generating...' : 'Generate AI-Optimized Resume'}
          </span>
        </button>

        {jobRequirement && (
          <p className="text-sm text-center text-gray-600">
            Optimizing for the uploaded job requirements
          </p>
        )}
      </div>

      {/* Optimized Resume Results */}
      {optimizedResume && (
        <div className="mt-8 space-y-6">
          {/* ATS Score */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">ATS Compatibility Score</h4>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className={`text-2xl font-bold ${getATSScoreColor(optimizedResume.atsScore)}`}>
                  {optimizedResume.atsScore}%
                </span>
              </div>
            </div>
            <p className={`text-sm font-medium ${getATSScoreColor(optimizedResume.atsScore)}`}>
              {getATSScoreLabel(optimizedResume.atsScore)}
            </p>
            
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  optimizedResume.atsScore >= 90 ? 'bg-green-500' :
                  optimizedResume.atsScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${optimizedResume.atsScore}%` }}
              />
            </div>
          </div>

          {/* Suggested Keywords */}
          {optimizedResume.suggestedKeywords.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3">
                💡 Suggested Keywords to Include:
              </h4>
              <div className="flex flex-wrap gap-2">
                {optimizedResume.suggestedKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-white border border-green-300 text-green-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>
              {isLoading ? 'Generating PDF...' : 'Download Optimized Resume PDF'}
            </span>
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">
           Maximize Your ATS Score:
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-5">
          <li>Upload a job description to get personalized optimization</li>
          <li>Include relevant keywords naturally in your content</li>
          <li>Use standard section headings and bullet points</li>
          <li>Quantify achievements with numbers and percentages</li>
          <li>Keep formatting simple and ATS-friendly</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeGenerator;