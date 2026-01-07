import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- ENGLISH ---
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Design", economics: "Economics" },
      header: { revenue: "Revenue (GDV)", margin: "Margin", export: "Export PDF", load: "Load", save: "Save", zoning: "Context", roadmap: "Roadmap" },
      compliance: { title: "Compliance", legal: "Legal", violation: "Violation", far: "FAR", occ: "Occupancy" },
      
      // ADDED "onerousGrant" (Impact Fees)
      assumptions: { title: "Assumptions", landArea: "Land Area", landCost: "Land Cost", sales: "Sales/m²", build: "Build/m²", maxFar: "Max FAR", maxOcc: "Max Occ %", onerousGrant: "Impact Fees / Add-ons" },
      
      results: { nsa: "NSA (Sellable)", revenue: "Total Revenue", totalCost: "Total Cost", netProfit: "Net Profit" },
      blocks: { active: "Active Volumes", height: "Height", setback: "Setback" },
      ai: { btn: "AI Consultant", thinking: "Analyzing...", close: "Close", insight: "AI Strategic Insight", placeholder: "Ask about efficiency..." },
      usage: { residential: "Residential", corporate: "Corporate Office", retail: "Retail / Mall", hotel: "Hotel", parking: "Parking Garage", amenities: "Amenities" },
      currency: { main: "Major", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "Cytyos is a decision support tool. AI results may vary. Always consult a technical professional." },
      map: { search_placeholder: "Search location...", search_provider: "Search via Mapbox", sat: "Sat", streets: "Map", draw: "Draw", clear: "Clear", delete_confirm_title: "Delete design?", confirm: "Confirm", cancel: "Cancel" },
      onboarding: { title: "Start Analysis", text: "Search for a location or address, then use the <1>Draw</1> tool to define your lot outline." },
      zoning: { title: "AI Zoning Analysis", placeholder: "Paste zoning laws here... Example: 'Max FAR 4.0, Occupancy 70%'", analyze_btn: "Analyze & Apply", ai_success: "Updated: FAR {{far}}, Occ {{occ}}%." },
      
      landing: {
        login: "Login",
        hero: { badge: "Beta Live Now", title_prefix: "The Operating System for", title_main: "Real Estate Development.", title_anim: "Start Analyzing.", subtitle: "Cytyos transforms complex zoning data into investment decisions in seconds.", btn_try: "Try Beta Free", btn_plans: "View Early Bird Plan" },
        features: { global: { title: "Global & Local", desc: "Mapbox integration allows analysis anywhere in the world." }, zoning: { title: "Smart Zoning", desc: "AI reads zoning text and applies constraints automatically." }, secure: { title: "Secure Data", desc: "Your projects are private. We do not sell your data." } },
        roadmap_intro: "We are building the future of territorial intelligence. Secure your position now.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      roadmap: {
        title: "The Vision & Roadmap", cta: "Secure Early Bird Access",
        col1: { tag: "Live Now", title: "Get Today (Beta)", f1: "Instant 3D Zoning Visualization", f2: "Manual Plot Control", f3: "Basic ROI & GFA Calculator", f4: "Unlimited Projects" },
        col2: { tag: "Included", subtag: "Coming March", title: "Guarantee for March (v1.0)", f1: "Automatic Zoning Data", f2: "Site Comparison Tool", f3: "PDF Export for Investors", f4: "Smart Volumetry" },
        col3: { tag: "Founders Edition", title: "The Future 2026 (v2.0)", f1: "Predictive AI Heatmaps", f2: "Highest & Best Use Recommender", f3: "Global Expansion Pack", f4: "Multi-layer Intelligence" }
      }
    }
  },

  // --- PORTUGUÊS ---
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Projeto", economics: "Viabilidade" },
      header: { revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar", zoning: "Lei", roadmap: "Roadmap" },
      compliance: { title: "Legislação", legal: "Legal", violation: "Infração", far: "C.A.", occ: "T.O." },
      
      // ADICIONADO "onerousGrant" (Outorga)
      assumptions: { title: "Premissas", landArea: "Área Terreno", landCost: "Custo Terreno", sales: "Venda/m²", build: "Obra/m²", maxFar: "C.A. Máximo", maxOcc: "T.O. Máxima (%)", onerousGrant: "Outorga / Taxas Extras" },
      
      results: { nsa: "Área Privativa", revenue: "Receita (VGV)", totalCost: "Custo Total", netProfit: "Lucro Líquido" },
      blocks: { active: "Volumetria", height: "Altura", setback: "Recuo" },
      ai: { btn: "Consultor IA", thinking: "Analisando...", close: "Fechar", insight: "Análise Estratégica", placeholder: "Pergunte sobre margem..." },
      usage: { residential: "Residencial", corporate: "Corporativo", retail: "Varejo / Lojas", hotel: "Hotel", parking: "Edifício Garagem", amenities: "Áreas Comuns" },
      currency: { main: "Principais", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "O Cytyos é uma ferramenta de suporte à decisão. A IA pode variar. Consulte sempre um responsável técnico." },
      map: { search_placeholder: "Buscar local...", search_provider: "Busca via Mapbox", sat: "Sat", streets: "Mapa", draw: "Desenhar", clear: "Limpar", delete_confirm_title: "Apagar desenho?", confirm: "Confirmar", cancel: "Cancelar" },
      onboarding: { title: "Iniciar Análise", text: "Busque um endereço e use a ferramenta <1>Desenhar</1> para definir o contorno do terreno." },
      zoning: { title: "Análise de Lei IA", placeholder: "Cole o texto da lei aqui... Exemplo: 'C.A. Máximo 4.0, Taxa de Ocupação 70%'", analyze_btn: "Analisar e Aplicar", ai_success: "Atualizado: C.A. {{far}}, T.O. {{occ}}%." },
      
      landing: {
        login: "Entrar",
        hero: { badge: "Beta Disponível", title_prefix: "O Sistema Operacional do", title_main: "Desenvolvimento Imobiliário.", title_anim: "Comece a Analisar.", subtitle: "Transforme dados de zoneamento em decisões de investimento em segundos.", btn_try: "Testar Beta Grátis", btn_plans: "Ver Plano Early Bird" },
        features: { global: { title: "Global & Local", desc: "Análises em qualquer lugar do mundo." }, zoning: { title: "Zoneamento Inteligente", desc: "IA lê leis e aplica restrições automaticamente." }, secure: { title: "Dados Seguros", desc: "Seus projetos são privados e seguros." } },
        roadmap_intro: "Estamos construindo o futuro da inteligência territorial.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      roadmap: {
        title: "Visão & Roadmap", cta: "Garantir Acesso Early Bird",
        col1: { tag: "No Ar (Beta)", title: "Você Leva HOJE (Beta)", f1: "Visualização 3D Instantânea", f2: "Controle Manual de Terreno", f3: "Calculadora de VGV", f4: "Projetos Ilimitados" },
        col2: { tag: "Incluso", subtag: "Chega em Março", title: "Garantia para MARÇO (v1.0)", f1: "Dados Automáticos", f2: "Comparador de Terrenos", f3: "Exportação PDF", f4: "Volumetria Inteligente" },
        col3: { tag: "Edição Founders", title: "O Futuro 2026 (v2.0)", f1: "Mapas de Calor Preditivos", f2: "Recomendador 'Best Use'", f3: "Expansão Global", f4: "Inteligência Multicamadas" }
      }
    }
  },

  // --- SPANISH (Simplified) ---
  es: {
    translation: {
      app: { title: "Cytyos Beta" },
      landing: {
        login: "Ingresar",
        hero: { badge: "Beta Disponible", title_prefix: "El Sistema Operativo del", title_main: "Desarrollo Inmobiliario.", title_anim: "Empieza a Analizar.", subtitle: "Transforma datos de zonificación en decisiones de inversión en segundos.", btn_try: "Probar Gratis", btn_plans: "Ver Plan Early Bird" },
        features: { global: { title: "Global y Local", desc: "Análisis en cualquier parte del mundo." }, zoning: { title: "Zonificación Smart", desc: "IA lee normativas automáticamente." }, secure: { title: "Datos Seguros", desc: "Tus proyectos son privados." } },
        roadmap_intro: "Construyendo el futuro de la inteligencia territorial.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      roadmap: {
        title: "Visión y Futuro", cta: "Acceso Early Bird",
        col1: { tag: "En Vivo", title: "Hoy (Beta)", f1: "Visualización 3D", f2: "Control Manual", f3: "Calculadora ROI", f4: "Proyectos Ilimitados" },
        col2: { tag: "Incluido", subtag: "Marzo", title: "Garantía Marzo (v1.0)", f1: "Datos Automáticos", f2: "Comparador", f3: "Exportar PDF", f4: "Volumetría Smart" },
        col3: { tag: "Edición Founders", title: "Futuro 2026 (v2.0)", f1: "Mapas de Calor IA", f2: "Recomendador", f3: "Expansión Global", f4: "Multi-capas" }
      }
    }
  },

  // --- FRENCH (Simplified) ---
  fr: {
    translation: {
      app: { title: "Cytyos Beta" },
      landing: {
        login: "Connexion",
        hero: { badge: "Beta En Ligne", title_prefix: "Le Système d'Opération du", title_main: "Développement Immobilier.", title_anim: "Commencez l'Analyse.", subtitle: "Transformez les données de zonage en décisions d'investissement.", btn_try: "Essai Gratuit", btn_plans: "Voir Plan Early Bird" },
        features: { global: { title: "Global & Local", desc: "Analyse partout dans le monde." }, zoning: { title: "Zonage Intelligent", desc: "L'IA applique les contraintes automatiquement." }, secure: { title: "Données Sécurisées", desc: "Vos projets sont privés." } },
        roadmap_intro: "Nous construisons le futur de l'intelligence territoriale.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      roadmap: {
        title: "Vision", cta: "Accès Early Bird",
        col1: { tag: "En Ligne", title: "Aujourd'hui (Beta)", f1: "Visualisation 3D", f2: "Contrôle Manuel", f3: "Calculateur ROI", f4: "Projets Illimités" },
        col2: { tag: "Inclus", subtag: "Mars", title: "Garanti Mars (v1.0)", f1: "Données Auto", f2: "Comparateur", f3: "Export PDF", f4: "Volumétrie Smart" },
        col3: { tag: "Édition Founders", title: "Futur 2026 (v2.0)", f1: "Cartes Thermiques IA", f2: "Recommandations", f3: "Expansion Globale", f4: "Intelligence Multi-couches" }
      }
    }
  },

  // --- CHINESE (Simplified) ---
  zh: {
    translation: {
      app: { title: "Cytyos Beta" },
      landing: {
        login: "登录",
        hero: { badge: "Beta 现已上线", title_prefix: "房地产开发的", title_main: "操作系统。", title_anim: "开始分析。", subtitle: "瞬间将复杂的区划数据转化为投资决策。", btn_try: "免费试用", btn_plans: "查看早鸟计划" },
        features: { global: { title: "全球本地化", desc: "支持全球分析。" }, zoning: { title: "智能区划", desc: "AI 自动应用法规约束。" }, secure: { title: "数据安全", desc: "您的项目是私密的。" } },
        roadmap_intro: "我们正在构建领土智能的未来。",
        footer_rights: "© 2026 Cytyos Inc."
      },
      roadmap: {
        title: "愿景", cta: "获取早鸟资格",
        col1: { tag: "在线", title: "今日 (Beta)", f1: "3D 可视化", f2: "手动控制", f3: "ROI 计算器", f4: "无限项目" },
        col2: { tag: "包含", subtag: "三月", title: "三月更新 (v1.0)", f1: "自动数据", f2: "场地比较", f3: "PDF 导出", f4: "智能体量" },
        col3: { tag: "创始人版", title: "未来 2026 (v2.0)", f1: "AI 热力图", f2: "最佳用途推荐", f3: "全球扩展", f4: "多层智能" }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;