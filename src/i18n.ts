import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- ENGLISH (EN) ---
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      auth: {
        tab_signin: "Sign In",
        tab_signup: "Create Account",
        email_label: "Email",
        email_placeholder: "name@company.com", 
        password_label: "Password",
        forgot_link: "Forgot password?",
        btn_signin: "Access Platform",
        btn_signup: "Join for Free",
        divider: "OR CONTINUE WITH",
        google: "Google",
        forgot_title: "Recover Password",
        forgot_desc: "Enter your email to receive an instant access link.",
        btn_send: "Send Link",
        btn_back: "Back to Login",
        success_signup: "Account created! Check your email to confirm.",
        success_reset: "Recovery link sent to your email!",
        error_invalid: "Invalid email or password.",
        error_exists: "Email already registered. Try logging in.",
        error_generic: "An error occurred. Please try again."
      },
      header: { 
        revenue: "Revenue (GDV)", margin: "Margin", export: "Export PDF", load: "Load", save: "Save", zoning: "Context", roadmap: "Roadmap",
        session_title: "Free Diagnostic Session", session_time: "Remaining" 
      },
      tabs: { design: "Design", economics: "Economics" },
      blocks: { height: "Height", setback: "Setback" },
      usage: { residential: "Residential", corporate: "Corporate", retail: "Retail", hotel: "Hotel", parking: "Parking", amenities: "Amenities" },
      compliance: { title: "Compliance", legal: "Legal", violation: "Violation", far: "FAR", occ: "Occupancy" },
      results: { nsa: "NSA (Sellable)", revenue: "Total Revenue", totalCost: "Total Cost", netProfit: "Net Profit" },
      assumptions: { title: "Assumptions", maxFar: "Max FAR", maxOcc: "Max Occ %", landArea: "Land Area", landCost: "Land Cost", onerousGrant: "Impact Fees", sales: "Sales $/m²", build: "Build Cost $/m²" },
      ai: { btn: "AI Consultant", thinking: "Analyzing...", close: "Close", insight: "AI Strategic Insight", placeholder: "Ask about efficiency...", limit_reached: "AI limit reached for this coupon. Upgrade to Founder for unlimited access." },
      onboarding: { title: "Start Analysis", text: "Search for a location or address, then use the Draw tool." },
      map: { search_placeholder: "Search location...", search_provider: "Search via Mapbox", sat: "Sat", streets: "Map", draw: "Draw", clear: "Clear", delete_confirm_title: "Delete design?", confirm: "Confirm", cancel: "Cancel" },
      
      // ATUALIZADO (EN)
      landing: {
        login: "Login",
        hero: { 
            badge: "Beta Live Now", 
            title_prefix: "AI for Feasibility Studies", 
            title_main: "and Massing in Seconds.", 
            title_anim: "Start Analyzing.", 
            subtitle: "Draw the plot and receive the 3D massing, area schedule, and GDV instantly.", 
            btn_try: "Start Now (Free)", 
            btn_plans: "View Early Bird Plan" 
        },
        roadmap_intro: "We are building the future of territorial intelligence. Secure your position now.",
        footer_rights: "© 2026 Cytyos Inc."
      },
      
      roadmap: { title: "The Vision & Roadmap", cta: "Secure Early Bird Access", col1: { tag: "Live Now", title: "Get Today (Beta)", f1: "Instant 3D Zoning Visualization", f2: "Manual Plot Control", f3: "Basic ROI & GFA Calculator", f4: "Unlimited Projects" }, col2: { tag: "Included", subtag: "Coming March", title: "Guarantee for March (v1.0)", f1: "Automatic Zoning Data", f2: "Site Comparison Tool", f3: "PDF Export for Investors", f4: "Smart Volumetry" }, col3: { tag: "Founders Edition", title: "The Future 2026 (v2.0)", f1: "Predictive AI Heatmaps", f2: "Highest & Best Use Recommender", f3: "Global Expansion Pack", f4: "Multi-layer Intelligence" } },
      footer: { disclaimer: "Cytyos is a decision support tool. AI results may vary. Always consult a technical professional." },
      pricing: { badge: "Founder Opportunity", title: "Unlock the Full Platform", warning: "Warning: Price increases when v1.0 launches.", beta_tag: "LIVE NOW", beta_title: "Get Today (Beta)", v1_tag: "COMING MARCH", v1_title: "Guarantee for March (v1.0)", v2_tag: "FOUNDERS EDITION", v2_title: "The Future 2026 (v2.0)", beta_f1: "Instant 3D Zoning Visualization", beta_f2: "Manual Plot Control", beta_f3: "Basic ROI & GFA Calculator", beta_f4: "Unlimited Projects", v1_f1: "Automatic Zoning Data", v1_f2: "Fully Modelable Volumetry", v1_f3: "PDF Export for Investors", v1_f4: "Site Comparison Tool", v2_f1: "BIM/DWG Upload for Analysis", v2_f2: "Predictive AI Heatmaps", v2_f3: "Highest & Best Use Recommender", v2_f4: "Multi-layer Intelligence", small_title: "Small project?", small_desc: "Generate a single PDF report.", btn_pdf: "Buy One Report ($17)", select_plan: "Select your Plan", monthly: "Monthly", yearly: "Yearly", save_pct: "SAVE 77%", save_amount_badge: "SAVE $999", plan_annual: "Founder Annual", plan_monthly: "Standard Access", sub_annual: "Secure v1.0 & v2.0 access.", sub_monthly: "Cancel anytime.", future_price: "Future Price", btn_annual: "Lock in Founder Price ($296)", btn_monthly: "Subscribe Monthly", coupon_label: "Have an access key?", coupon_placeholder: "ENTER COUPON CODE", validate: "Validate", monthly_warning: "By selecting monthly, you only get access to what is ready today.", monthly_warning_highlight: "Switch to Annual to secure v1.0 & v2.0" }
    }
  },

  // --- PORTUGUÊS (PT) ---
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      auth: {
        tab_signin: "Entrar",
        tab_signup: "Criar Conta",
        email_label: "E-mail",
        email_placeholder: "seu@email.com", 
        password_label: "Senha",
        forgot_link: "Esqueceu a senha?",
        btn_signin: "Acessar Plataforma",
        btn_signup: "Cadastrar Grátis",
        divider: "OU CONTINUE COM",
        google: "Google",
        forgot_title: "Recuperar Senha",
        forgot_desc: "Digite seu e-mail para receber um link de acesso imediato.",
        btn_send: "Enviar Link",
        btn_back: "Voltar para Login",
        success_signup: "Conta criada! Verifique seu e-mail para confirmar.",
        success_reset: "Link de recuperação enviado para seu e-mail!",
        error_invalid: "E-mail ou senha incorretos.",
        error_exists: "Este e-mail já tem cadastro. Tente entrar.",
        error_generic: "Ocorreu um erro. Tente novamente."
      },
      header: { 
        revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar", zoning: "Lei", roadmap: "Roadmap",
        session_title: "Sessão Diagnóstica Gratuita", session_time: "Restante"
      },
      tabs: { design: "Projeto", economics: "Viabilidade" },
      blocks: { height: "Altura", setback: "Recuo" },
      usage: { residential: "Residencial", corporate: "Corporativo", retail: "Comércio/Varejo", hotel: "Hotel", parking: "Estacionamento", amenities: "Áreas Comuns" },
      compliance: { title: "Legislação", legal: "Legal", violation: "Infração", far: "C.A.", occ: "T.O." },
      results: { nsa: "Área Privativa", revenue: "Receita (VGV)", totalCost: "Custo Total", netProfit: "Lucro Líquido" },
      assumptions: { title: "Premissas", maxFar: "C.A. Máximo", maxOcc: "T.O. Máxima %", landArea: "Área Terreno", landCost: "Custo Terreno", onerousGrant: "Outorga/Taxas", sales: "Venda R$/m²", build: "Obra R$/m²" },
      ai: { btn: "Consultor IA", thinking: "Analisando...", close: "Fechar", insight: "Análise Estratégica", placeholder: "Pergunte sobre eficiência...", limit_reached: "Limite de IA atingido para este cupom. Assine o Founder para acesso ilimitado." },
      onboarding: { title: "Iniciar Análise", text: "Busque um endereço e use a ferramenta Desenhar para definir o terreno." },
      map: { search_placeholder: "Buscar local...", search_provider: "Busca via Mapbox", sat: "Sat", streets: "Mapa", draw: "Desenhar", clear: "Limpar", delete_confirm_title: "Apagar desenho?", confirm: "Confirmar", cancel: "Cancelar" },
      
      // ATUALIZADO (PT)
      landing: {
        login: "Entrar",
        hero: { 
            badge: "Beta Disponível", 
            title_prefix: "IA para Estudos de", 
            title_main: "Viabilidade e Volumetria em Segundos.", 
            title_anim: "Comece a Analisar.", 
            subtitle: "Desenhe o terreno e receba a massa 3D, quadro de áreas e VGV instantaneamente.", 
            btn_try: "Começar Agora", 
            btn_plans: "Ver Plano Early Bird" 
        },
        roadmap_intro: "Estamos construindo o futuro da inteligência territorial. Garanta sua posição agora.",
        footer_rights: "© 2026 Cytyos Inc."
      },

      roadmap: { title: "Visão & Roadmap", cta: "Garantir Acesso Early Bird", col1: { tag: "No Ar (Beta)", title: "Você Leva HOJE (Beta)", f1: "Visualização 3D Instantânea", f2: "Controle Manual de Terreno", f3: "Calculadora de VGV", f4: "Projetos Ilimitados" }, col2: { tag: "Incluso", subtag: "Chega em Março", title: "Garantia para MARÇO (v1.0)", f1: "Dados Automáticos", f2: "Comparador de Terrenos", f3: "Exportação PDF", f4: "Volumetria Inteligente" }, col3: { tag: "Edição Founders", title: "O Futuro 2026 (v2.0)", f1: "Mapas de Calor Preditivos", f2: "Recomendador 'Best Use'", f3: "Expansão Global", f4: "Inteligência Multicamadas" } },
      footer: { disclaimer: "O Cytyos é uma ferramenta de suporte à decisão. A IA pode variar. Consulte sempre um responsável técnico." },
      pricing: { badge: "Oportunidade Founder", title: "Desbloqueie a Plataforma", warning: "Aviso: O preço aumentará no lançamento da v1.0.", beta_tag: "NO AR", beta_title: "Você Leva Hoje (Beta)", v1_tag: "GARANTIDO MARÇO", v1_title: "Versão 1.0 (Março)", v2_tag: "FUTURO 2026", v2_title: "Versão 2.0 (Core)", beta_f1: "Visualização 3D Instantânea", beta_f2: "Controle Manual de Terreno", beta_f3: "Calculadora de VGV", beta_f4: "Projetos Ilimitados", v1_f1: "Dados de Zoneamento Automáticos", v1_f2: "Volumetria Totalmente Modelável", v1_f3: "Exportação PDF Profissional", v1_f4: "Comparador de Terrenos", v2_f1: "Upload BIM/DWG para Análise", v2_f2: "Mapas de Calor Preditivos (IA)", v2_f3: "Recomendador 'Highest & Best Use'", v2_f4: "Inteligência Multicamadas", small_title: "Projeto pequeno?", small_desc: "Gere apenas um relatório PDF.", btn_pdf: "Comprar 1 Relatório ($17)", select_plan: "Escolha seu Plano", monthly: "Mensual", yearly: "Anual", save_pct: "ECONOMIZE 77%", save_amount_badge: "ECONOMIZE $999", plan_annual: "Founder Anual", plan_monthly: "Acesso Padrão", sub_annual: "Garante acesso v1.0 & v2.0.", sub_monthly: "Cancele quando quiser.", future_price: "Preço Futuro", btn_annual: "Garantir Preço Founder ($296)", btn_monthly: "Assinar Mensal", coupon_label: "Tem um código de acesso?", coupon_placeholder: "DIGITE SEU CUPOM", validate: "Validar", monthly_warning: "Ao selecionar mensal, você tem acesso apenas ao que está pronto hoje.", monthly_warning_highlight: "Mude para Anual para garantir V1.0 e V2.0" }
    }
  },

  // --- ESPANHOL (ES) ---
  es: {
    translation: {
      app: { title: "Cytyos Beta" },
      auth: {
        tab_signin: "Ingresar",
        tab_signup: "Crear Cuenta",
        email_label: "Correo",
        email_placeholder: "nombre@empresa.com", 
        password_label: "Contraseña",
        forgot_link: "¿Olvidaste la contraseña?",
        btn_signin: "Acceder a la Plataforma",
        btn_signup: "Registrarse Gratis",
        divider: "O CONTINUAR CON",
        google: "Google",
        forgot_title: "Recuperar Contraseña",
        forgot_desc: "Ingresa tu correo para recibir un enlace de acceso.",
        btn_send: "Enviar Enlace",
        btn_back: "Volver al Login",
        success_signup: "¡Cuenta creada! Verifica tu correo.",
        success_reset: "¡Enlace de recuperación enviado!",
        error_invalid: "Correo o contraseña inválidos.",
        error_exists: "Este correo ya existe. Intenta ingresar.",
        error_generic: "Ocurrió un error."
      },
      header: { 
        revenue: "Ingresos (VGV)", margin: "Margen", export: "Exportar PDF", load: "Cargar", save: "Guardar", zoning: "Contexto", roadmap: "Roadmap",
        session_title: "Sesión de Diagnóstico Gratis", session_time: "Restante"
      },
      tabs: { design: "Diseño", economics: "Viabilidad" },
      blocks: { height: "Altura", setback: "Retranqueo" },
      usage: { residential: "Residencial", corporate: "Corporativo", retail: "Comercial", hotel: "Hotel", parking: "Estacionamento", amenities: "Amenidades" },
      compliance: { title: "Normativa", legal: "Legal", violation: "Violación", far: "F.O.S", occ: "F.O.T" },
      results: { nsa: "Área Vendible", revenue: "Ingresos Totales", totalCost: "Costo Total", netProfit: "Ganancia Neta" },
      assumptions: { title: "Supuestos", maxFar: "Max FOS", maxOcc: "Max FOT %", landArea: "Área Terreno", landCost: "Costo Terreno", onerousGrant: "Impacto/Tasas", sales: "Venta $/m²", build: "Obra $/m²" },
      ai: { btn: "Consultor IA", thinking: "Analizando...", close: "Cerrar", insight: "Insight Estratégico", placeholder: "Pregunte sobre eficiencia...", limit_reached: "Límite de IA alcanzado para este cupón. Actualice a Founder." },
      onboarding: { title: "Iniciar Análisis", text: "Busque una ubicación y use la herramienta Dibujar." },
      map: { search_placeholder: "Buscar ubicación...", search_provider: "Búsqueda vía Mapbox", sat: "Sat", streets: "Mapa", draw: "Dibujar", clear: "Limpiar", delete_confirm_title: "¿Borrar diseño?", confirm: "Confirmar", cancel: "Cancelar" },
      
      // ATUALIZADO (ES)
      landing: {
        login: "Ingresar",
        hero: { 
            badge: "Beta Disponible", 
            title_prefix: "IA para Estudios de", 
            title_main: "Viabilidad y Volumetría en Segundos.", 
            title_anim: "Empieza a Analizar.", 
            subtitle: "Dibuja el terreno y recibe la masa 3D, cuadro de áreas y VGV al instante.", 
            btn_try: "Empezar Ahora", 
            btn_plans: "Ver Planes" 
        },
        roadmap_intro: "Construyendo el futuro de la inteligencia territorial.",
        footer_rights: "© 2026 Cytyos Inc."
      },

      roadmap: { title: "Visión y Futuro", cta: "Acceso Early Bird", col1: { tag: "En Vivo", title: "Hoy (Beta)", f1: "Visualización 3D", f2: "Control Manual", f3: "Calculadora ROI", f4: "Proyectos Ilimitados" }, col2: { tag: "Incluido", subtag: "Marzo", title: "Garantía Marzo (v1.0)", f1: "Datos Automáticos", f2: "Comparador", f3: "Exportar PDF", f4: "Volumetría Smart" }, col3: { tag: "Edición Founders", title: "Futuro 2026 (v2.0)", f1: "Mapas de Calor IA", f2: "Recomendador", f3: "Expansión Global", f4: "Multi-capas" } },
      footer: { disclaimer: "Cytyos es una herramienta de soporte. Resultados de IA varían." },
      pricing: { badge: "Oportunidad Founder", title: "Desbloquea la Plataforma", warning: "Precio subirá con v1.0.", beta_tag: "EN VIVO", beta_title: "Hoy (Beta)", v1_tag: "LLEGA MARZO", v1_title: "Garantía Marzo (v1.0)", v2_tag: "FUTURO 2026", v2_title: "Versión 2.0", beta_f1: "Visualización 3D", beta_f2: "Control Manual", beta_f3: "Calc. ROI", beta_f4: "Proyectos Ilimitados", v1_f1: "Datos Auto", v1_f2: "Volumetría Smart", v1_f3: "Exportar PDF", v1_f4: "Comparador", v2_f1: "Upload BIM/DWG", v2_f2: "Mapas de Calor IA", v2_f3: "Recomendador", v2_f4: "Multi-capas", small_title: "¿Proyecto pequeño?", small_desc: "1 Reporte PDF.", btn_pdf: "Comprar 1 Reporte ($17)", select_plan: "Elige tu Plan", monthly: "Mensual", yearly: "Anual", save_pct: "AHORRA 77%", save_amount_badge: "AHORRA $999", plan_annual: "Founder Anual", plan_monthly: "Acceso Estándar", sub_annual: "Acceso v1.0 & v2.0.", sub_monthly: "Cancela cuando quieras.", future_price: "Precio Futuro", btn_annual: "Asegurar Precio ($296)", btn_monthly: "Suscribir Mensual", coupon_label: "¿Tienes código?", coupon_placeholder: "CÓDIGO", validate: "Validar", monthly_warning: "Mensual solo da acceso a lo actual.", monthly_warning_highlight: "Cambia a Anual para v1.0 y v2.0" }
    }
  },

  // --- FRANCÊS (FR) ---
  fr: {
    translation: {
      app: { title: "Cytyos Bêta" },
      auth: {
        tab_signin: "Connexion",
        tab_signup: "Créer un Compte",
        email_label: "E-mail",
        email_placeholder: "nom@entreprise.com", 
        password_label: "Mot de passe",
        forgot_link: "Mot de passe oublié ?",
        btn_signin: "Accéder à la Plateforme",
        btn_signup: "Inscription Gratuite",
        divider: "OU CONTINUER AVEC",
        google: "Google",
        forgot_title: "Récupérer le Mot de Passe",
        forgot_desc: "Entrez votre e-mail pour recevoir un lien d'accès.",
        btn_send: "Envoyer le Lien",
        btn_back: "Retour à la Connexion",
        success_signup: "Compte créé ! Vérifiez votre e-mail.",
        success_reset: "Lien de récupération envoyé !",
        error_invalid: "E-mail ou mot de passe incorrect.",
        error_exists: "Cet e-mail existe déjà. Essayez de vous connecter.",
        error_generic: "Une erreur s'est produite."
      },
      header: { 
        revenue: "Revenus (VGV)", margin: "Marge", export: "Exporter PDF", load: "Ouvrir", save: "Sauver", zoning: "Contexte", roadmap: "Roadmap",
        session_title: "Session Diagnostic Gratuite", session_time: "Restant"
      },
      tabs: { design: "Conception", economics: "Économie" },
      blocks: { height: "Hauteur", setback: "Recul" },
      usage: { residential: "Résidentiel", corporate: "Corporatif", retail: "Commerce", hotel: "Hôtel", parking: "Parking", amenities: "Équipements" },
      compliance: { title: "Conformité", legal: "Légal", violation: "Violation", far: "COS", occ: "CES" },
      results: { nsa: "Surface Vendable", revenue: "Revenus Totaux", totalCost: "Coût Total", netProfit: "Bénéfice Net" },
      assumptions: { title: "Hypothèses", maxFar: "Max COS", maxOcc: "Max CES %", landArea: "Surface Terrain", landCost: "Coût Terrain", onerousGrant: "Taxes/Impact", sales: "Vente $/m²", build: "Construction $/m²" },
      ai: { btn: "Consultant IA", thinking: "Analyse...", close: "Fermer", insight: "Aperçu Stratégique", placeholder: "Demandez sur l'efficacité...", limit_reached: "Limite IA atteinte pour ce coupon. Passez à Founder." },
      onboarding: { title: "Démarrer l'Analyse", text: "Cherchez un lieu et utilisez l'outil Dessiner." },
      map: { search_placeholder: "Chercher un lieu...", search_provider: "Recherche via Mapbox", sat: "Sat", streets: "Plan", draw: "Dessiner", clear: "Effacer", delete_confirm_title: "Effacer le dessin ?", confirm: "Confirmer", cancel: "Annuler" },
      
      // ATUALIZADO (FR)
      landing: {
        login: "Connexion",
        hero: { 
            badge: "Bêta En Ligne", 
            title_prefix: "IA pour Études de", 
            title_main: "Faisabilité et Volumétrie en Secondes.", 
            title_anim: "Commencez l'Analyse.", 
            subtitle: "Dessinez le terrain et recevez la masse 3D, le tableau des surfaces et le GDV instantanément.", 
            btn_try: "Commencer Maintenant", 
            btn_plans: "Voir Plans" 
        },
        roadmap_intro: "Nous construisons le futur de l'intelligence territoriale.",
        footer_rights: "© 2026 Cytyos Inc."
      },

      roadmap: { title: "Vision", cta: "Accès Early Bird", col1: { tag: "En Ligne", title: "Aujourd'hui (Bêta)", f1: "Visualisation 3D", f2: "Contrôle Manuel", f3: "Calculateur ROI", f4: "Projets Illimités" }, col2: { tag: "Inclus", subtag: "Mars", title: "Garanti Mars (v1.0)", f1: "Données Auto", f2: "Comparateur", f3: "Export PDF", f4: "Volumétrie Smart" }, col3: { tag: "Édition Founders", title: "Futur 2026 (v2.0)", f1: "Cartes Thermiques IA", f2: "Recommandations", f3: "Expansion Globale", f4: "Intelligence Multi-couches" } },
      footer: { disclaimer: "Outil d'aide à la décision. Résultats IA variables." },
      pricing: { badge: "Opportunité Founder", title: "Débloquez tout", warning: "Prix augmente avec v1.0.", beta_tag: "EN LIGNE", beta_title: "Aujourd'hui (Bêta)", v1_tag: "ARRIVE MARS", v1_title: "Garanti Mars (v1.0)", v2_tag: "FUTUR 2026", v2_title: "Version 2.0", beta_f1: "Visu 3D", beta_f2: "Contrôle Manuel", beta_f3: "Calc. ROI", beta_f4: "Projets Illimités", v1_f1: "Données Auto", v1_f2: "Volumétrie Smart", v1_f3: "Export PDF", v1_f4: "Comparateur", v2_f1: "Upload BIM/DWG", v2_f2: "Cartes Thermiques IA", v2_f3: "Recommandations", v2_f4: "Multi-couches", small_title: "Petit projet ?", small_desc: "1 Rapport PDF.", btn_pdf: "Acheter 1 Rapport (17$)", select_plan: "Votre Plan", monthly: "Mensuel", yearly: "Annuel", save_pct: "-77%", save_amount_badge: "ÉCONOMISEZ 999$", plan_annual: "Founder Annuel", plan_monthly: "Accès Standard", sub_annual: "Accès v1.0 & v2.0.", sub_monthly: "Annulez quand vous voulez.", future_price: "Prix Futur", btn_annual: "Bloquer Prix (296$)", btn_monthly: "S'abonner", coupon_label: "Code d'accès ?", coupon_placeholder: "CODE", validate: "Valider", monthly_warning: "Mensuel donne accès uniquement à l'actuel.", monthly_warning_highlight: "Passez à l'Annuel pour v1.0 et v2.0" }
    }
  },

  // --- CHINÊS (ZH) ---
  zh: {
    translation: {
      app: { title: "Cytyos Beta" },
      auth: {
        tab_signin: "登录",
        tab_signup: "创建账户",
        email_label: "电子邮件",
        email_placeholder: "name@company.com", 
        password_label: "密码",
        forgot_link: "忘记密码？",
        btn_signin: "进入平台",
        btn_signup: "免费注册",
        divider: "或继续使用",
        google: "谷歌",
        forgot_title: "找回密码",
        forgot_desc: "输入您的电子邮件以接收访问链接。",
        btn_send: "发送链接",
        btn_back: "返回登录",
        success_signup: "账户已创建！请查收邮件。",
        success_reset: "恢复链接已发送！",
        error_invalid: "电子邮件或密码无效。",
        error_exists: "此电子邮件已注册。请尝试登录。",
        error_generic: "发生错误。"
      },
      header: { 
        revenue: "总收入 (GDV)", margin: "利润率", export: "导出 PDF", load: "加载", save: "保存", zoning: "背景", roadmap: "路线图",
        session_title: "免费诊断会话", session_time: "剩余"
      },
      tabs: { design: "设计", economics: "经济" },
      blocks: { height: "高度", setback: "退界" },
      usage: { residential: "住宅", corporate: "办公", retail: "商业", hotel: "酒店", parking: "停车场", amenities: "配套设施" },
      compliance: { title: "合规", legal: "合法", violation: "违规", far: "容积率", occ: "覆盖率" },
      results: { nsa: "可售面积", revenue: "总收入", totalCost: "总成本", netProfit: "净利润" },
      assumptions: { title: "假设", maxFar: "最大容积率", maxOcc: "最大覆盖率 %", landArea: "土地面积", landCost: "土地成本", onerousGrant: "费用/税收", sales: "销售 $/m²", build: "建筑成本 $/m²" },
      ai: { btn: "AI 顾问", thinking: "分析中...", close: "关闭", insight: "战略洞察", placeholder: "询问效率...", limit_reached: "此优惠券的AI限制已达。升级至Founder。" },
      onboarding: { title: "开始分析", text: "搜索位置并使用绘图工具。" },
      map: { search_placeholder: "搜索位置...", search_provider: "Mapbox 搜索", sat: "卫星", streets: "地图", draw: "绘图", clear: "清除", delete_confirm_title: "删除设计？", confirm: "确认", cancel: "取消" },
      
      // ATUALIZADO (ZH)
      landing: {
        login: "登录",
        hero: { 
            badge: "Beta 上线", 
            title_prefix: "用于可行性研究和", 
            title_main: "体量分析的 AI，仅需几秒。", 
            title_anim: "开始分析。", 
            subtitle: "绘制地块，即刻获得 3D 体量、面积表和总开发价值 (GDV)。", 
            btn_try: "立即开始", 
            btn_plans: "查看计划" 
        },
        roadmap_intro: "我们正在构建领土智能的未来。",
        footer_rights: "© 2026 Cytyos Inc."
      },

      roadmap: { title: "愿景", cta: "早鸟特惠", col1: { tag: "在线", title: "今日 (Beta)", f1: "3D 可视化", f2: "手动控制", f3: "ROI 计算器", f4: "无限项目" }, col2: { tag: "包含", subtag: "三月", title: "三月更新 (v1.0)", f1: "自动数据", f2: "场地比较", f3: "PDF 导出", f4: "智能体量" }, col3: { tag: "创始人版", title: "未来 2026 (v2.0)", f1: "AI 热力图", f2: "最佳用途推荐", f3: "全球扩展", f4: "多层智能" } },
      footer: { disclaimer: "决策支持工具。AI 结果可能不同。" },
      pricing: { badge: "创始人机会", title: "解锁平台", warning: "v1.0 后价格上涨。", beta_tag: "上线", beta_title: "今日可用 (Beta)", v1_tag: "三月发布", v1_title: "三月保证 (v1.0)", v2_tag: "创始人版", v2_title: "未来 2026 (v2.0)", beta_f1: "3D 可视化", beta_f2: "手动控制", beta_f3: "ROI 计算器", beta_f4: "无限项目", v1_f1: "自动数据", v1_f2: "智能体量", v1_f3: "PDF 导出", v1_f4: "比较工具", v2_f1: "BIM/DWG 上传", v2_f2: "AI 热力图", v2_f3: "最佳推荐", v2_f4: "多层智能", small_title: "小型项目？", small_desc: "1 份 PDF 报告。", btn_pdf: "购买报告 ($17)", select_plan: "选择计划", monthly: "按月", yearly: "按年", save_pct: "省 77%", save_amount_badge: "省 $999", plan_annual: "创始人年度", plan_monthly: "标准访问", sub_annual: "包含 v1.0 & v2.0。", sub_monthly: "随时取消。", future_price: "未来价格", btn_annual: "锁定价格 ($296)", btn_monthly: "订阅", coupon_label: "有代码？", coupon_placeholder: "代码", validate: "验证", monthly_warning: "按月仅包含当前功能。", monthly_warning_highlight: "切换按年以锁定 v1.0 & v2.0" }
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