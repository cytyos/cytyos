import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- ENGLISH (EN) ---
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      
      // HEADER & TABS (Painel Principal)
      header: { revenue: "Revenue (GDV)", margin: "Margin", export: "Export PDF", load: "Load", save: "Save", zoning: "Context", roadmap: "Roadmap" },
      tabs: { design: "Design", economics: "Economics" },
      
      // SMART PANEL (Inputs e Resultados)
      compliance: { title: "Compliance", legal: "Legal", violation: "Violation", far: "FAR", occ: "Occupancy" },
      results: { nsa: "NSA (Sellable)", revenue: "Total Revenue", totalCost: "Total Cost", netProfit: "Net Profit" },
      
      assumptions: {
        title: "Assumptions",
        maxFar: "Max FAR",
        maxOcc: "Max Occ %",
        landArea: "Land Area",
        landCost: "Land Cost",
        onerousGrant: "Impact Fees",
        sales: "Sales $/m²",
        build: "Build Cost $/m²"
      },

      // AI & ONBOARDING
      ai: { btn: "AI Consultant", thinking: "Analyzing...", close: "Close", insight: "AI Strategic Insight", placeholder: "Ask about efficiency..." },
      onboarding: { title: "Start Analysis", text: "Search for a location or address, then use the Draw tool." },

      // MAP CONTROLS
      map: { search_placeholder: "Search location...", search_provider: "Search via Mapbox", sat: "Sat", streets: "Map", draw: "Draw", clear: "Clear", delete_confirm_title: "Delete design?", confirm: "Confirm", cancel: "Cancel" },

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

      footer: { disclaimer: "Cytyos is a decision support tool. AI results may vary. Always consult a technical professional." },

      // PRICING MODAL
      pricing: {
        badge: "Founder Opportunity",
        title: "Unlock the Full Platform",
        warning: "Warning: Price increases when v1.0 launches. Secure your Early Bird rate.",
        
        beta_tag: "LIVE NOW",
        beta_title: "Get Today (Beta)",
        v1_tag: "COMING MARCH",
        v1_title: "Guarantee for March (v1.0)",
        v2_tag: "FOUNDERS EDITION",
        v2_title: "The Future 2026 (v2.0)",

        // Features
        beta_f1: "Instant 3D Zoning Visualization", beta_f2: "Manual Plot Control", beta_f3: "Basic ROI & GFA Calculator", beta_f4: "Unlimited Projects",
        v1_f1: "Automatic Zoning Data", v1_f2: "Fully Modelable Volumetry", v1_f3: "PDF Export for Investors", v1_f4: "Site Comparison Tool",
        v2_f1: "BIM/DWG Upload for Analysis", v2_f2: "Predictive AI Heatmaps", v2_f3: "Highest & Best Use Recommender", v2_f4: "Multi-layer Intelligence",

        small_title: "Small project?", small_desc: "Generate a single PDF report.", btn_pdf: "Buy One Report ($17)",
        select_plan: "Select your Plan", monthly: "Monthly", yearly: "Yearly",
        
        save_pct: "SAVE 77%",
        save_amount_badge: "SAVE $999", // <--- A CHAVE QUE FALTAVA NA IMAGEM 1

        plan_annual: "Founder Annual", plan_monthly: "Standard Access",
        sub_annual: "Secure v1.0 & v2.0 access.", sub_monthly: "Cancel anytime.",
        future_price: "Future Price",
        btn_annual: "Lock in Founder Price ($296)", btn_monthly: "Subscribe Monthly",
        
        coupon_label: "Have an access key?", coupon_placeholder: "ENTER COUPON CODE", validate: "Validate",
        monthly_warning: "By selecting monthly, you only get access to what is ready today.",
        monthly_warning_highlight: "Switch to Annual to secure v1.0 & v2.0"
      }
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      header: { revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar", zoning: "Lei", roadmap: "Roadmap" },
      tabs: { design: "Projeto", economics: "Viabilidade" },
      
      compliance: { title: "Legislação", legal: "Legal", violation: "Infração", far: "C.A.", occ: "T.O." },
      results: { nsa: "Área Privativa", revenue: "Receita (VGV)", totalCost: "Custo Total", netProfit: "Lucro Líquido" },
      
      assumptions: {
        title: "Premissas",
        maxFar: "C.A. Máximo", maxOcc: "T.O. Máxima %",
        landArea: "Área Terreno", landCost: "Custo Terreno",
        onerousGrant: "Outorga/Taxas", sales: "Venda R$/m²", build: "Obra R$/m²"
      },

      ai: { btn: "Consultor IA", thinking: "Analisando...", close: "Fechar", insight: "Análise Estratégica", placeholder: "Pergunte sobre eficiência..." },
      onboarding: { title: "Iniciar Análise", text: "Busque um endereço e use a ferramenta Desenhar para definir o terreno." },
      map: { search_placeholder: "Buscar local...", search_provider: "Busca via Mapbox", sat: "Sat", streets: "Mapa", draw: "Desenhar", clear: "Limpar", delete_confirm_title: "Apagar desenho?", confirm: "Confirmar", cancel: "Cancelar" },

      landing: {
        login: "Entrar",
        hero: { badge: "Beta Disponível", title_prefix: "O Sistema Operacional do", title_main: "Desenvolvimento Imobiliário.", title_anim: "Comece a Analisar.", subtitle: "Transforme dados de zoneamento em decisões de investimento em segundos.", btn_try: "Testar Beta Grátis", btn_plans: "Ver Plano Early Bird" },
        roadmap_intro: "Estamos construindo o futuro da inteligência territorial.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      roadmap: {
        title: "Visão & Roadmap", cta: "Garantir Acesso Early Bird",
        col1: { tag: "No Ar (Beta)", title: "Você Leva HOJE (Beta)", f1: "Visualização 3D Instantânea", f2: "Controle Manual de Terreno", f3: "Calculadora de VGV", f4: "Projetos Ilimitados" },
        col2: { tag: "Incluso", subtag: "Chega em Março", title: "Garantia para MARÇO (v1.0)", f1: "Dados Automáticos", f2: "Comparador de Terrenos", f3: "Exportação PDF", f4: "Volumetria Inteligente" },
        col3: { tag: "Edição Founders", title: "O Futuro 2026 (v2.0)", f1: "Mapas de Calor Preditivos", f2: "Recomendador 'Best Use'", f3: "Expansão Global", f4: "Inteligência Multicamadas" }
      },
      footer: { disclaimer: "O Cytyos é uma ferramenta de suporte à decisão. A IA pode variar. Consulte sempre um responsável técnico." },

      pricing: {
        badge: "Oportunidade Founder", title: "Desbloqueie a Plataforma", warning: "Aviso: O preço aumentará no lançamento da v1.0.",
        beta_tag: "NO AR", beta_title: "Você Leva Hoje (Beta)", v1_tag: "GARANTIDO MARÇO", v1_title: "Versão 1.0 (Março)", v2_tag: "FUTURO 2026", v2_title: "Versão 2.0 (Core)",
        beta_f1: "Visualização 3D Instantânea", beta_f2: "Controle Manual de Terreno", beta_f3: "Calculadora de VGV", beta_f4: "Projetos Ilimitados",
        v1_f1: "Dados de Zoneamento Automáticos", v1_f2: "Volumetria Totalmente Modelável", v1_f3: "Exportação PDF Profissional", v1_f4: "Comparador de Terrenos",
        v2_f1: "Upload BIM/DWG para Análise", v2_f2: "Mapas de Calor Preditivos (IA)", v2_f3: "Recomendador 'Highest & Best Use'", v2_f4: "Inteligência Multicamadas",
        small_title: "Projeto pequeno?", small_desc: "Gere apenas um relatório PDF.", btn_pdf: "Comprar 1 Relatório ($17)",
        select_plan: "Escolha seu Plano", monthly: "Mensal", yearly: "Anual", save_pct: "ECONOMIZE 77%", save_amount_badge: "ECONOMIZE $999",
        plan_annual: "Founder Anual", plan_monthly: "Acesso Padrão", sub_annual: "Garante acesso v1.0 & v2.0.", sub_monthly: "Cancele quando quiser.",
        future_price: "Preço Futuro", btn_annual: "Garantir Preço Founder ($296)", btn_monthly: "Assinar Mensal",
        coupon_label: "Tem um código de acesso?", coupon_placeholder: "DIGITE SEU CUPOM", validate: "Validar",
        monthly_warning: "Ao selecionar mensal, você tem acesso apenas ao que está pronto hoje.", monthly_warning_highlight: "Mude para Anual para garantir V1.0 e V2.0"
      }
    }
  },

  // --- ESPANHOL (ES) - COPIADO DO EN E ADAPTADO ---
  es: {
    translation: {
      app: { title: "Cytyos Beta" },
      header: { revenue: "Ingresos (VGV)", margin: "Margen", export: "Exportar PDF", load: "Cargar", save: "Guardar", zoning: "Contexto", roadmap: "Roadmap" },
      tabs: { design: "Diseño", economics: "Viabilidad" },
      compliance: { title: "Normativa", legal: "Legal", violation: "Violación", far: "F.O.S", occ: "F.O.T" },
      results: { nsa: "Área Vendible", revenue: "Ingresos Totales", totalCost: "Costo Total", netProfit: "Ganancia Neta" },
      assumptions: { title: "Supuestos", maxFar: "Max FOS", maxOcc: "Max FOT %", landArea: "Área Terreno", landCost: "Costo Terreno", onerousGrant: "Impacto/Tasas", sales: "Venta $/m²", build: "Obra $/m²" },
      ai: { btn: "Consultor IA", thinking: "Analizando...", close: "Cerrar", insight: "Insight Estratégico", placeholder: "Pregunte sobre eficiencia..." },
      onboarding: { title: "Iniciar Análisis", text: "Busque una ubicación y use la herramienta Dibujar." },
      map: { search_placeholder: "Buscar ubicación...", search_provider: "Búsqueda vía Mapbox", sat: "Sat", streets: "Mapa", draw: "Dibujar", clear: "Limpiar", delete_confirm_title: "¿Borrar diseño?", confirm: "Confirmar", cancel: "Cancelar" },
      landing: { login: "Ingresar", hero: { badge: "Beta Disponible", title_prefix: "El Sistema Operativo del", title_main: "Desarrollo Inmobiliario.", title_anim: "Empieza a Analizar.", subtitle: "Transforma datos de zonificación en decisiones de inversión.", btn_try: "Probar Gratis", btn_plans: "Ver Planes" }, roadmap_intro: "Construyendo el futuro de la inteligencia territorial.", footer_rights: "© 2026 Cytyos Inc." },
      footer: { disclaimer: "Cytyos es una herramienta de soporte. Resultados de IA varían." },
      pricing: { badge: "Oportunidad Founder", title: "Desbloquea la Plataforma", warning: "Precio subirá con v1.0.", beta_tag: "EN VIVO", beta_title: "Hoy (Beta)", v1_tag: "LLEGA MARZO", v1_title: "Garantía Marzo (v1.0)", v2_tag: "FUTURO 2026", v2_title: "Versión 2.0", beta_f1: "Visualización 3D", beta_f2: "Control Manual", beta_f3: "Calc. ROI", beta_f4: "Proyectos Ilimitados", v1_f1: "Datos Auto", v1_f2: "Volumetría Smart", v1_f3: "Exportar PDF", v1_f4: "Comparador", v2_f1: "Upload BIM/DWG", v2_f2: "Mapas de Calor IA", v2_f3: "Recomendador", v2_f4: "Multi-capas", small_title: "¿Proyecto pequeño?", small_desc: "1 Reporte PDF.", btn_pdf: "Comprar 1 Reporte ($17)", select_plan: "Elige tu Plan", monthly: "Mensual", yearly: "Anual", save_pct: "AHORRA 77%", save_amount_badge: "AHORRA $999", plan_annual: "Founder Anual", plan_monthly: "Acceso Estándar", sub_annual: "Acceso v1.0 & v2.0.", sub_monthly: "Cancela cuando quieras.", future_price: "Precio Futuro", btn_annual: "Asegurar Precio ($296)", btn_monthly: "Suscribir Mensual", coupon_label: "¿Tienes código?", coupon_placeholder: "CÓDIGO", validate: "Validar", monthly_warning: "Mensual solo da acceso a lo actual.", monthly_warning_highlight: "Cambia a Anual para v1.0 y v2.0" },
      roadmap: { title: "Visión y Futuro", cta: "Acceso Early Bird", col1: { tag: "En Vivo", title: "Hoy (Beta)", f1: "Visualización 3D", f2: "Control Manual", f3: "Calculadora ROI", f4: "Proyectos Ilimitados" }, col2: { tag: "Incluido", subtag: "Marzo", title: "Garantía Marzo (v1.0)", f1: "Datos Automáticos", f2: "Comparador", f3: "Exportar PDF", f4: "Volumetría Smart" }, col3: { tag: "Edición Founders", title: "Futuro 2026 (v2.0)", f1: "Mapas de Calor IA", f2: "Recomendador", f3: "Expansión Global", f4: "Multi-capas" } }
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