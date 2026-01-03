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

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setFontSize(32);
  doc.setTextColor(6, 182, 212);
  doc.setFont('helvetica', 'bold');
  doc.text('CYTYOS', margin, 25);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('INTELLIGENCE', margin, 33);

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

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  const watermarkText = 'CONFIDENTIAL';
  const textWidth = doc.getTextWidth(watermarkText);
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.text(watermarkText, (pageWidth - textWidth) / 2, pageHeight / 2, {
    angle: 45,
    align: 'center',
  });
  doc.restoreGraphicsState();

  currentY = 60;

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

  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 12, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_title').toUpperCase(), margin + 5, currentY + 8);
  currentY += 20;

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
  doc.text(t('pdf_section_project_data'), margin, currentY);
  currentY += 10;

  const formatArea = (area: number, unitSystem: 'metric' | 'imperial') => {
    if (unitSystem === 'imperial') {
      const sqft = area * 10.764;
      return `${sqft.toLocaleString('en-US', { maximumFractionDigits: 0 })} ft²`;
    }
    return `${area.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} m²`;
  };

  const formatCurrency = (value: number, currency: string) => {
    const symbols: Record<string, string> = {
      BRL: 'R$',
      USD: '$',
      EUR: '€',
      GBP: '£',
      CNY: '¥',
      JPY: '¥',
    };
    const symbol = symbols[currency] || '$';
    return `${symbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_executive_summary'), margin, currentY);
  currentY += 8;

  const lastAssistantMessage = chatMessages
    ?.filter((msg) => msg.role === 'assistant')
    .pop();

  let analysisText = '';
  if (lastAssistantMessage && lastAssistantMessage.content.trim().length > 50) {
    analysisText = lastAssistantMessage.content.substring(0, 800);
  } else {
    const fallbackTemplate = t('pdf_fallback_summary');
    analysisText = fallbackTemplate
      .replace('{used}', projectData.aproveitamentoRealizado.toFixed(2))
      .replace('{max}', projectData.coefficientCA.toFixed(2))
      .replace('{margin}', projectData.profitMargin.toFixed(1));
  }

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

  if (currentY > pageHeight - 100) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_efficiency'), margin, currentY);
  currentY += 10;

  const estimatedBaseArea = projectData.totalBuiltArea / (projectData.volumetriaBlocks.length > 0 ? Math.max(...projectData.volumetriaBlocks.map(b => b.height / 3)) : 3);
  const occupancyRate = (estimatedBaseArea / projectData.terrainArea) * 100;
  const netSellableArea = projectData.totalBuiltArea * 0.85;
  const permeability = 100 - occupancyRate;
  const farUsageRatio = projectData.aproveitamentoRealizado / projectData.coefficientCA;
  const efficiencyScore = farUsageRatio > 0.8
    ? (language === 'en' ? 'A (High)' : language === 'pt' ? 'A (Alto)' : language === 'es' ? 'A (Alto)' : language === 'fr' ? 'A (Élevé)' : 'A (高)')
    : (language === 'en' ? 'B (Potential)' : language === 'pt' ? 'B (Potencial)' : language === 'es' ? 'B (Potencial)' : language === 'fr' ? 'B (Potentiel)' : 'B (潜力)');

  const efficiencyTableData = [
    [t('pdf_lbl_occupancy_rate'), `${occupancyRate.toFixed(1)}%`],
    [t('pdf_lbl_net_sellable_area'), formatArea(netSellableArea, projectData.unitSystem)],
    [t('pdf_lbl_permeability'), `${permeability.toFixed(1)}%`],
    [t('pdf_lbl_efficiency_score'), efficiencyScore],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [[t('pdf_table_parameter'), t('pdf_table_value')]],
    body: efficiencyTableData,
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

  const financialTableData = [
    [t('pdf_lbl_land_value'), formatCurrency(projectData.landValue, projectData.currency)],
    [
      t('pdf_lbl_construction_cost'),
      formatCurrency(projectData.constructionCostPerSqm, projectData.currency),
    ],
    [t('pdf_lbl_sale_value'), formatCurrency(projectData.saleValuePerSqm, projectData.currency)],
    [
      t('pdf_lbl_total_construction_cost'),
      formatCurrency(projectData.totalCost, projectData.currency),
    ],
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
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

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
  doc.text(t('pdf_section_volumetry'), margin, currentY);
  currentY += 10;

  const translateBlockName = (blockName: string, targetLanguage: Language): string => {
    let displayName = blockName;

    if (targetLanguage === 'en') {
      displayName = displayName.replace(/Torre/g, 'Tower');
      displayName = displayName.replace(/Cópia/g, 'Copy');
    } else if (targetLanguage === 'pt') {
      displayName = displayName.replace(/Tower/g, 'Torre');
      displayName = displayName.replace(/Copy/g, 'Cópia');
    } else if (targetLanguage === 'es') {
      displayName = displayName.replace(/Tower/g, 'Torre');
      displayName = displayName.replace(/Torre/g, 'Torre');
      displayName = displayName.replace(/Copy/g, 'Copia');
      displayName = displayName.replace(/Cópia/g, 'Copia');
    } else if (targetLanguage === 'fr') {
      displayName = displayName.replace(/Tower/g, 'Tour');
      displayName = displayName.replace(/Torre/g, 'Tour');
      displayName = displayName.replace(/Copy/g, 'Copie');
      displayName = displayName.replace(/Cópia/g, 'Copie');
      displayName = displayName.replace(/Copia/g, 'Copie');
    } else if (targetLanguage === 'zh') {
      displayName = displayName.replace(/Tower/g, '塔楼');
      displayName = displayName.replace(/Torre/g, '塔楼');
      displayName = displayName.replace(/Copy/g, '副本');
      displayName = displayName.replace(/Cópia/g, '副本');
      displayName = displayName.replace(/Copia/g, '副本');
      displayName = displayName.replace(/Copie/g, '副本');
    }

    return displayName;
  };

  const floorLabel = language === 'en' ? 'floors' : language === 'es' ? 'pisos' : language === 'fr' ? 'étages' : language === 'zh' ? '楼层' : 'pavimentos';
  const blocksTableData = projectData.volumetriaBlocks.map((block, index) => [
    (index + 1).toString(),
    translateBlockName(block.name, language),
    `${block.height}m`,
    `${block.setback}m`,
    `${Math.floor(block.height / 3)} ${floorLabel}`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', t('pdf_lbl_block_name'), t('pdf_lbl_height'), t('pdf_lbl_setback'), t('pdf_lbl_floors')]],
    body: blocksTableData,
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

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  const footerY = pageHeight - 15;
  doc.text(t('pdf_footer_licensed'), pageWidth / 2, footerY, {
    align: 'center',
  });

  doc.setFontSize(7);
  doc.setTextColor(120, 130, 150);
  doc.text(t('pdf_disclaimer'), pageWidth / 2, footerY + 5, {
    align: 'center',
  });

  const fileName = `Cytyos_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
