import React, { useState } from 'react';
import { Target, Lightbulb } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { translationService } from '../services/translationService';

const ObjectiveForm: React.FC = () => {
  const { resumeData, updateObjective, jobRequirement } = useResumeStore();
  const [isTranslating, setIsTranslating] = useState(false);

  const handleObjectiveChange = async (value: string) => {
    setIsTranslating(true);
    try {
      const translatedObjective = await translationService.translateToEnglish(value);
      updateObjective(translatedObjective);
    } catch (error) {
      updateObjective(value);
    } finally {
      setIsTranslating(false);
    }
  };

  const getSuggestedObjectives = () => {
    if (!jobRequirement) return [];
    
    const jobKeywords = jobRequirement.extractedKeywords.slice(0, 3);
    return [
      `Results-driven professional seeking to leverage expertise in ${jobKeywords.join(', ')} to contribute to innovative projects and organizational growth.`,
      `Experienced developer passionate about ${jobKeywords[0]} with a proven track record of delivering high-quality solutions in ${jobKeywords[1]} environments.`,
      `Goal-oriented professional with strong background in ${jobKeywords.join(' and ')} looking to apply analytical skills and technical expertise in a challenging role.`
    ];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <Target className="w-5 h-5 mr-2 text-blue-600" />
        Professional Objective / Summary
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary *
          </label>
          <textarea
            value={resumeData.objective}
            onChange={(e) => handleObjectiveChange(e.target.value)}
            placeholder="Write a compelling professional summary that highlights your key strengths and career goals. You can write in English, Malayalam, or Manglish."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            rows={6}
            required
          />
          {isTranslating && (
            <div className="flex items-center mt-2 text-sm text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
              Translating and optimizing...
            </div>
          )}
        </div>

        {jobRequirement && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              AI-Generated Suggestions (Based on Job Requirements)
            </h4>
            <div className="space-y-3">
              {getSuggestedObjectives().map((suggestion, index) => (
                <div key={index} className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                  <button
                    onClick={() => handleObjectiveChange(suggestion)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Use this suggestion
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            💡 Writing Tips for ATS Optimization:
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-5">
            <li>Keep it concise (3-4 sentences, 50-100 words)</li>
            <li>Include relevant keywords from the job description</li>
            <li>Highlight your key achievements and skills</li>
            <li>Use action-oriented language</li>
            <li>Tailor it to the specific role you're applying for</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveForm;