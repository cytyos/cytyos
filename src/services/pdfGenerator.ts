import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Language } from '../stores/settingsStore';
import { getTranslation } from '../utils/i18n';
import logoFull from '../assets/logo-full.png'; 

// Se o logo continuar falhando, converta a imagem para Base64 e cole aqui:
// Ex: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
const LOGO_BASE64_FALLBACK = ""; 

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

// Helper para carregar imagem (Tenta arquivo -> Tenta Base64 -> Falha)
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => {
            // Se falhar o arquivo, tenta o fallback Base64 se existir
            if (LOGO_BASE64_FALLBACK) {
                const imgBase64 = new Image();
                imgBase64.src = LOGO_BASE64_FALLBACK;
                imgBase64.onload = () => resolve(imgBase64);
                imgBase64.onerror = reject;
            } else {
                reject(e);
            }
        };
    });
};

export const generateReport = async (
  mapInstance: any,
  projectData: ProjectData,
  language: Language = 'en',
  executiveSummary: string // <--- AGORA RECEBE O TEXTO PRONTO DA IA
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

  // --- HELPERS ---
  const getLocale = (lang: Language) => {
    const map: Record<string, string> = { en: 'en-US', pt: 'pt-BR', es: 'es-ES', fr: 'fr-FR', zh: 'zh-CN' };
    return map[lang] || 'en-US';
  };

  const formatCurrency = (value: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', CHF: 'Fr', CNY: '¥', JPY: '¥',
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

  // --- 1. HEADER & LOGO ---
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, pageWidth, 50, 'F');

  try {
      const img = await loadImage(logoFull);
      const imgWidth = 35;
      const imgHeight = (img.height * imgWidth) / img.width; 
      doc.addImage(img, 'PNG', margin, (50 - imgHeight)/2, imgWidth, imgHeight); 
  } catch (e) {
      // Fallback Texto
      doc.setFontSize(32);
      doc.setTextColor(6, 182, 212);
      doc.setFont('helvetica', 'bold');
      doc.text('CYTYOS', margin, 25);
  }

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); 
  doc.setFont('helvetica', 'normal');
  doc.text('INTELLIGENCE', margin + 40, 28); 

  const today = new Date().toLocaleDateString(getLocale(language), { year: 'numeric', month: 'short', day: 'numeric' });
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(today.toUpperCase(), pageWidth - margin, 25, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(t('pdf_header_confidential'), pageWidth - margin, 31, { align: 'right' });

  // --- 2. MAPA ---
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
      console.error('Map capture error', error);
    }
  }

  // --- 3. DADOS ---
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 12, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_title').toUpperCase(), margin + 5, currentY + 8);
  currentY += 20;

  checkPageBreak(50);
  
  // Tabela Dados do Projeto
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text(t('pdf_section_project_data'), margin, currentY);
  currentY += 10;

  autoTable(doc, {
    startY: currentY,
    head: [[t('pdf_table_parameter'), t('pdf_table_value')]],
    body: [
      [t('pdf_lbl_land_area'), formatArea(projectData.terrainArea, projectData.unitSystem)],
      [t('pdf_lbl_built_area'), formatArea(projectData.totalBuiltArea, projectData.unitSystem)],
      [t('pdf_lbl_coefficient_max'), `${projectData.coefficientCA.toFixed(2)}x`],
      [t('pdf_lbl_coefficient_used'), `${projectData.aproveitamentoRealizado.toFixed(2)}x`],
      [t('pdf_lbl_num_blocks'), projectData.volumetriaBlocks.length.toString()],
      [t('pdf_lbl_total_height'), `${projectData.volumetriaBlocks.reduce((sum, b) => sum + b.height, 0).toFixed(0)}m`],
      [t('pdf_lbl_estimated_floors'), Math.floor(projectData.volumetriaBlocks.reduce((sum, b) => sum + b.height, 0) / 3).toString()],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = (doc as any).lastAutoTable.finalY + 15;

  // --- 4. RESUMO EXECUTIVO (INTELIGENTE) ---
  checkPageBreak(40);
  
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 2, 'F');
  currentY += 8;

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_executive_summary'), margin, currentY);
  currentY += 8;

  // Usa o texto passado diretamente, com limpeza básica
  const analysisText = executiveSummary 
    ? executiveSummary.replace(/[*#]/g, '') 
    : t('pdf_fallback_summary');

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');

  const splitText = doc.splitTextToSize(analysisText, pageWidth - 2 * margin);
  const lineHeight = 5;
  
  for (let i = 0; i < splitText.length; i++) {
      if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin + 10;
      }
      doc.text(splitText[i], margin, currentY);
      currentY += lineHeight;
  }
  currentY += 10;

  // --- 5. FINANCEIRO E EFICIÊNCIA ---
  checkPageBreak(60);
  
  // Eficiência
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(t('pdf_section_efficiency'), margin, currentY);
  currentY += 10;

  const estimatedBaseArea = projectData.totalBuiltArea / (projectData.volumetriaBlocks.length > 0 ? Math.max(...projectData.volumetriaBlocks.map(b => b.height / 3)) : 3);
  const occupancyRate = (estimatedBaseArea / projectData.terrainArea) * 100;
  const netSellableArea = projectData.totalBuiltArea * 0.85; 
  const permeability = 100 - occupancyRate;
  
  autoTable(doc, {
    startY: currentY,
    head: [[t('pdf_table_parameter'), t('pdf_table_value')]],
    body: [
        [t('pdf_lbl_occupancy_rate'), `${occupancyRate.toFixed(1)}%`],
        [t('pdf_lbl_net_sellable_area'), formatArea(netSellableArea, projectData.unitSystem)],
        [t('pdf_lbl_permeability'), `${permeability.toFixed(1)}%`],
        [t('pdf_lbl_efficiency_score'), projectData.aproveitamentoRealizado / projectData.coefficientCA > 0.8 ? 'A' : 'B'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });
  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Financeiro
  checkPageBreak(60);
  doc.text(t('pdf_section_financial'), margin, currentY);
  currentY += 10;
  
  autoTable(doc, {
    startY: currentY,
    head: [[t('pdf_table_item'), t('pdf_table_value')]],
    body: [
        [t('pdf_lbl_land_value'), formatCurrency(projectData.landValue, projectData.currency)],
        [t('pdf_lbl_construction_cost'), formatCurrency(projectData.constructionCostPerSqm, projectData.currency)],
        [t('pdf_lbl_sale_value'), formatCurrency(projectData.saleValuePerSqm, projectData.currency)],
        [t('pdf_lbl_total_construction_cost'), formatCurrency(projectData.totalCost, projectData.currency)],
        [t('pdf_lbl_total_revenue'), formatCurrency(projectData.totalRevenue, projectData.currency)],
        [t('pdf_lbl_profit_margin'), `${projectData.profitMargin.toFixed(1)}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
    margin: { left: margin, right: margin },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(t('pdf_footer_licensed'), pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text(t('pdf_disclaimer'), pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  const fileName = `Cytyos_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};