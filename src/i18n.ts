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
        roadmap: "Roadmap"
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
      roadmap: {
        title: "The Vision & Roadmap",
        cta: "Secure Early Bird Access",
        col1: {
          tag: "Live Now",
          title: "Get Today (Beta)",
          f1: "Instant 3D Zoning Visualization",
          f2: "Manual Plot Control (Draw any shape)",
          f3: "Basic ROI & GFA Calculator",
          f4: "Unlimited Projects"
        },
        col2: {
          tag: "Most Popular Strategy",
          subtag: "Coming March",
          title: "Guarantee for March (v1.0)",
          f1: "Automatic Zoning Data (No manual input)",
          f2: "Site Comparison Tool (Side-by-side)",
          f3: "PDF Export for Investors",
          f4: "Smart Volumetry (Auto-Envelope)"
        },
        col3: {
          tag: "The Vision 2026",
          title: "The Future 2026 (v2.0)",
          f1: "Predictive AI Heatmaps",
          f2: "Highest & Best Use Recommender",
          f3: "Global Expansion Pack",
          f4: "Multi-layer Intelligence"
        }
      },
      // --- NEW LANDING PAGE KEYS ---
      landing: {
        login: "Login",
        hero: {
          badge: "Beta Live Now",
          title_prefix: "The Operating System for",
          title_main: "Real Estate Development.",
          title_anim: "Start Analyzing.",
          subtitle: "Cytyos transforms complex zoning data into investment decisions in seconds. Stop drawing manually. Start optimizing instantly.",
          btn_try: "Try Beta Free",
          btn_plans: "View Early Bird Plans"
        },
        features: {
          global: { title: "Global & Local", desc: "Mapbox integration allows analysis anywhere in the world, with specific metric systems (Imperial/Metric) adapted instantly." },
          zoning: { title: "Smart Zoning", desc: "Our AI reads zoning text and automatically applies constraints like FAR, Occupancy, and Setbacks to your 3D model." },
          secure: { title: "Secure Data", desc: "Your projects are private. We do not sell your data. Cytyos is built for professional developers and architects." }
        },
        roadmap_intro: "We are building the future of territorial intelligence. Secure your position now for lifetime access to future tools.",
        footer_rights: "© 2026 Cytyos Inc."
      }
    }
  },
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Projeto", economics: "Viabilidade" },
      header: { revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar", zoning: "Lei", roadmap: "Roadmap" },
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
      roadmap: {
        title: "Visão & Roadmap",
        cta: "Garantir Acesso Early Bird",
        col1: {
          tag: "No Ar (Beta)",
          title: "Você Leva HOJE (Beta)",
          f1: "Visualização 3D Instantânea",
          f2: "Controle Manual de Terreno",
          f3: "Calculadora de VGV & ROI",
          f4: "Projetos Ilimitados"
        },
        col2: {
          tag: "Estratégia Popular",
          subtag: "Chega em Março",
          title: "Garantia para MARÇO (v1.0)",
          f1: "Dados de Zoneamento Automáticos",
          f2: "Comparador de Terrenos",
          f3: "Exportação de PDF Investidor",
          f4: "Volumetria Inteligente"
        },
        col3: {
          tag: "A Visão 2026",
          title: "O Futuro 2026 (v2.0)",
          f1: "Mapas de Calor Preditivos (IA)",
          f2: "Recomendador de 'Best Use'",
          f3: "Pacote de Expansão Global",
          f4: "Inteligência Multicamadas"
        }
      },
      // --- NEW LANDING PAGE KEYS TRANSLATED ---
      landing: {
        login: "Entrar",
        hero: {
          badge: "Beta Disponível",
          title_prefix: "O Sistema Operacional do",
          title_main: "Desenvolvimento Imobiliário.",
          title_anim: "Comece a Analisar.",
          subtitle: "O Cytyos transforma dados complexos de zoneamento em decisões de investimento em segundos. Pare de desenhar manualmente. Otimize agora.",
          btn_try: "Testar Beta Grátis",
          btn_plans: "Ver Planos Early Bird"
        },
        features: {
          global: { title: "Global & Local", desc: "Integração Mapbox permite análises em qualquer lugar do mundo, adaptando sistemas métricos (Imperial/Métrico) instantaneamente." },
          zoning: { title: "Zoneamento Inteligente", desc: "Nossa IA lê textos de leis e aplica automaticamente restrições como C.A., T.O. e Recuos ao seu modelo 3D." },
          secure: { title: "Dados Seguros", desc: "Seus projetos são privados. Não vendemos seus dados. Cytyos é construído para incorporadores e arquitetos profissionais." }
        },
        roadmap_intro: "Estamos construindo o futuro da inteligência territorial. Garanta sua posição agora para ter acesso vitalício às ferramentas futuras.",
        footer_rights: "© 2026 Cytyos Inc."
      }
    }
  },
  // Mantendo suporte basico para outros
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