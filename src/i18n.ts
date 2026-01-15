import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- ENGLISH ---
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      
      // HEADER & TABS
      header: { 
        revenue: "Revenue (GDV)", margin: "Margin", export: "Export PDF", load: "Load", save: "Save", zoning: "Context", roadmap: "Roadmap" 
      },
      tabs: { design: "Design", economics: "Economics" },
      
      // COMPLIANCE & RESULTS
      compliance: { title: "Compliance", legal: "Legal", violation: "Violation", far: "FAR", occ: "Occupancy" },
      results: { nsa: "NSA (Sellable)", revenue: "Total Revenue", totalCost: "Total Cost", netProfit: "Net Profit" },
      
      // ONBOARDING (SIDE PANEL)
      onboarding: { 
        title: "Start Analysis", 
        text: "Search for a location or address, then use the <1>Draw</1> tool to define your lot outline." 
      },

      // MAP CONTROLS
      map: { 
        search_placeholder: "Search location...", 
        search_provider: "Search via Mapbox", 
        sat: "Sat", streets: "Map", draw: "Draw", clear: "Clear", 
        delete_confirm_title: "Delete design?", confirm: "Confirm", cancel: "Cancel" 
      },

      // LANDING PAGE
      landing: {
        login: "Login",
        hero: { 
            badge: "Beta Live Now", 
            title_prefix: "The Operating System for", 
            title_main: "Real Estate Development.", 
            title_anim: "Start Analyzing.", 
            subtitle: "Cytyos transforms complex zoning data into investment decisions in seconds.", 
            btn_try: "Try Beta Free", 
            btn_plans: "View Early Bird Plan" 
        },
        roadmap_intro: "We are building the future of territorial intelligence. Secure your position now.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      
      roadmap: {
        title: "The Vision & Roadmap", cta: "Secure Early Bird Access",
        col1: { tag: "Live Now", title: "Get Today (Beta)", f1: "Instant 3D Zoning Visualization", f2: "Manual Plot Control", f3: "Basic ROI & GFA Calculator", f4: "Unlimited Projects" },
        col2: { tag: "Included", subtag: "Coming March", title: "Guarantee for March (v1.0)", f1: "Automatic Zoning Data", f2: "Site Comparison Tool", f3: "PDF Export for Investors", f4: "Smart Volumetry" },
        col3: { tag: "Founders Edition", title: "The Future 2026 (v2.0)", f1: "Predictive AI Heatmaps", f2: "Highest & Best Use Recommender", f3: "Global Expansion Pack", f4: "Multi-layer Intelligence" }
      },

      // FOOTER
      footer: { 
        disclaimer: "Cytyos is a decision support tool. AI results may vary. Always consult a technical professional." 
      },

      // PRICING MODAL (COMPLETO)
      pricing: {
        badge: "Founder Opportunity",
        title: "Unlock the Full Platform",
        warning: "Warning: Price increases when v1.0 launches. Secure your Early Bird rate for the entire year.",
        
        beta_tag: "LIVE NOW",
        beta_title: "Get Today (Beta)",
        v1_tag: "COMING MARCH",
        v1_title: "Guarantee for March (v1.0)",
        v2_tag: "FOUNDERS EDITION",
        v2_title: "The Future 2026 (v2.0)",

        beta_f1: "Instant 3D Zoning Visualization",
        beta_f2: "Manual Plot Control",
        beta_f3: "Basic ROI & GFA Calculator",
        beta_f4: "Unlimited Projects",
        v1_f1: "Automatic Zoning Data",
        v1_f2: "Fully Modelable Volumetry",
        v1_f3: "PDF Export for Investors",
        v1_f4: "Site Comparison Tool",
        v2_f1: "BIM/DWG Upload for Analysis",
        v2_f2: "Predictive AI Heatmaps",
        v2_f3: "Highest & Best Use Recommender",
        v2_f4: "Multi-layer Intelligence",

        small_title: "Small project?",
        small_desc: "Generate a single PDF report.",
        btn_pdf: "Buy One Report ($17)",
        
        select_plan: "Select your Plan",
        monthly: "Monthly",
        yearly: "Yearly",
        save_pct: "SAVE 77%",
        save_amount: "SAVE $999",

        plan_annual: "Founder Annual",
        plan_monthly: "Standard Access",
        sub_annual: "Secure v1.0 & v2.0 access.",
        sub_monthly: "Cancel anytime.",
        
        future_price: "Future Price",
        btn_annual: "Lock in Founder Price ($296)",
        btn_monthly: "Subscribe Monthly",
        
        coupon_label: "Have an access key?",
        coupon_placeholder: "ENTER COUPON CODE",
        validate: "Validate",
        
        monthly_warning: "By selecting monthly, you only get access to what is ready today.",
        monthly_warning_highlight: "Switch to Annual to secure v1.0 & v2.0"
      }
    }
  },

  // --- PORTUGUÊS ---
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      
      header: { 
        revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar", zoning: "Lei", roadmap: "Roadmap" 
      },
      tabs: { design: "Projeto", economics: "Viabilidade" },

      compliance: { title: "Legislação", legal: "Legal", violation: "Infração", far: "C.A.", occ: "T.O." },
      results: { nsa: "Área Privativa", revenue: "Receita (VGV)", totalCost: "Custo Total", netProfit: "Lucro Líquido" },

      onboarding: { 
        title: "Iniciar Análise", 
        text: "Busque um endereço e use a ferramenta <1>Desenhar</1> para definir o contorno do terreno." 
      },

      map: { 
        search_placeholder: "Buscar local...", 
        search_provider: "Busca via Mapbox", 
        sat: "Sat", streets: "Mapa", draw: "Desenhar", clear: "Limpar", 
        delete_confirm_title: "Apagar desenho?", confirm: "Confirmar", cancel: "Cancelar" 
      },

      landing: {
        login: "Entrar",
        hero: { 
            badge: "Beta Disponível", 
            title_prefix: "O Sistema Operacional do", 
            title_main: "Desenvolvimento Imobiliário.", 
            title_anim: "Comece a Analisar.", 
            subtitle: "Transforme dados de zoneamento em decisões de investimento em segundos.", 
            btn_try: "Testar Beta Grátis", 
            btn_plans: "Ver Plano Early Bird" 
        },
        roadmap_intro: "Estamos construindo o futuro da inteligência territorial.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      
      roadmap: {
        title: "Visão & Roadmap", cta: "Garantir Acesso Early Bird",
        col1: { tag: "No Ar (Beta)", title: "Você Leva HOJE (Beta)", f1: "Visualização 3D Instantânea", f2: "Controle Manual de Terreno", f3: "Calculadora de VGV", f4: "Projetos Ilimitados" },
        col2: { tag: "Incluso", subtag: "Chega em Março", title: "Garantia para MARÇO (v1.0)", f1: "Dados Automáticos", f2: "Comparador de Terrenos", f3: "Exportação PDF", f4: "Volumetria Inteligente" },
        col3: { tag: "Edição Founders", title: "O Futuro 2026 (v2.0)", f1: "Mapas de Calor Preditivos", f2: "Recomendador 'Best Use'", f3: "Expansão Global", f4: "Inteligência Multicamadas" }
      },

      footer: { 
        disclaimer: "O Cytyos é uma ferramenta de suporte à decisão. A IA pode variar. Consulte sempre um responsável técnico." 
      },

      pricing: {
        badge: "Oportunidade Founder",
        title: "Desbloqueie a Plataforma",
        warning: "Aviso: O preço aumentará no lançamento da v1.0. Garanta a taxa Early Bird pelo ano todo.",
        
        beta_tag: "NO AR",
        beta_title: "Você Leva Hoje (Beta)",
        v1_tag: "GARANTIDO MARÇO",
        v1_title: "Versão 1.0 (Março)",
        v2_tag: "FUTURO 2026",
        v2_title: "Versão 2.0 (Intelligence Core)",

        beta_f1: "Visualização 3D Instantânea",
        beta_f2: "Controle Manual de Terreno",
        beta_f3: "Calculadora de VGV",
        beta_f4: "Projetos Ilimitados",
        v1_f1: "Dados de Zoneamento Automáticos",
        v1_f2: "Volumetria Totalmente Modelável",
        v1_f3: "Exportação PDF Profissional",
        v1_f4: "Comparador de Terrenos",
        v2_f1: "Upload BIM/DWG para Análise",
        v2_f2: "Mapas de Calor Preditivos (IA)",
        v2_f3: "Recomendador 'Highest & Best Use'",
        v2_f4: "Inteligência Multicamadas",

        small_title: "Projeto pequeno?",
        small_desc: "Gere apenas um relatório PDF.",
        btn_pdf: "Comprar 1 Relatório ($17)",
        
        select_plan: "Escolha seu Plano",
        monthly: "Mensal",
        yearly: "Anual",
        save_pct: "ECONOMIZE 77%",
        save_amount: "ECONOMIZE $999",

        plan_annual: "Founder Anual",
        plan_monthly: "Acesso Padrão",
        sub_annual: "Garante acesso v1.0 & v2.0.",
        sub_monthly: "Cancele quando quiser.",
        
        future_price: "Preço Futuro",
        btn_annual: "Garantir Preço Founder ($296)",
        btn_monthly: "Assinar Mensal",
        
        coupon_label: "Tem um código de acesso?",
        coupon_placeholder: "DIGITE SEU CUPOM",
        validate: "Validar",

        monthly_warning: "Ao selecionar mensal, você tem acesso apenas ao que está pronto hoje.",
        monthly_warning_highlight: "Mude para Anual para garantir V1.0 e V2.0"
      }
    }
  },
  
  // (Replique a estrutura 'translation' para ES, FR, ZH se necessário, ou deixe cair para o fallback EN)
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