import React from 'react';
import { FileText, Zap, Target, Users, Star, Globe } from 'lucide-react';
import ResumeForm from './components/ResumeForm';
import { useResumeStore } from './store/resumeStore';

function App() {
  const { error, setError } = useResumeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Resume Builder</h1>
                <p className="text-sm text-gray-600">Generate ATS-optimized resumes with AI</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>95+ ATS Score</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4 text-green-500" />
                <span>Multilingual</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Professional Resumes That Get You Hired
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our AI-powered resume builder analyzes job requirements and creates ATS-optimized resumes 
            that score 95+ on applicant tracking systems. Support for English, Malayalam, and Manglish input.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS Optimized</h3>
              <p className="text-gray-600 text-sm">
                Get 95+ ATS compatibility scores with AI-optimized formatting and keyword matching
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI analyzes job descriptions and optimizes your resume content automatically
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multilingual</h3>
              <p className="text-gray-600 text-sm">
                Write in English, Malayalam, or Manglish - we'll optimize it for professional use
              </p>
            </div>
          </div>
        </div>

        {/* Resume Form */}
        <ResumeForm />
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 AI Resume Builder. Built with advanced AI technology for optimal ATS compatibility.
            </p>
            <p className="text-xs mt-2">
              Supports multilingual input and generates professional resumes with 95+ ATS scores.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;