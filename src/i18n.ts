import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Design", economics: "Economics" },
      header: { revenue: "Revenue (GDV)", margin: "Margin", export: "Export PDF", load: "Load", save: "Save" },
      compliance: { title: "Compliance", legal: "Legal", violation: "Violation", far: "FAR (Floor Area Ratio)", occ: "Occupancy Rate" },
      assumptions: { title: "Assumptions", landArea: "Land Area", landCost: "Land Cost", sales: "Sales/m²", build: "Build/m²" },
      results: { nsa: "NSA (Sellable)", revenue: "Total Revenue", totalCost: "Total Cost", netProfit: "Net Profit" },
      blocks: { active: "Active Volumes", height: "Height", setback: "Setback" },
      ai: { btn: "AI Consultant", thinking: "Analyzing...", close: "Close", insight: "AI Strategic Insight", placeholder: "Ask about efficiency, profit optimization, or risks..." },
      usage: { residential: "Residential", corporate: "Corporate Office", retail: "Retail / Mall", hotel: "Hotel", parking: "Parking Garage", amenities: "Amenities" },
      currency: { main: "Major", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "Cytyos is a decision support tool. AI results may vary. Always consult a technical professional." },
      // --- NEW KEYS ---
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
      }
    }
  },
  pt: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Projeto", economics: "Viabilidade" },
      header: { revenue: "VGV Total", margin: "Margem Líq.", export: "Exportar PDF", load: "Abrir", save: "Salvar" },
      compliance: { title: "Legislação", legal: "Legal", violation: "Infração", far: "C.A. (Aproveitamento)", occ: "T.O. (Ocupação)" },
      assumptions: { title: "Premissas", landArea: "Área Terreno", landCost: "Custo Terreno", sales: "Venda/m²", build: "Obra/m²" },
      results: { nsa: "Área Privativa", revenue: "Receita (VGV)", totalCost: "Custo Total", netProfit: "Lucro Líquido" },
      blocks: { active: "Volumetria", height: "Altura", setback: "Recuo" },
      ai: { btn: "Consultor IA", thinking: "Analisando...", close: "Fechar", insight: "Análise Estratégica", placeholder: "Pergunte sobre margem, leis..." },
      usage: { residential: "Residencial", corporate: "Corporativo", retail: "Varejo / Lojas", hotel: "Hotel", parking: "Edifício Garagem", amenities: "Áreas Comuns" },
      currency: { main: "Principais", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "O Cytyos é uma ferramenta de suporte à decisão. A IA pode variar. Consulte sempre um responsável técnico." },
      // --- NEW KEYS TRANSLATED ---
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
      }
    }
  },
  es: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Diseño", economics: "Economía" },
      header: { revenue: "Ingresos (GDV)", margin: "Margen", export: "Exportar PDF", load: "Cargar", save: "Guardar" },
      compliance: { title: "Normativa", legal: "Legal", violation: "Violación", far: "FOT (C.A.)", occ: "FOS (T.O.)" },
      assumptions: { title: "Supuestos", landArea: "Área Lote", landCost: "Costo Lote", sales: "Venta/m²", build: "Obra/m²" },
      results: { nsa: "Área Vendible", revenue: "Ingresos", totalCost: "Costo Total", netProfit: "Ganancia Neta" },
      blocks: { active: "Volúmenes", height: "Altura", setback: "Retiro" },
      ai: { btn: "Consultar IA", thinking: "Pensando...", close: "Cerrar", insight: "Insight IA", placeholder: "Pregunta sobre el proyecto..." },
      usage: { residential: "Residencial", corporate: "Oficinas", retail: "Comercial", hotel: "Hotel", parking: "Estacionamiento", amenities: "Amenidades" },
      currency: { main: "Principales", latam: "Latam (Pesos)", global: "Global" },
      footer: { disclaimer: "Cytyos es una herramienta de soporte. Los resultados de la IA pueden variar. Consulte a un profesional." },
      // --- NEW KEYS TRANSLATED ---
      map: {
        search_placeholder: "Buscar ubicación (Ciudad, Dirección)...",
        search_provider: "Búsqueda vía Mapbox",
        sat: "Sat",
        streets: "Mapa",
        draw: "Dibujar",
        clear: "Borrar",
        delete_confirm_title: "¿Borrar diseño?",
        confirm: "Confirmar",
        cancel: "Cancelar"
      },
      onboarding: {
        title: "Iniciar Análisis",
        text: "Busca una ubicación y usa la herramienta <1>Dibujar</1> para definir el contorno del lote."
      }
    }
  },
  fr: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "Conception", economics: "Économie" },
      header: { revenue: "Revenus", margin: "Marge", export: "Exporter", load: "Ouvrir", save: "Sauver" },
      compliance: { title: "Conformité", legal: "Légal", violation: "Violation", far: "COS", occ: "CES" },
      assumptions: { title: "Hypothèses", landArea: "Surface Terrain", landCost: "Coût Terrain", sales: "Vente/m²", build: "Coût Const./m²" },
      results: { nsa: "Surf. Vendable", revenue: "Revenus", totalCost: "Coût Total", netProfit: "Bénéfice Net" },
      blocks: { active: "Volumes", height: "Hauteur", setback: "Recul" },
      ai: { btn: "Consulter IA", thinking: "Analyse...", close: "Fermer", insight: "Aperçu IA", placeholder: "Demandez conseil..." },
      usage: { residential: "Résidentiel", corporate: "Bureaux", retail: "Commerce", hotel: "Hôtel", parking: "Parking", amenities: "Équipements" },
      currency: { main: "Principales", latam: "Latam (Pesos)", global: "Mondial" },
      footer: { disclaimer: "Cytyos est un outil d'aide à la décision. L'IA peut varier. Consultez toujours un professionnel." },
      // --- NEW KEYS TRANSLATED ---
      map: {
        search_placeholder: "Rechercher un lieu...",
        search_provider: "Recherche via Mapbox",
        sat: "Sat",
        streets: "Plan",
        draw: "Dessiner",
        clear: "Effacer",
        delete_confirm_title: "Supprimer ?",
        confirm: "Confirmer",
        cancel: "Annuler"
      },
      onboarding: {
        title: "Commencer",
        text: "Recherchez une adresse et utilisez l'outil <1>Dessiner</1> pour définir le contour."
      }
    }
  },
  zh: {
    translation: {
      app: { title: "Cytyos Beta" },
      tabs: { design: "设计", economics: "经济分析" },
      header: { revenue: "总收入 (GDV)", margin: "净利润率", export: "导出PDF", load: "加载", save: "保存" },
      compliance: { title: "合规性", legal: "合法", violation: "违规", far: "容积率 (FAR)", occ: "建筑密度" },
      assumptions: { title: "假设条件", landArea: "土地面积", landCost: "土地成本", sales: "售价/m²", build: "建造成本/m²" },
      results: { nsa: "可售面积", revenue: "总收入", totalCost: "总成本", netProfit: "净利润" },
      blocks: { active: "建筑体量", height: "高度", setback: "退界" },
      ai: { btn: "咨询 AI 分析师", thinking: "思考中...", close: "关闭", insight: "AI 洞察", placeholder: "询问有关利润或法规的问题..." },
      usage: { residential: "住宅", corporate: "办公楼", retail: "商业零售", hotel: "酒店", parking: "停车场", amenities: "配套设施" },
      currency: { main: "主要货币", latam: "拉美货币", global: "全球货币" },
      footer: { disclaimer: "Cytyos 是一种决策支持工具。AI 结果可能会有所不同。请务必咨询专业人士。" },
      // --- NEW KEYS TRANSLATED ---
      map: {
        search_placeholder: "搜索位置...",
        search_provider: "通过 Mapbox 搜索",
        sat: "卫星",
        streets: "地图",
        draw: "绘制",
        clear: "清除",
        delete_confirm_title: "删除设计？",
        confirm: "确认",
        cancel: "取消"
      },
      onboarding: {
        title: "开始分析",
        text: "搜索地址，然后使用 <1>绘制</1> 工具定义地块轮廓。"
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
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;