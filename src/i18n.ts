import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- ENGLISH ---
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      // ... (mantenha suas traduções existentes aqui, vou focar no Pricing que é crítico)
      
      map: { search_placeholder: "Search location...", search_provider: "Search via Mapbox", sat: "Sat", streets: "Map", draw: "Draw", clear: "Clear", delete_confirm_title: "Delete design?", confirm: "Confirm", cancel: "Cancel" },

      pricing: {
        badge: "Founder Opportunity",
        title: "Unlock the Full Platform",
        warning: "Warning: Price increases when v1.0 launches. Secure your Early Bird rate for the entire year.",
        
        // LABELS DO MODAL
        beta_tag: "LIVE NOW",
        beta_title: "Get Today (Beta)",
        v1_tag: "COMING MARCH",
        v1_title: "Guarantee for March (v1.0)",
        v2_tag: "FOUNDERS EDITION",
        v2_title: "The Future 2026 (v2.0)",

        // FEATURES
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

        // SIDEBAR ACTIONS
        small_title: "Small project?",
        small_desc: "Generate a single PDF report.",
        btn_pdf: "Buy One Report ($17)",
        
        // PLAN SELECTOR
        select_plan: "Select your Plan",
        monthly: "Monthly",
        yearly: "Yearly",
        save_pct: "SAVE 77%",
        save_amount_badge: "SAVE $999",

        // PLAN CARDS
        plan_annual: "Founder Annual",
        plan_monthly: "Standard Access",
        sub_annual: "Secure v1.0 & v2.0 access.",
        sub_monthly: "Cancel anytime.",
        
        future_price: "Future Price",
        btn_annual: "Lock in Founder Price ($296)",
        btn_monthly: "Subscribe Monthly",
        
        // COUPON
        coupon_label: "Have an access key?",
        coupon_placeholder: "ENTER COUPON CODE",
        validate: "Validate",
        
        // ALERTS
        monthly_warning: "By selecting monthly, you only get access to what is ready today.",
        monthly_warning_highlight: "Switch to Annual to secure v1.0 & v2.0"
      }
    }
  },

  // --- PORTUGUÊS ---
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      map: { search_placeholder: "Buscar local...", search_provider: "Busca via Mapbox", sat: "Sat", streets: "Mapa", draw: "Desenhar", clear: "Limpar", delete_confirm_title: "Apagar desenho?", confirm: "Confirmar", cancel: "Cancelar" },

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
        save_amount_badge: "ECONOMIZE $999",

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
  
  // ... (Repita para ES, FR, ZH seguindo o padrão acima)
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