import jsPDF from 'jspdf';
import { OptimizedResume } from '../types/resume';

export class PDFService {
  private static instance: PDFService;
  
  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  async generateResumePDF(resumeData: OptimizedResume): Promise<Blob> {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Set up fonts and styles
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    // Header - Personal Information
    doc.text(resumeData.personalInfo.fullName, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const contactInfo = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.address
    ].filter(Boolean).join(' | ');
    
    doc.text(contactInfo, 20, yPosition);
    yPosition += 15;

    // Professional Summary
    if (resumeData.optimizedObjective) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = this.splitText(doc, resumeData.optimizedObjective, 170);
      summaryLines.forEach(line => {
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    // Skills
    if (resumeData.skills.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CORE COMPETENCIES', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const skillsText = resumeData.skills.join(' • ');
      const skillLines = this.splitText(doc, skillsText, 170);
      skillLines.forEach(line => {
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    // Work Experience
    if (resumeData.optimizedExperience.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL EXPERIENCE', 20, yPosition);
      yPosition += 8;

      resumeData.optimizedExperience.forEach(exp => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${exp.role} | ${exp.company}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(exp.duration, 20, yPosition);
        yPosition += 6;
        
        doc.setFont('helvetica', 'normal');
        exp.responsibilities.forEach(resp => {
          const bulletText = `• ${resp}`;
          const bulletLines = this.splitText(doc, bulletText, 170);
          bulletLines.forEach(line => {
            doc.text(line, 25, yPosition);
            yPosition += 5;
          });
        });
        yPosition += 5;
      });
    }

    // Projects
    if (resumeData.optimizedProjects.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('KEY PROJECTS', 20, yPosition);
      yPosition += 8;

      resumeData.optimizedProjects.forEach(project => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(project.title, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const descriptionLines = this.splitText(doc, project.description, 170);
        descriptionLines.forEach(line => {
          doc.text(line, 20, yPosition);
          yPosition += 5;
        });
        
        if (project.techStack.length > 0) {
          doc.setFont('helvetica', 'italic');
          doc.text(`Technologies: ${project.techStack.join(', ')}`, 20, yPosition);
          yPosition += 5;
        }
        yPosition += 3;
      });
    }

    // Education
    if (resumeData.education.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', 20, yPosition);
      yPosition += 8;

      resumeData.education.forEach(edu => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${edu.course} | ${edu.institution}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(edu.year, 20, yPosition);
        yPosition += 8;
      });
    }

    return doc.output('blob');
  }

  private splitText(doc: jsPDF, text: string, maxWidth: number): string[] {
    return doc.splitTextToSize(text, maxWidth);
  }

  async downloadPDF(resumeData: OptimizedResume, filename: string = 'resume.pdf'): Promise<void> {
    const blob = await this.generateResumePDF(resumeData);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

export const pdfService = PDFService.getInstance();