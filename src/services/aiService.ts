import { ResumeData, JobRequirement, OptimizedResume } from '../types/resume';
import OpenAI from 'openai';

export class AIService {
  private static instance: AIService;
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Only for demo - use backend in production
    });
  }
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Mock OpenAI integration - replace with actual API calls in production
  async optimizeResume(resumeData: ResumeData, jobRequirement?: JobRequirement): Promise<OptimizedResume> {
    try {
      const optimizedContent = await this.realOpenAICall(resumeData, jobRequirement);
      
      return {
        ...resumeData,
        optimizedObjective: optimizedContent.objective,
        optimizedExperience: optimizedContent.experience,
        optimizedProjects: optimizedContent.projects,
        suggestedKeywords: optimizedContent.suggestedKeywords,
        atsScore: optimizedContent.atsScore,
      };
    } catch (error) {
      console.error('AI optimization error:', error);
      throw new Error('Failed to optimize resume with AI');
    }
  }

  private async realOpenAICall(resumeData: ResumeData, jobRequirement?: JobRequirement) {
    const prompt = await this.generateResumePrompt(resumeData, jobRequirement?.content || '');
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and ATS optimization specialist. Analyze the user's information and job requirements to create an optimized resume that will score 95+ on ATS systems."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    
    // Parse AI response and extract optimized content
    return this.parseAIResponse(aiResponse, resumeData, jobRequirement);
  }

  private parseAIResponse(aiResponse: string, resumeData: ResumeData, jobRequirement?: JobRequirement) {
    // Parse the AI response to extract optimized sections
    // This is a simplified version - you'd implement proper parsing logic
    const lines = aiResponse.split('\n');
    
    let optimizedObjective = resumeData.objective;
    let suggestedKeywords: string[] = [];
    
    // Extract optimized objective (look for "SUMMARY:" or similar)
    const summaryIndex = lines.findIndex(line => line.toLowerCase().includes('summary') || line.toLowerCase().includes('objective'));
    if (summaryIndex !== -1 && summaryIndex + 1 < lines.length) {
      optimizedObjective = lines[summaryIndex + 1].trim();
    }
    
    // Extract suggested keywords
    const keywordsIndex = lines.findIndex(line => line.toLowerCase().includes('keywords') || line.toLowerCase().includes('skills'));
    if (keywordsIndex !== -1 && keywordsIndex + 1 < lines.length) {
      suggestedKeywords = lines[keywordsIndex + 1].split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    
    return {
      objective: optimizedObjective,
      experience: this.optimizeExperience(resumeData.workExperience, jobRequirement?.extractedKeywords || []),
      projects: this.optimizeProjects(resumeData.projects, jobRequirement?.extractedKeywords || []),
      suggestedKeywords,
      atsScore: this.calculateATSScore(resumeData, jobRequirement),
    };
  }

  private async mockOpenAICall(resumeData: ResumeData, jobRequirement?: JobRequirement) {
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const jobKeywords = jobRequirement?.extractedKeywords || [];
    const userSkills = resumeData.skills;
    
    // Mock AI optimization logic
    const optimizedObjective = this.optimizeObjective(resumeData.objective, jobKeywords);
    const optimizedExperience = this.optimizeExperience(resumeData.workExperience, jobKeywords);
    const optimizedProjects = this.optimizeProjects(resumeData.projects, jobKeywords);
    const suggestedKeywords = this.generateSuggestedKeywords(userSkills, jobKeywords);
    const atsScore = this.calculateATSScore(resumeData, jobRequirement);

    return {
      objective: optimizedObjective,
      experience: optimizedExperience,
      projects: optimizedProjects,
      suggestedKeywords,
      atsScore,
    };
  }

  private optimizeObjective(objective: string, jobKeywords: string[]): string {
    if (!objective) return '';
    
    // Mock optimization: Add relevant keywords naturally
    let optimized = objective;
    
    jobKeywords.slice(0, 3).forEach(keyword => {
      if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
        optimized = optimized.replace(/\.$/, `, with expertise in ${keyword}.`);
      }
    });

    return optimized;
  }

  private optimizeExperience(experience: ResumeData['workExperience'], jobKeywords: string[]) {
    return experience.map(exp => ({
      ...exp,
      responsibilities: exp.responsibilities.map(resp => {
        // Add action verbs and quantify achievements
        let optimized = resp;
        
        if (!optimized.match(/^(Led|Managed|Developed|Implemented|Created|Built|Designed|Optimized)/)) {
          const actionVerbs = ['Developed', 'Implemented', 'Created', 'Built', 'Designed', 'Optimized'];
          const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
          optimized = `${randomVerb} ${optimized.charAt(0).toLowerCase() + optimized.slice(1)}`;
        }

        return optimized;
      }),
    }));
  }

  private optimizeProjects(projects: ResumeData['projects'], jobKeywords: string[]) {
    return projects.map(project => ({
      ...project,
      description: this.addRelevantKeywords(project.description, jobKeywords),
    }));
  }

  private addRelevantKeywords(text: string, keywords: string[]): string {
    let optimized = text;
    const relevantKeywords = keywords.filter(keyword => 
      !text.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 2);

    if (relevantKeywords.length > 0) {
      optimized += ` Technologies used: ${relevantKeywords.join(', ')}.`;
    }

    return optimized;
  }

  private generateSuggestedKeywords(userSkills: string[], jobKeywords: string[]): string[] {
    const suggested = jobKeywords.filter(keyword => 
      !userSkills.some(skill => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    return suggested.slice(0, 10);
  }

  private calculateATSScore(resumeData: ResumeData, jobRequirement?: JobRequirement): number {
    let score = 60; // Base score

    // Check for required sections
    if (resumeData.personalInfo.email) score += 5;
    if (resumeData.personalInfo.phone) score += 5;
    if (resumeData.objective) score += 10;
    if (resumeData.skills.length > 0) score += 10;
    if (resumeData.workExperience.length > 0) score += 10;

    // Keyword matching
    if (jobRequirement) {
      const userText = [
        resumeData.objective,
        ...resumeData.skills,
        ...resumeData.workExperience.flatMap(exp => exp.responsibilities),
        ...resumeData.projects.map(proj => proj.description),
      ].join(' ').toLowerCase();

      const matchedKeywords = jobRequirement.extractedKeywords.filter(keyword =>
        userText.includes(keyword.toLowerCase())
      );

      const keywordScore = Math.min(20, (matchedKeywords.length / jobRequirement.extractedKeywords.length) * 20);
      score += keywordScore;
    }

    return Math.min(100, Math.round(score));
  }

  // Generate resume content using AI prompts
  async generateResumePrompt(resumeData: ResumeData, jobDescription: string = ''): Promise<string> {
    return `
You are an expert resume writer and ATS optimization specialist. Create an optimized resume that will score 95+ on ATS systems.

Job Description:
${jobDescription}

User's Information:
- Name: ${resumeData.personalInfo.fullName}
- Objective: ${resumeData.objective}
- Skills: ${resumeData.skills.join(', ')}
- Experience: ${resumeData.workExperience.map(exp => `${exp.role} at ${exp.company}`).join(', ')}

Requirements:
1. Optimize the objective/summary to match job requirements
2. Enhance work experience descriptions with strong action verbs and quantified achievements
3. Align skills and keywords with job description
4. Ensure ATS-friendly formatting
5. Maintain professional tone and clarity
6. Include relevant industry keywords naturally
7. Optimize for the specific role and company

Please provide:
1. Optimized professional summary
2. Enhanced experience descriptions
3. Suggested additional skills/keywords
4. ATS optimization recommendations
`;
  }
}

export const aiService = AIService.getInstance();