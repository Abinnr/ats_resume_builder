import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { translationService } from '../services/translationService';

const PersonalInfoForm: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;

  const handleInputChange = async (field: keyof typeof personalInfo, value: string) => {
    // Translate input to English if needed
    const translatedValue = field === 'fullName' ? 
      await translationService.translateToEnglish(value) : value;
    
    updatePersonalInfo({ [field]: translatedValue });
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name (English/Malayalam/Manglish supported)"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClasses}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Address
          </label>
          <input
            type="text"
            value={personalInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="City, State, Country"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Linkedin className="w-4 h-4 inline mr-1" />
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={personalInfo.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Github className="w-4 h-4 inline mr-1" />
            GitHub Profile
          </label>
          <input
            type="url"
            value={personalInfo.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
            placeholder="https://github.com/yourusername"
            className={inputClasses}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Portfolio Website
          </label>
          <input
            type="url"
            value={personalInfo.portfolio}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            placeholder="https://yourportfolio.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Multilingual Support:</strong> You can type in English, Malayalam, or Manglish. 
          The system will automatically translate and format your input for optimal ATS compatibility.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;