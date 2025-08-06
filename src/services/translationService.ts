// Mock translation service - In production, integrate with Google Translate API
export class TranslationService {
  private static instance: TranslationService;
  
  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Detect if text contains Malayalam or mixed language (Manglish)
  detectLanguage(text: string): 'english' | 'malayalam' | 'manglish' {
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    const englishPattern = /[a-zA-Z]/;
    
    const hasMalayalam = malayalamPattern.test(text);
    const hasEnglish = englishPattern.test(text);
    
    if (hasMalayalam && hasEnglish) {
      return 'manglish';
    } else if (hasMalayalam) {
      return 'malayalam';
    }
    return 'english';
  }

  // Translate text to English
  async translateToEnglish(text: string): Promise<string> {
    const language = this.detectLanguage(text);
    
    if (language === 'english') {
      return text;
    }

    // In production, implement Google Translate API integration
    // For now, return the original text with a note
    if (language === 'malayalam') {
      // Mock translation - replace with actual API call
      return this.mockTranslateMalayalam(text);
    }
    
    if (language === 'manglish') {
      // Mock translation for mixed content
      return this.mockTranslateManglish(text);
    }

    return text;
  }

  private mockTranslateMalayalam(text: string): string {
    // Basic mock translations for common Malayalam terms
    const translations: { [key: string]: string } = {
      'സോഫ്റ്റ്‌വെയർ ഡെവലപ്പർ': 'Software Developer',
      'കമ്പ്യൂട്ടർ സയൻസ്': 'Computer Science',
      'പ്രോജക്റ്റ്': 'Project',
      'സ്കിൽസ്': 'Skills',
      'അനുഭവം': 'Experience',
    };

    let translatedText = text;
    Object.entries(translations).forEach(([malayalam, english]) => {
      translatedText = translatedText.replace(new RegExp(malayalam, 'g'), english);
    });

    return translatedText;
  }

  private mockTranslateManglish(text: string): string {
    // Handle common Manglish patterns
    return text
      .replace(/\bavam\b/g, 'them')
      .replace(/\bengane\b/g, 'like this')
      .replace(/\bnithan\b/g, 'you')
      .replace(/\bentha\b/g, 'what');
  }

  // Extract and translate skills, ensuring proper English formatting
  async processSkills(skillsText: string): Promise<string[]> {
    const translatedText = await this.translateToEnglish(skillsText);
    
    return translatedText
      .split(/[,\n\r\t]+/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .map(skill => this.capitalizeFirstLetter(skill));
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}

export const translationService = TranslationService.getInstance();