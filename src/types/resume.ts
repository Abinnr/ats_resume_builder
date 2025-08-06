export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  duration?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  objective: string;
  education: Education[];
  skills: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  certifications: Certification[];
  languages: string[];
  keywords: string[];
  resumeStyle: 'modern' | 'classic' | 'minimal';
}

export interface JobRequirement {
  content: string;
  extractedKeywords: string[];
  requiredSkills: string[];
}

export interface OptimizedResume extends ResumeData {
  optimizedObjective: string;
  optimizedExperience: WorkExperience[];
  optimizedProjects: Project[];
  suggestedKeywords: string[];
  atsScore: number;
}