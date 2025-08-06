import { create } from 'zustand';
import { ResumeData, JobRequirement, OptimizedResume } from '../types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  jobRequirement: JobRequirement | null;
  optimizedResume: OptimizedResume | null;
  isLoading: boolean;
  error: string | null;
  
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateObjective: (objective: string) => void;
  updateEducation: (education: ResumeData['education']) => void;
  updateSkills: (skills: string[]) => void;
  updateWorkExperience: (experience: ResumeData['workExperience']) => void;
  updateProjects: (projects: ResumeData['projects']) => void;
  updateCertifications: (certifications: ResumeData['certifications']) => void;
  updateLanguages: (languages: string[]) => void;
  updateKeywords: (keywords: string[]) => void;
  updateResumeStyle: (style: ResumeData['resumeStyle']) => void;
  
  setJobRequirement: (requirement: JobRequirement) => void;
  setOptimizedResume: (resume: OptimizedResume) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  resetResume: () => void;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: '',
    github: '',
  },
  objective: '',
  education: [],
  skills: [],
  workExperience: [],
  projects: [],
  certifications: [],
  languages: [],
  keywords: [],
  resumeStyle: 'modern',
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumeData: initialResumeData,
  jobRequirement: null,
  optimizedResume: null,
  isLoading: false,
  error: null,

  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
    })),

  updateObjective: (objective) =>
    set((state) => ({
      resumeData: { ...state.resumeData, objective },
    })),

  updateEducation: (education) =>
    set((state) => ({
      resumeData: { ...state.resumeData, education },
    })),

  updateSkills: (skills) =>
    set((state) => ({
      resumeData: { ...state.resumeData, skills },
    })),

  updateWorkExperience: (workExperience) =>
    set((state) => ({
      resumeData: { ...state.resumeData, workExperience },
    })),

  updateProjects: (projects) =>
    set((state) => ({
      resumeData: { ...state.resumeData, projects },
    })),

  updateCertifications: (certifications) =>
    set((state) => ({
      resumeData: { ...state.resumeData, certifications },
    })),

  updateLanguages: (languages) =>
    set((state) => ({
      resumeData: { ...state.resumeData, languages },
    })),

  updateKeywords: (keywords) =>
    set((state) => ({
      resumeData: { ...state.resumeData, keywords },
    })),

  updateResumeStyle: (resumeStyle) =>
    set((state) => ({
      resumeData: { ...state.resumeData, resumeStyle },
    })),

  setJobRequirement: (requirement) => set({ jobRequirement: requirement }),
  setOptimizedResume: (resume) => set({ optimizedResume: resume }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  resetResume: () =>
    set({
      resumeData: initialResumeData,
      jobRequirement: null,
      optimizedResume: null,
      error: null,
    }),
}));