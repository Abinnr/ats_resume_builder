import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { ocrService } from '../services/ocrService';
import { translationService } from '../services/translationService';
import { useResumeStore } from '../store/resumeStore';

const FileUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [extractedText, setExtractedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const { setJobRequirement, setLoading, setError: setStoreError } = useResumeStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus('uploading');
    setError('');
    setLoading(true);

    try {
      let extractedContent = '';

      if (file.type.startsWith('image/')) {
        extractedContent = await ocrService.extractTextFromImage(file);
      } else if (file.type === 'application/pdf') {
        extractedContent = await ocrService.extractTextFromPDF(file);
      } else {
        throw new Error('Unsupported file type. Please upload an image or PDF.');
      }

      // Translate content to English if needed
      const translatedContent = await translationService.translateToEnglish(extractedContent);
      setExtractedText(translatedContent);

      // Extract job requirements
      const requirements = ocrService.extractJobRequirements(translatedContent);
      
      const jobRequirement = {
        content: translatedContent,
        extractedKeywords: requirements.keywords,
        requiredSkills: requirements.skills,
      };

      setJobRequirement(jobRequirement);
      setUploadStatus('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      setStoreError(errorMessage);
      setUploadStatus('error');
    } finally {
      setLoading(false);
    }
  }, [setJobRequirement, setLoading, setStoreError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: uploadStatus === 'uploading',
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing job description...';
      case 'success':
        return 'Job description processed successfully!';
      case 'error':
        return error || 'Failed to process file';
      default:
        return 'Upload job description (PDF or image)';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Job Description Upload
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload the job description or requirement letter to optimize your resume for ATS compatibility.
          Supports PDF files and images in multiple languages.
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            
            <div className="text-center">
              <p className={`text-sm font-medium ${
                uploadStatus === 'error' ? 'text-red-600' : 
                uploadStatus === 'success' ? 'text-green-600' : 'text-gray-700'
              }`}>
                {getStatusMessage()}
              </p>
              
              {uploadStatus === 'idle' && (
                <p className="text-xs text-gray-500 mt-2">
                  Drag & drop or click to select • PDF, JPG, PNG supported
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </div>
              <div className="flex items-center space-x-1">
                <Image className="w-4 h-4" />
                <span>Images</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {extractedText && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-md font-semibold mb-3 text-gray-800">
            Extracted Job Description
          </h4>
          <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {extractedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;