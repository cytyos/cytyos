import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Language } from '../stores/settingsStore';
import { getTranslation } from '../utils/i18n';

interface ProjectData {
  terrainArea: number;
  totalBuiltArea: number;
  coefficientCA: number;
  volumetriaBlocks: Array<{ id: string; name: string; height: number; setback: number }>;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  aproveitamentoRealizado: number;
  landValue: number;
  constructionCostPerSqm: number;
  saleValuePerSqm: number;
  currency: string;
  unitSystem: 'metric' | 'imperial';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const generateReport = (
  mapInstance: any,
  projectData: ProjectData,
  language: Language = 'en',
  chatMessages?: ChatMessage[]
) => {
  const t = (key: string) => getTranslation(language, key as any);
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;

  // --- HEADER BACKGROUND ---
  doc.setFillColor(15, 23, 42); // Dark Blue Theme
  doc.rect(0, 0, pageWidth, 50, 'F');

  // --- LOGO / BRANDING ---
  doc.setFontSize(32);
  doc.setTextColor(6, 182, 212); // Cyan
  doc.setFont('helvetica', 'bold');
  doc.text('CYTYOS', margin, 25);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Gray
  doc.setFont('helvetica', 'normal');
  doc.text('INTELLIGENCE', margin, 33);

  // --- DATE ---
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-ES',
    fr: 'fr-FR',
    zh: 'zh-CN',
  };
  const today = new Date().toLocaleDateString(localeMap[language] || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(today.toUpperCase(), pageWidth - margin, 25, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(t('pdf_header_confidential'), pageWidth - margin, 31, { align: 'right' });

  // --- WATERMARK ---
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  const watermarkText = 'CONFIDENTIAL';
  const textWidth = doc.getTextWidth(watermarkText);
  
  // Safe graphics state
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.text(watermarkText, (pageWidth - textWidth) / 2, pageHeight / 2, {
    angle: 45,
    align: 'center',
  });
  doc.restoreGraphicsState();

  currentY = 60;

  // --- MAP IMAGE ---
  if (mapInstance && mapInstance.getCanvas) {
    try {
      const mapCanvas = mapInstance.getCanvas();
      const mapImageData = mapCanvas.toDataURL('image/png');

      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = 80;
      doc.addImage(mapImageData, 'PNG', margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    } catch (error) {
      console.error('Failed to capture map image:', error);
    }
  }

  // --- REPORT TITLE ---
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 12, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_title').toUpperCase(), margin + 5, currentY + 8);
  currentY += 20;

  // Check Page Break
  if (currentY > pageHeight - 80) {
    doc.addPage();
    currentY = margin;
  }

  // --- SECTION: PROJECT DATA ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_project_data'), margin, currentY);
  currentY += 10;

  const formatArea = (area: number, unitSystem: 'metric' | 'imperial') => {
    if (unitSystem === 'imperial') {
      const sqft = area * 10.764;
      return `${sqft.toLocaleString('en-US', { maximumFractionDigits: 0 })} ft²`;
    }
    return `${area.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} m²`;
  };

  const projectTableData = [
    [t('pdf_lbl_land_area'), formatArea(projectData.terrainArea, projectData.unitSystem)],
    [t('pdf_lbl_built_area'), formatArea(projectData.totalBuiltArea, projectData.unitSystem)],
    [t('pdf_lbl_coefficient_max'), `${projectData.coefficientCA.toFixed(2)}x`],
    [t('pdf_lbl_coefficient_used'), `${projectData.aproveitamentoRealizado.toFixed(2)}x`],
    [t('pdf_lbl_num_blocks'), projectData.volumetriaBlocks.length.toString()],
    [
      t('pdf_lbl_total_height'),
      `${projectData.volumetriaBlocks.reduce((sum, b) => sum + b.height, 0).toFixed(0)}m`,
    ],
    [
      t('pdf_lbl_estimated_floors'),
      Math.floor(projectData.volumetriaBlocks.reduce((sum, b) => sum + b.height, 0) / 3).toString(),
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [[t('pdf_table_parameter'), t('pdf_table_value')]],
    body: projectTableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  if (currentY > pageHeight - 100) {
    doc.addPage();
    currentY = margin;
  }

  // --- SECTION: AI EXECUTIVE SUMMARY ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_executive_summary'), margin, currentY);
  currentY += 8;

  // Extract text from chat history
  const lastAssistantMessage = chatMessages
    ?.filter((msg) => msg.role === 'assistant')
    .pop();

  let analysisText = '';
  if (lastAssistantMessage && lastAssistantMessage.content.trim().length > 50) {
    // Clean up Markdown artifacts for PDF text (simple removal of * and #)
    analysisText = lastAssistantMessage.content.replace(/[*#]/g, '').substring(0, 1200); 
  } else {
    const fallbackTemplate = t('pdf_fallback_summary');
    analysisText = fallbackTemplate
      .replace('{used}', projectData.aproveitamentoRealizado.toFixed(2))
      .replace('{max}', projectData.coefficientCA.toFixed(2))
      .replace('{margin}', projectData.profitMargin.toFixed(1));
  }

  // Text Box Background
  doc.setFillColor(248, 250, 252);
  const textPadding = 5;
  const splitText = doc.splitTextToSize(analysisText, pageWidth - 2 * margin - 2 * textPadding);
  const textHeight = splitText.length * 5 + 2 * textPadding;
  doc.rect(margin, currentY, pageWidth - 2 * margin, textHeight, 'F');

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(splitText, margin + textPadding, currentY + textPadding + 4);
  currentY += textHeight + 12;

  // --- SECTION: FINANCIALS ---
  if (currentY > pageHeight - 80) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_financial'), margin, currentY);
  currentY += 10;

  const formatCurrency = (value: number, currency: string) => {
    const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[currency] || '$';
    return `${symbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const financialTableData = [
    [t('pdf_lbl_land_value'), formatCurrency(projectData.landValue, projectData.currency)],
    [t('pdf_lbl_construction_cost'), formatCurrency(projectData.constructionCostPerSqm, projectData.currency)],
    [t('pdf_lbl_sale_value'), formatCurrency(projectData.saleValuePerSqm, projectData.currency)],
    [t('pdf_lbl_total_construction_cost'), formatCurrency(projectData.totalCost, projectData.currency)],
    [t('pdf_lbl_total_revenue'), formatCurrency(projectData.totalRevenue, projectData.currency)],
    [t('pdf_lbl_profit_margin'), `${projectData.profitMargin.toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [[t('pdf_table_item'), t('pdf_table_value')]],
    body: financialTableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    margin: { left: margin, right: margin },
  });

  // --- FOOTER ---
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const footerY = pageHeight - 15;
  doc.text(t('pdf_footer_licensed'), pageWidth / 2, footerY, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 150);
  doc.text(t('pdf_disclaimer'), pageWidth / 2, footerY + 5, { align: 'center' });

  const fileName = `Cytyos_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};