import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Language } from '../stores/settingsStore';
import { getTranslation } from '../utils/i18n';
import logoFull from '../assets/logo-full.png'; 

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

// --- HELPER PARA CARREGAR IMAGEM (CORREÇÃO DO LOGO) ---
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};

// ATENÇÃO: Função agora é ASYNC
export const generateReport = async (
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

  // --- HELPERS DE FORMATAÇÃO ---
  const getLocale = (lang: Language) => {
    const map: Record<string, string> = {
      en: 'en-US', pt: 'pt-BR', es: 'es-ES', fr: 'fr-FR', zh: 'zh-CN'
    };
    return map[lang] || 'en-US';
  };

  const formatCurrency = (value: number, currency: string) => {
    // Símbolos completos para LatAm e Globais (MANTIDO SEU PEDIDO)
    const symbols: Record<string, string> = {
      // Globais
      USD: '$', EUR: '€', GBP: '£', CHF: 'Fr', CNY: '¥', JPY: '¥',
      // LatAm
      BRL: 'R$', MXN: '$', COP: '$', ARS: '$', CLP: '$', PEN: 'S/', 
      UYU: '$', BOB: 'Bs', PYG: '₲', CRC: '₡', DOP: 'RD$', GTQ: 'Q', 
      HNL: 'L', NIO: 'C$'
    };
    
    const symbol = symbols[currency] || currency;
    const locale = getLocale(language);
    
    return `${symbol} ${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatArea = (area: number, unitSystem: 'metric' | 'imperial') => {
    const locale = getLocale(language);
    if (unitSystem === 'imperial') {
      const sqft = area * 10.764;
      return `${sqft.toLocaleString(locale, { maximumFractionDigits: 0 })} ft²`;
    }
    return `${area.toLocaleString(locale, { maximumFractionDigits: 0 })} m²`;
  };

  const checkPageBreak = (heightNeeded: number) => {
    if (currentY + heightNeeded > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // --- 1. CABEÇALHO & LOGO ---
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, pageWidth, 50, 'F');

  try {
      // Carregamento Assíncrono (Garante que o logo apareça)
      const img = await loadImage(logoFull);
      // Ajusta tamanho mantendo proporção (largura fixa 35mm)
      const imgWidth = 35;
      const imgHeight = (img.height * imgWidth) / img.width; 
      doc.addImage(img, 'PNG', margin, 15, imgWidth, imgHeight); 
  } catch (e) {
      console.warn("Logo failed to load", e);
      doc.setFontSize(32);
      doc.setTextColor(6, 182, 212);
      doc.setFont('helvetica', 'bold');
      doc.text('CYTYOS', margin, 25);
  }

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); 
  doc.setFont('helvetica', 'normal');
  doc.text('INTELLIGENCE', margin + 40, 28); // Ajustado para ficar ao lado do logo

  const today = new Date().toLocaleDateString(getLocale(language), {
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

  // Marca d'água
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

  // --- 2. IMAGEM DO MAPA ---
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

  // --- 3. TÍTULO DO RELATÓRIO ---
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 12, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_title').toUpperCase(), margin + 5, currentY + 8);
  currentY += 20;

  checkPageBreak(50);

  // --- 4. DADOS DO PROJETO ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_project_data'), margin, currentY);
  currentY += 10;

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
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // --- 5. RESUMO EXECUTIVO (PAGINAÇÃO CORRIGIDA) ---
  checkPageBreak(40);

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_executive_summary'), margin, currentY);
  currentY += 8;

  const lastAssistantMessage = chatMessages?.filter((msg) => msg.role === 'assistant').pop();

  let analysisText = '';
  if (lastAssistantMessage && lastAssistantMessage.content.trim().length > 50) {
    // Remove marcadores markdown simples para o PDF
    analysisText = lastAssistantMessage.content.replace(/[*#]/g, '');
  } else {
    const fallbackTemplate = t('pdf_fallback_summary');
    analysisText = fallbackTemplate
      .replace('{used}', projectData.aproveitamentoRealizado.toFixed(2))
      .replace('{max}', projectData.coefficientCA.toFixed(2))
      .replace('{margin}', projectData.profitMargin.toFixed(1));
  }

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');

  // Lógica de Paginação de Texto Longo
  // Divide o texto em linhas que cabem na largura
  const splitText = doc.splitTextToSize(analysisText, pageWidth - 2 * margin);
  const lineHeight = 5;

  for (let i = 0; i < splitText.length; i++) {
      // Se a próxima linha for estourar a página, cria nova página
      if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin + 10; // Margem no topo da nova página
      }
      doc.text(splitText[i], margin, currentY);
      currentY += lineHeight;
  }
  
  currentY += 10; // Espaço após o texto

  // --- 6. INDICADORES DE EFICIÊNCIA ---
  checkPageBreak(60);
  
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
    ? (language === 'en' ? 'A (High)' : language === 'pt' ? 'A (Alto)' : language === 'zh' ? 'A (高)' : 'A')
    : (language === 'en' ? 'B (Potential)' : language === 'pt' ? 'B (Potencial)' : language === 'zh' ? 'B (潜力)' : 'B');

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
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // --- 7. VIABILIDADE FINANCEIRA ---
  checkPageBreak(60);

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
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;
  checkPageBreak(60);

  // --- 8. VOLUMETRIA ---
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
    const map: Record<string, Record<string, string>> = {
        'Tower': { pt: 'Torre', es: 'Torre', fr: 'Tour', zh: '塔楼' },
        'Copy': { pt: 'Cópia', es: 'Copia', fr: 'Copie', zh: '副本' }
    };
    if (targetLanguage !== 'en') {
        if (blockName.includes('Tower')) displayName = displayName.replace('Tower', map['Tower'][targetLanguage] || 'Tower');
        if (blockName.includes('Copy')) displayName = displayName.replace('Copy', map['Copy'][targetLanguage] || 'Copy');
    }
    return displayName;
  };

  const floorLabel = language === 'en' ? 'floors' : language === 'zh' ? '楼层' : 'pavimentos';
  
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
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
  });

  // --- RODAPÉ ---
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(t('pdf_footer_licensed'), pageWidth / 2, pageHeight - 15, { align: 'center' });

      doc.setFontSize(7);
      doc.setTextColor(120, 130, 150);
      doc.text(t('pdf_disclaimer'), pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  const fileName = `Cytyos_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};