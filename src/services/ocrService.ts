import Tesseract from 'tesseract.js';

export class OCRService {
  private static instance: OCRService;
  
  static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  async extractTextFromImage(file: File): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      return this.cleanExtractedText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // For PDF text extraction, you'd typically use pdf-parse or similar
          // For now, we'll convert to text using a mock implementation
          const text = await this.mockPDFExtraction(uint8Array);
          resolve(this.cleanExtractedText(text));
        } catch (error) {
          reject(new Error('Failed to extract text from PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private mockPDFExtraction(uint8Array: Uint8Array): Promise<string> {
    // In production, implement proper PDF text extraction
    // For now, return a mock response
    return Promise.resolve('Mock PDF text extraction - implement pdf-parse or similar library');
  }

  private cleanExtractedText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }

  // Extract key information from job description
  extractJobRequirements(text: string): {
    skills: string[];
    experience: string[];
    qualifications: string[];
    keywords: string[];
  } {
    const lowerText = text.toLowerCase();
    
    // Extract skills (common patterns)
    const skillPatterns = [
      /(?:skills?|technologies?|tools?)[:\-]?\s*([^.!?\n]+)/gi,
      /(?:experience in|proficiency in|knowledge of)[:\-]?\s*([^.!?\n]+)/gi,
      /(?:required|preferred)[:\-]?\s*([^.!?\n]+)/gi,
    ];
    
    const skills: string[] = [];
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const extracted = match.replace(pattern, '$1').trim();
          skills.push(...this.parseSkillsList(extracted));
        });
      }
    });

    // Extract experience requirements
    const experiencePatterns = [
      /(\d+[\+\-\s]*(?:years?|yrs?))[^.!?\n]*/gi,
      /(?:minimum|at least|minimum of)\s*(\d+[^.!?\n]*)/gi,
    ];
    
    const experience: string[] = [];
    experiencePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        experience.push(...matches.map(match => match.trim()));
      }
    });

    // Extract qualifications
    const qualificationPatterns = [
      /(?:degree|bachelor|master|phd|certification)[^.!?\n]*/gi,
      /(?:qualified|education|academic)[^.!?\n]*/gi,
    ];
    
    const qualifications: string[] = [];
    qualificationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        qualifications.push(...matches.map(match => match.trim()));
      }
    });

    // Extract general keywords (important terms)
    const keywords = this.extractKeywords(text);

    return {
      skills: [...new Set(skills)].filter(s => s.length > 2),
      experience: [...new Set(experience)],
      qualifications: [...new Set(qualifications)],
      keywords: [...new Set(keywords)],
    };
  }

  private parseSkillsList(text: string): string[] {
    return text
      .split(/[,;|&\n\r\t]+/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1)
      .map(skill => skill.replace(/^\W+|\W+$/g, ''));
  }

  private extractKeywords(text: string): string[] {
    // Extract important technical and business keywords
    const keywords: string[] = [];
    const commonKeywords = [
      'javascript', 'typescript', 'react', 'node', 'python', 'java', 'aws', 'docker',
      'kubernetes', 'api', 'database', 'sql', 'mongodb', 'git', 'agile', 'scrum',
      'ci/cd', 'testing', 'security', 'performance', 'scalability', 'microservices',
      'leadership', 'team', 'project', 'management', 'communication', 'problem-solving'
    ];

    const lowerText = text.toLowerCase();
    commonKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    return keywords;
  }
}

export const ocrService = OCRService.getInstance();