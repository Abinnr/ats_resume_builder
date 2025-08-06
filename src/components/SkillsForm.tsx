import React, { useState } from 'react';
import { Code, Plus, X, Zap } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { translationService } from '../services/translationService';

const SkillsForm: React.FC = () => {
  const { resumeData, updateSkills, jobRequirement, optimizedResume } = useResumeStore();
  const [skillInput, setSkillInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddSkills = async () => {
    if (!skillInput.trim()) return;
    
    setIsProcessing(true);
    try {
      const processedSkills = await translationService.processSkills(skillInput);
      const updatedSkills = [...new Set([...resumeData.skills, ...processedSkills])];
      updateSkills(updatedSkills);
      setSkillInput('');
    } catch (error) {
      console.error('Error processing skills:', error);
      // Fallback: add skills as-is
      const simpleSkills = skillInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const updatedSkills = [...new Set([...resumeData.skills, ...simpleSkills])];
      updateSkills(updatedSkills);
      setSkillInput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkills();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = resumeData.skills.filter(skill => skill !== skillToRemove);
    updateSkills(updatedSkills);
  };

  const addSuggestedSkill = (skill: string) => {
    if (!resumeData.skills.includes(skill)) {
      updateSkills([...resumeData.skills, skill]);
    }
  };

  const getSuggestedSkills = () => {
    const suggestions: string[] = [];
    
    // Add skills from job requirements that user doesn't have
    if (jobRequirement?.requiredSkills) {
      jobRequirement.requiredSkills.forEach(skill => {
        if (!resumeData.skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )) {
          suggestions.push(skill);
        }
      });
    }

    // Add AI-suggested keywords
    if (optimizedResume?.suggestedKeywords) {
      optimizedResume.suggestedKeywords.forEach(keyword => {
        if (!resumeData.skills.some(skill => 
          skill.toLowerCase().includes(keyword.toLowerCase())
        ) && !suggestions.includes(keyword)) {
          suggestions.push(keyword);
        }
      });
    }

    return suggestions.slice(0, 10);
  };

  const getSkillCategories = () => {
    const categories: { [key: string]: string[] } = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Databases': [],
      'Other Skills': []
    };

    const programmingKeywords = ['javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'];
    const frameworkKeywords = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel'];
    const toolKeywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'webpack', 'npm'];
    const databaseKeywords = ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite'];

    resumeData.skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      
      if (programmingKeywords.some(lang => lowerSkill.includes(lang))) {
        categories['Programming Languages'].push(skill);
      } else if (frameworkKeywords.some(fw => lowerSkill.includes(fw))) {
        categories['Frameworks & Libraries'].push(skill);
      } else if (toolKeywords.some(tool => lowerSkill.includes(tool))) {
        categories['Tools & Technologies'].push(skill);
      } else if (databaseKeywords.some(db => lowerSkill.includes(db))) {
        categories['Databases'].push(skill);
      } else {
        categories['Other Skills'].push(skill);
      }
    });

    return categories;
  };

  const skillCategories = getSkillCategories();
  const suggestedSkills = getSuggestedSkills();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        <Code className="w-5 h-5 mr-2 text-blue-600" />
        Skills & Competencies
      </h3>

      {/* Add Skills Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Skills (comma-separated)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., JavaScript, React, Node.js, Python (English/Malayalam/Manglish supported)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <button
            onClick={handleAddSkills}
            disabled={isProcessing || !skillInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {isProcessing ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Current Skills by Category */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6 space-y-4">
          {Object.entries(skillCategories).map(([category, skills]) => 
            skills.length > 0 && (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm group hover:bg-blue-200 transition-colors"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Suggested Skills (Based on Job Requirements)
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSuggestedSkill(skill)}
                className="inline-flex items-center px-3 py-1 bg-white border border-green-300 text-green-700 rounded-full text-sm hover:bg-green-50 hover:border-green-400 transition-colors"
              >
                <Plus className="w-3 h-3 mr-1" />
                {skill}
              </button>
            ))}
          </div>
          <p className="text-xs text-green-600 mt-2">
            Click on a skill to add it to your resume
          </p>
        </div>
      )}

      {/* Skills Tips */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">
          💡 Skills Optimization Tips:
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-5">
          <li>Include both hard skills (technical) and soft skills (communication, leadership)</li>
          <li>Match skills with job requirements for better ATS scoring</li>
          <li>Use industry-standard terminology</li>
          <li>Organize skills by proficiency level or category</li>
          <li>Include relevant certifications as skills</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;