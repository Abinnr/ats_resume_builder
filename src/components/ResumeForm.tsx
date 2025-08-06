import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Upload, User, Target, Code, Briefcase, FolderOpen, Award, Globe } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import ObjectiveForm from './ObjectiveForm';
import SkillsForm from './SkillsForm';
import FileUpload from './FileUpload';
import ResumeGenerator from './ResumeGenerator';

const steps = [
  { id: 'upload', title: 'Job Requirements', icon: Upload, component: FileUpload },
  { id: 'personal', title: 'Personal Info', icon: User, component: PersonalInfoForm },
  { id: 'objective', title: 'Objective', icon: Target, component: ObjectiveForm },
  { id: 'skills', title: 'Skills', icon: Code, component: SkillsForm },
  { id: 'generate', title: 'Generate Resume', icon: FileText, component: ResumeGenerator },
];

const ResumeForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <CurrentComponent />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-600'
                  : index < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${
            currentStep === steps.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;