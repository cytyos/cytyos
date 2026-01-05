import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Design", economics: "Economics" },
      header: { 
        revenue: "Revenue (GDV)", margin: "Margin", export: "Export PDF", load: "Load", save: "Save", zoning: "Context", 
        roadmap: "Roadmap" // NEW
      },
      compliance: { title: "Compliance", legal: "Legal", violation: "Violation", far: "FAR (Floor Area Ratio)", occ: "Occupancy Rate" },
      assumptions: { title: "Assumptions", landArea: "Land Area", landCost: "Land Cost", sales: "Sales/m²", build: "Build/m²", maxFar: "Max FAR", maxOcc: "Max Occ %" },
      results: { nsa: "NSA (Sellable)", revenue: "Total Revenue", totalCost: "Total Cost", netProfit: "Net Profit" },
      blocks: { active: "Active Volumes", height: "Height", setback: "Setback" },
      ai: { btn: "AI Consultant", thinking: "Analyzing...", close: "Close", insight: "AI Strategic Insight", placeholder: "Ask about efficiency, profit optimization, or risks..." },
      usage: { residential: "Residential", corporate: "Corporate Office", retail: "Retail / Mall", hotel: "Hotel", parking: "Parking Garage", amenities: "Amenities" },
      currency: { main: "Major", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "Cytyos is a decision support tool. AI results may vary. Always consult a technical professional." },
      map: {
        search_placeholder: "Search location (City, Address)...",
        search_provider: "Search via Mapbox",
        sat: "Sat",
        streets: "Map",
        draw: "Draw",
        clear: "Clear",
        delete_confirm_title: "Delete design?",
        confirm: "Confirm",
        cancel: "Cancel"
      },
      onboarding: {
        title: "Start Analysis",
        text: "Search for a location or address, then use the <1>Draw</1> tool to define your lot outline."
      },
      zoning: {
        title: "AI Zoning Analysis",
        placeholder: "Paste zoning laws, master plan text, or constraints here...\n\nExample: 'Zone ZM-2, Max FAR is 4.0, Max Occupancy 70%, Max Height 45m.'",
        analyze_btn: "Analyze & Apply",
        ai_success: "I analyzed the text. Based on '{{text}}', I updated Max FAR to {{far}} and Occupancy to {{occ}}%. Check the 'Economics' tab to see the impact."
      },
      // --- ROADMAP & SALES COPY ---
      roadmap: {
        title: "The Vision & Roadmap",
        subtitle: "Cytyos is not a drawing tool. It is a decision system.",
        cta: "Secure Early Bird Access",
        col1: {
          title: "Get Today (Beta)",
          f1: "Instant 3D Zoning Visualization",
          f2: "Manual Plot Control (Draw any shape)",
          f3: "Basic ROI & GFA Calculator",
          f4: "Unlimited Projects"
        },
        col2: {
          title: "Guarantee for March (v1.0)",
          badge: "Included in Early Bird",
          f1: "Automatic Zoning Data (No manual input)",
          f2: "Site Comparison Tool (Side-by-side)",
          f3: "PDF Export for Investors",
          f4: "Smart Volumetry (Auto-Envelope)"
        },
        col3: {
          title: "The Future 2026 (v2.0)",
          badge: "Founders Edition",
          f1: "Predictive AI Heatmaps",
          f2: "Highest & Best Use Recommender",
          f3: "Global Expansion Pack",
          f4: "Multi-layer Intelligence"
        }
      }
    }
  },
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Projeto", economics: "Viabilidade" },
      header: { 
        revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar", zoning: "Lei",
        roadmap: "Roadmap" // NEW
      },
      compliance: { title: "Legislação", legal: "Legal", violation: "Infração", far: "C.A. (Aproveitamento)", occ: "T.O. (Ocupação)" },
      assumptions: { title: "Premissas", landArea: "Área Terreno", landCost: "Custo Terreno", sales: "Venda/m²", build: "Obra/m²", maxFar: "C.A. Máximo", maxOcc: "T.O. Máxima (%)" },
      results: { nsa: "Área Privativa", revenue: "Receita (VGV)", totalCost: "Custo Total", netProfit: "Lucro Líquido" },
      blocks: { active: "Volumetria", height: "Altura", setback: "Recuo" },
      ai: { btn: "Consultor IA", thinking: "Analisando...", close: "Fechar", insight: "Análise Estratégica", placeholder: "Pergunte sobre margem, leis..." },
      usage: { residential: "Residencial", corporate: "Corporativo", retail: "Varejo / Lojas", hotel: "Hotel", parking: "Edifício Garagem", amenities: "Áreas Comuns" },
      currency: { main: "Principais", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "O Cytyos é uma ferramenta de suporte à decisão. A IA pode variar. Consulte sempre um responsável técnico." },
      map: {
        search_placeholder: "Buscar local (Cidade, Endereço)...",
        search_provider: "Busca via Mapbox",
        sat: "Sat",
        streets: "Mapa",
        draw: "Desenhar",
        clear: "Limpar",
        delete_confirm_title: "Apagar desenho?",
        confirm: "Confirmar",
        cancel: "Cancelar"
      },
      onboarding: {
        title: "Iniciar Análise",
        text: "Busque um endereço e use a ferramenta <1>Desenhar</1> para definir o contorno do terreno."
      },
      zoning: {
        title: "Análise de Zoneamento IA",
        placeholder: "Cole o texto da lei de zoneamento ou plano diretor aqui...\n\nExemplo: 'Zona ZM, Coeficiente de Aproveitamento máximo 4.0, Taxa de Ocupação 70%'",
        analyze_btn: "Analisar e Aplicar",
        ai_success: "Analisei o texto. Identifiquei C.A. {{far}} e T.O. {{occ}}%. Atualizei os parâmetros automaticamente. Verifique a aba 'Viabilidade' para ver o impacto."
      },
      // --- ROADMAP & SALES COPY ---
      roadmap: {
        title: "Visão & Roadmap",
        subtitle: "Cytyos não é uma ferramenta de desenho. É um sistema de decisão.",
        cta: "Garantir Acesso Early Bird",
        col1: {
          title: "Você Leva HOJE (Beta)",
          f1: "Visualização 3D Instantânea",
          f2: "Controle Manual de Terreno",
          f3: "Calculadora de VGV & ROI",
          f4: "Projetos Ilimitados"
        },
        col2: {
          title: "Garantia para MARÇO (v1.0)",
          badge: "Incluso no Early Bird",
          f1: "Dados de Zoneamento Automáticos",
          f2: "Comparador de Terrenos",
          f3: "Exportação de PDF Investidor",
          f4: "Volumetria Inteligente"
        },
        col3: {
          title: "O Futuro 2026 (v2.0)",
          badge: "Edição Founders",
          f1: "Mapas de Calor Preditivos (IA)",
          f2: "Recomendador de 'Best Use'",
          f3: "Pacote de Expansão Global",
          f4: "Inteligência Multicamadas"
        }
      }
    }
  },
  es: { translation: { app: { title: "Cytyos Beta" } } },
  fr: { translation: { app: { title: "Cytyos Beta" } } },
  zh: { translation: { app: { title: "Cytyos Beta" } } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;