import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  EN: {
    translation: {
      "navbar": {
        "search_placeholder": "Search trends...",
        "home": "Home",
        "trends": "Trends",
        "dashboard": "Dashboard",
        "login": "Login"
      },
      "sidebar": {
        "dashboard": "Dashboard",
        "trends": "Trends",
        "opportunities": "Opportunities",
        "insights": "Insights",
        "pricing": "Pricing",
        "radar_scanning": "Scanning live signals",
        "radar_label": "Radar scanning market signals",
        "updated_now": "Updated just now"
      },
      "footer": {
        "made_by": "Made with ❤️ by Aneesha",
        "buy_coffee": "Buy me a coffee"
      },
      "home": {
        "hero_title_1": "See ",
        "hero_title_highlight": "Tomorrow's",
        "hero_title_2": " Trends Before They Become Obvious",
        "hero_subtitle": "Our AI scans news, conversations, and communities across the internet to detect emerging trends early.",
        "explore_trends": "Explore Trends",
        "open_dashboard": "Open Dashboard",
        "used_by": "Used by founders, analysts, and curious builders exploring the future."
      },
      "home_usecases": {
        "section_title": "How the Platform Works",
        "section_subtitle": "Transform your market research with AI-powered workflows designed specifically for modern strategy teams.",
        "detection_title": "Trend Detection",
        "detection_desc": "AI continuously scans news, startup launches, and research signals to identify emerging patterns.",
        "clustering_title": "Signal Clustering",
        "clustering_desc": "Related signals are grouped together into clear trend categories using AI analysis.",
        "momentum_title": "Momentum Tracking",
        "momentum_desc": "Trends are ranked based on velocity, engagement, and cross-platform signals.",
        "opportunity_title": "Opportunity Discovery",
        "opportunity_desc": "Explore insights, signals, and potential opportunities connected to each trend."
      },
      "home_testimonials": {
        "quote": "\"This tool helps our team detect emerging ideas much earlier than traditional research reports.\"",
        "role": "Innovation Analyst"
      },
      "home_metrics": {
        "signals": "Signals analyzed",
        "trends": "Active trends tracked",
        "communities": "Communities scanned",
        "insights": "Insights generated"
      },
      "home_faq": {
        "section_title": "Frequently Asked Questions",
        "q1": "How are trends detected?",
        "a1": "Our AI continuously monitors global news, social discussions, and industry forums to identify early-stage signals.",
        "q2": "Where does the data come from?",
        "a2": "Signals are aggregated from global news sources, discussion forums, and community platforms to provide a broad signal landscape.",
        "q3": "How often are trends updated?",
        "a3": "The platform scans for new signals in real-time and updates trend velocity scores and clustering dynamically.",
        "q4": "Can I explore trends from different industries?",
        "a4": "Yes. Our platform categorizes trends across technology, finance, health, business, and culture, allowing you to filter based on your specific focus area."
      },
      "dashboard": {
        "title": "Dashboard",
        "subtitle": "Overview of detected trends and live market signals.",
        "top_trends": "Top Detected Trends",
        "all_trends": "All Trends",
        "live_search": "Live Trend Search",
        "live_search_desc": "Search any topic and get real-time results with AI-generated insights.",
        "open_search": "Open Search",
        "status_breakdown": "Trend Status Breakdown",
        "live_feed": "Live Signal Feed",
        "fetching": "Fetching live signals…",
        "no_signals": "No signals available right now.",
        "search_trends": "Search live trends →",
        "engagement": "engagement",
        "no_trends": "No trends found. Try searching a topic.",
        "api_error": "Using curated data — live API is not connected.",
        "hot": "Hot",
        "rising": "Rising",
        "emerging": "Emerging",
        "score_gte8": "Score ≥ 8.0",
        "score_5_8": "Score 5.0–7.9",
        "score_lt5": "Score < 5.0"
      },
      "trends": {
        "title": "Live Trend Search",
        "subtitle": "Real-time signals from global news, discussions & communities — with AI insights & startup ideas.",
        "search_placeholder": "Search anything — \"AI agents\", \"climate tech\", \"fintech\"…",
        "found": "trends found",
        "search_anything": "Search anything",
        "search_desc": "Get live trend data with AI insights, why it matters, and startup ideas.",
        "scanning": "Scanning global signals…",
        "generating": "Generating AI insights & startup ideas for",
        "failed": "Search failed",
        "no_found": "No trends found for",
        "try_different": "Try a different keyword or broaden your search.",
        "load_more": "Load more",
        "click_insights": "Click for AI insights & startup ideas",
        "ai_insight": "AI Insight",
        "why_matters": "Why It Matters",
        "startup_ideas": "Startup Ideas",
        "who_cares": "Who Should Care",
        "signal_metrics": "Signal Metrics",
        "sources": "Sources"
      },
      "opportunities": {
        "title": "Top Opportunities",
        "subtitle": "High-potential trends converted into actionable business opportunities.",
        "none": "No high-potential opportunities detected yet.",
        "none_desc": "Opportunities appear when trends score above 7.0",
        "why_matters": "Why it matters",
        "who_cares": "Who should care",
        "opportunity": "Opportunity",
        "explore_opportunity": "Explore opportunity",
        "api_error": "Using curated data — live API is not connected."
      },
      "insights": {
        "title": "Insights",
        "subtitle": "Dynamic intelligence summary from current trend and market data.",
        "emerging_pct": "of trends are Emerging",
        "top_category": "top category this month",
        "fastest_growing": "fastest growing",
        "avg_score": "average score / 10",
        "by_category": "By Category",
        "status_overview": "All Trends — Status Overview",
        "hot": "Hot",
        "rising": "Rising",
        "emerging": "Emerging",
        "no_data": "No trend data available yet."
      }
    }
  },
  ES: {
    translation: {
      "navbar": {
        "search_placeholder": "Buscar tendencias...",
        "home": "Inicio",
        "trends": "Tendencias",
        "dashboard": "Panel",
        "login": "Iniciar sesión"
      },
      "sidebar": {
        "dashboard": "Panel",
        "trends": "Tendencias",
        "opportunities": "Oportunidades",
        "insights": "Perspectivas",
        "pricing": "Precios",
        "radar_scanning": "Escaneando señales en vivo",
        "radar_label": "Radar escaneando señales de mercado",
        "updated_now": "Actualizado ahora mismo"
      },
      "footer": {
        "made_by": "Hecho con ❤️ por Aneesha",
        "buy_coffee": "Cómprame un café"
      },
      "home": {
        "hero_title_1": "Vea las tendencias del ",
        "hero_title_highlight": "mañana",
        "hero_title_2": " antes de que sean evidentes",
        "hero_subtitle": "Nuestra IA escanea noticias, conversaciones y comunidades en todo Internet para detectar tendencias emergentes a tiempo.",
        "explore_trends": "Explorar tendencias",
        "open_dashboard": "Abrir panel",
        "used_by": "Usado por fundadores, analistas y constructores curiosos que exploran el futuro."
      },
      "home_usecases": {
        "section_title": "Cómo funciona la plataforma",
        "section_subtitle": "Transforme su investigación de mercado con flujos de trabajo impulsados por IA diseñados específicamente para equipos de estrategia modernos.",
        "detection_title": "Detección de tendencias",
        "detection_desc": "La IA escanea continuamente noticias, lanzamientos de startups y señales de investigación para identificar patrones emergentes.",
        "clustering_title": "Agrupación de señales",
        "clustering_desc": "Las señales relacionadas se agrupan en categorías de tendencias claras mediante análisis de IA.",
        "momentum_title": "Seguimiento de impulso",
        "momentum_desc": "Las tendencias se clasifican en función de la velocidad, la participación y las señales multiplataforma.",
        "opportunity_title": "Descubrimiento de oportunidades",
        "opportunity_desc": "Explore información, señales y oportunidades potenciales conectadas a cada tendencia."
      },
      "home_testimonials": {
        "quote": "\"Esta herramienta ayuda a nuestro equipo a detectar ideas emergentes mucho antes que los informes de investigación tradicionales.\"",
        "role": "Analista de innovación"
      },
      "home_metrics": {
        "signals": "Señales analizadas",
        "trends": "Tendencias activas rastreadas",
        "communities": "Comunidades escaneadas",
        "insights": "Información generada"
      },
      "home_faq": {
        "section_title": "Preguntas frecuentes",
        "q1": "¿Cómo se detectan las tendencias?",
        "a1": "Nuestra IA monitorea continuamente noticias globales y foros de discusión para identificar señales en etapas iniciales.",
        "q2": "¿De dónde provienen los datos?",
        "a2": "Las señales se agregan desde fuentes de noticias globales, foros de discusión y plataformas comunitarias.",
        "q3": "¿Con qué frecuencia se actualizan las tendencias?",
        "a3": "La plataforma escanea nuevas señales en tiempo real y actualiza puntajes de velocidad de tendencia dinámicamente.",
        "q4": "¿Puedo explorar tendencias de diferentes industrias?",
        "a4": "Sí. Nuestra plataforma clasifica las tendencias en tecnología, finanzas, salud, negocios y cultura."
      },
      "dashboard": {
        "title": "Panel",
        "subtitle": "Resumen de tendencias detectadas y señales de mercado en vivo.",
        "top_trends": "Tendencias principales detectadas",
        "all_trends": "Todas las tendencias",
        "live_search": "Búsqueda de tendencias en vivo",
        "live_search_desc": "Busca cualquier tema y obtén resultados en tiempo real con perspectivas generadas por IA.",
        "open_search": "Abrir búsqueda",
        "status_breakdown": "Resumen de estado de tendencias",
        "live_feed": "Feed de señales en vivo",
        "fetching": "Obteniendo señales en vivo…",
        "no_signals": "No hay señales disponibles ahora.",
        "search_trends": "Buscar tendencias en vivo →",
        "engagement": "participación",
        "no_trends": "No se encontraron tendencias. Intenta buscar un tema.",
        "api_error": "Usando datos curados — la API en vivo no está conectada.",
        "hot": "Caliente",
        "rising": "En alza",
        "emerging": "Emergente",
        "score_gte8": "Puntuación ≥ 8.0",
        "score_5_8": "Puntuación 5.0–7.9",
        "score_lt5": "Puntuación < 5.0"
      },
      "trends": {
        "title": "Búsqueda de tendencias en vivo",
        "subtitle": "Señales en tiempo real de noticias y comunidades globales — con perspectivas de IA e ideas de startups.",
        "search_placeholder": "Busca cualquier cosa — \"agentes de IA\", \"tecnología climática\"…",
        "found": "tendencias encontradas",
        "search_anything": "Busca cualquier cosa",
        "search_desc": "Obtén datos de tendencias en vivo con perspectivas de IA, por qué importa e ideas de startups.",
        "scanning": "Escaneando señales globales…",
        "generating": "Generando perspectivas de IA y startups para",
        "failed": "Búsqueda fallida",
        "no_found": "No se encontraron tendencias para",
        "try_different": "Intenta una palabra clave diferente o amplía tu búsqueda.",
        "load_more": "Cargar más",
        "click_insights": "Haz clic para perspectivas de IA e ideas de startups",
        "ai_insight": "Perspectiva de IA",
        "why_matters": "Por qué importa",
        "startup_ideas": "Ideas de startups",
        "who_cares": "Quién debería preocuparse",
        "signal_metrics": "Métricas de señal",
        "sources": "Fuentes"
      },
      "opportunities": {
        "title": "Mejores oportunidades",
        "subtitle": "Tendencias de alto potencial convertidas en oportunidades de negocio accionables.",
        "none": "No se han detectado oportunidades de alto potencial todavía.",
        "none_desc": "Las oportunidades aparecen cuando las tendencias puntúan por encima de 7.0",
        "why_matters": "Por qué importa",
        "who_cares": "Quién debería preocuparse",
        "opportunity": "Oportunidad",
        "explore_opportunity": "Explorar oportunidad",
        "api_error": "Usando datos curados — la API en vivo no está conectada."
      },
      "insights": {
        "title": "Perspectivas",
        "subtitle": "Resumen de inteligencia dinámica de datos de tendencias y mercado actuales.",
        "emerging_pct": "de tendencias son Emergentes",
        "top_category": "categoría principal este mes",
        "fastest_growing": "de más rápido crecimiento",
        "avg_score": "puntuación media / 10",
        "by_category": "Por categoría",
        "status_overview": "Todas las tendencias — Resumen de estado",
        "hot": "Caliente",
        "rising": "En alza",
        "emerging": "Emergente",
        "no_data": "No hay datos de tendencias disponibles todavía."
      }
    }
  },
  HI: {
    translation: {
      "navbar": {
        "search_placeholder": "रुझान खोजें...",
        "home": "होम",
        "trends": "रुझान",
        "dashboard": "डैशबोर्ड",
        "login": "लॉग इन"
      },
      "sidebar": {
        "dashboard": "डैशबोर्ड",
        "trends": "रुझान",
        "opportunities": "अवसर",
        "insights": "अंतर्दृष्टि",
        "pricing": "मूल्य निर्धारण",
        "radar_scanning": "लाइव संकेत स्कैन कर रहे हैं",
        "radar_label": "राडार बाजार संकेत स्कैन कर रहा है",
        "updated_now": "अभी अपडेट किया गया"
      },
      "footer": {
        "made_by": "अनीशा द्वारा ❤️ के साथ निर्मित",
        "buy_coffee": "मेरे लिए एक कॉफ़ी खरीदें"
      },
      "home": {
        "hero_title_1": "प्रत्यक्ष होने से पहले ",
        "hero_title_highlight": "कल",
        "hero_title_2": " के रुझान देखें",
        "hero_subtitle": "हमारा AI उभरते रुझानों का जल्दी पता लगाने के लिए इंटरनेट पर समाचार, बातचीत और समुदायों को स्कैन करता है।",
        "explore_trends": "रुझान देखें",
        "open_dashboard": "डैशबोर्ड खोलें",
        "used_by": "भविष्य की खोज करने वाले संस्थापकों, विश्लेषकों द्वारा उपयोग किया जाता है।"
      },
      "home_usecases": {
        "section_title": "प्लेटफ़ॉर्म कैसे काम करता है",
        "section_subtitle": "आधुनिक रणनीति टीमों के लिए AI-संचालित वर्कफ़्लो के साथ अपने बाज़ार अनुसंधान को बदलें।",
        "detection_title": "रुझान का पता लगाना",
        "detection_desc": "AI उभरते पैटर्न की पहचान करने के लिए समाचार और स्टार्टअप लॉन्च को लगातार स्कैन करता है।",
        "clustering_title": "संकेत समूहीकरण",
        "clustering_desc": "संबंधित संकेतों को AI विश्लेषण का उपयोग करके स्पष्ट रुझान श्रेणियों में समूहीकृत किया जाता है।",
        "momentum_title": "गति ट्रैकिंग",
        "momentum_desc": "रुझानों को वेग, सहभागिता, और क्रॉस-प्लेटफ़ॉर्म संकेतों के आधार पर रैंक किया जाता है।",
        "opportunity_title": "अवसर की खोज",
        "opportunity_desc": "प्रत्येक रुझान से जुड़े अंतर्दृष्टि और संभावित अवसरों का अन्वेषण करें।"
      },
      "home_testimonials": {
        "quote": "\"यह टूल हमारी टीम को पारंपरिक शोध रिपोर्टों की तुलना में बहुत पहले उभरते विचारों का पता लगाने में मदद करता है।\"",
        "role": "नवाचार विश्लेषक"
      },
      "home_metrics": {
        "signals": "विश्लेषित संकेत",
        "trends": "सक्रिय रुझान ट्रैक किए गए",
        "communities": "स्कैन किए गए समुदाय",
        "insights": "उत्पन्न अंतर्दृष्टि"
      },
      "home_faq": {
        "section_title": "अक्सर पूछे जाने वाले प्रश्न",
        "q1": "रुझानों का पता कैसे लगाया जाता है?",
        "a1": "हमारी AI वैश्विक समाचार, सोशल चर्चाओं और उद्योग फ़ोरम की लगातार निगरानी करती है।",
        "q2": "डेटा कहाँ से आता है?",
        "a2": "संकेतों को वैश्विक समाचार स्रोतों और चर्चा मंचों से एकत्रित किया जाता है।",
        "q3": "रुझान कितनी बार अपडेट होते हैं?",
        "a3": "प्लेटफ़ॉर्म वास्तविक समय में नए संकेतों के लिए स्कैन करता है।",
        "q4": "क्या मैं विभिन्न उद्योगों के रुझानों का पता लगा सकता हूँ?",
        "a4": "हां. हमारा प्लेटफ़ॉर्म रुझानों को प्रौद्योगिकी, वित्त, स्वास्थ्य, व्यवसाय और संस्कृति में वर्गीकृत करता है।"
      },
      "dashboard": {
        "title": "डैशबोर्ड",
        "subtitle": "पता लगाए गए रुझानों और लाइव बाजार संकेतों का अवलोकन।",
        "top_trends": "शीर्ष पता लगाए गए रुझान",
        "all_trends": "सभी रुझान",
        "live_search": "लाइव ट्रेंड सर्च",
        "live_search_desc": "किसी भी विषय को खोजें और AI-जनित अंतर्दृष्टि के साथ वास्तविक समय परिणाम प्राप्त करें।",
        "open_search": "खोज खोलें",
        "status_breakdown": "ट्रेंड स्टेटस ब्रेकडाउन",
        "live_feed": "लाइव सिग्नल फ़ीड",
        "fetching": "लाइव सिग्नल प्राप्त हो रहे हैं…",
        "no_signals": "अभी कोई सिग्नल उपलब्ध नहीं है।",
        "search_trends": "लाइव रुझान खोजें →",
        "engagement": "सहभागिता",
        "no_trends": "कोई रुझान नहीं मिला। कोई विषय खोजें।",
        "api_error": "क्यूरेटेड डेटा का उपयोग — लाइव API कनेक्ट नहीं है।",
        "hot": "गर्म",
        "rising": "उभरते",
        "emerging": "नया",
        "score_gte8": "स्कोर ≥ 8.0",
        "score_5_8": "स्कोर 5.0–7.9",
        "score_lt5": "स्कोर < 5.0"
      },
      "trends": {
        "title": "लाइव ट्रेंड सर्च",
        "subtitle": "वैश्विक समाचार और समुदायों से वास्तविक समय संकेत — AI अंतर्दृष्टि और स्टार्टअप विचारों के साथ।",
        "search_placeholder": "कुछ भी खोजें — \"AI एजेंट\", \"जलवायु तकनीक\"…",
        "found": "रुझान मिले",
        "search_anything": "कुछ भी खोजें",
        "search_desc": "AI अंतर्दृष्टि, यह क्यों मायने रखता है, और स्टार्टअप विचारों के साथ लाइव ट्रेंड डेटा प्राप्त करें।",
        "scanning": "वैश्विक संकेत स्कैन हो रहे हैं…",
        "generating": "AI अंतर्दृष्टि और स्टार्टअप विचार उत्पन्न हो रहे हैं",
        "failed": "खोज विफल",
        "no_found": "के लिए कोई रुझान नहीं मिला",
        "try_different": "एक अलग कीवर्ड आज़माएं या अपनी खोज बढ़ाएं।",
        "load_more": "और लोड करें",
        "click_insights": "AI अंतर्दृष्टि और स्टार्टअप विचारों के लिए क्लिक करें",
        "ai_insight": "AI अंतर्दृष्टि",
        "why_matters": "यह क्यों मायने रखता है",
        "startup_ideas": "स्टार्टअप विचार",
        "who_cares": "किसे ध्यान देना चाहिए",
        "signal_metrics": "सिग्नल मेट्रिक्स",
        "sources": "स्रोत"
      },
      "opportunities": {
        "title": "शीर्ष अवसर",
        "subtitle": "उच्च-क्षमता वाले रुझानों को कार्रवाई योग्य व्यावसायिक अवसरों में परिवर्तित किया गया।",
        "none": "अभी तक कोई उच्च-क्षमता वाला अवसर नहीं मिला।",
        "none_desc": "जब रुझान 7.0 से ऊपर स्कोर करते हैं तो अवसर दिखाई देते हैं।",
        "why_matters": "यह क्यों मायने रखता है",
        "who_cares": "किसे ध्यान देना चाहिए",
        "opportunity": "अवसर",
        "explore_opportunity": "अवसर देखें",
        "api_error": "क्यूरेटेड डेटा का उपयोग — लाइव API कनेक्ट नहीं है।"
      },
      "insights": {
        "title": "अंतर्दृष्टि",
        "subtitle": "वर्तमान रुझान और बाजार डेटा से गतिशील बुद्धिमत्ता सारांश।",
        "emerging_pct": "रुझान उभरते हैं",
        "top_category": "इस महीने की शीर्ष श्रेणी",
        "fastest_growing": "सबसे तेज़ बढ़ रहा है",
        "avg_score": "औसत स्कोर / 10",
        "by_category": "श्रेणी के अनुसार",
        "status_overview": "सभी रुझान — स्थिति अवलोकन",
        "hot": "गर्म",
        "rising": "उभरते",
        "emerging": "नया",
        "no_data": "अभी तक कोई ट्रेंड डेटा उपलब्ध नहीं है।"
      }
    }
  },
  ZH: {
    translation: {
      "navbar": {
        "search_placeholder": "搜索趋势...",
        "home": "主页",
        "trends": "趋势",
        "dashboard": "仪表板",
        "login": "登录"
      },
      "sidebar": {
        "dashboard": "仪表板",
        "trends": "趋势",
        "opportunities": "机会",
        "insights": "洞察",
        "pricing": "定价",
        "radar_scanning": "扫描实时信号",
        "radar_label": "雷达扫描市场信号",
        "updated_now": "刚刚更新"
      },
      "footer": {
        "made_by": "由 Aneesha ❤️ 制作",
        "buy_coffee": "请我喝咖啡"
      },
      "home": {
        "hero_title_1": "在",
        "hero_title_highlight": "明天的",
        "hero_title_2": "趋势变得显而易见之前看到它们",
        "hero_subtitle": "我们的 AI 扫描互联网上的新闻、对话和社区，以早期发现新兴趋势。",
        "explore_trends": "探索趋势",
        "open_dashboard": "打开仪表板",
        "used_by": "被探索未来的创始人、分析师和好奇的建造者使用。"
      },
      "home_usecases": {
        "section_title": "平台如何运作",
        "section_subtitle": "使用专为现代战略团队设计的 AI 驱动工作流程转变您的市场研究。",
        "detection_title": "趋势检测",
        "detection_desc": "AI 持续扫描新闻、初创公司动态和研究信号以识别新兴模式。",
        "clustering_title": "信号聚类",
        "clustering_desc": "相关信号使用 AI 分析分组到清晰的趋势类别中。",
        "momentum_title": "势头跟踪",
        "momentum_desc": "趋势根据速度、参与度和跨平台信号进行排名。",
        "opportunity_title": "机会发现",
        "opportunity_desc": "探索与每个趋势相关的见解、信号和潜在机会。"
      },
      "home_testimonials": {
        "quote": "\"这个工具帮助我们的团队比传统研究报告更早地发现新兴想法。\"",
        "role": "创新分析师"
      },
      "home_metrics": {
        "signals": "分析的信号",
        "trends": "跟踪的活跃趋势",
        "communities": "扫描的社区",
        "insights": "生成的洞察"
      },
      "home_faq": {
        "section_title": "常见问题",
        "q1": "趋势如何被检测？",
        "a1": "我们的 AI 持续监控全球新闻、社会讨论和行业论坛，以识别早期信号。",
        "q2": "数据来自哪里？",
        "a2": "信号从全球新闻来源、讨论论坛和社区平台聚合。",
        "q3": "趋势多久更新一次？",
        "a3": "该平台实时扫描新信号，并动态更新趋势速度分数。",
        "q4": "我可以探索不同行业的趋势吗？",
        "a4": "是的。我们的平台将趋势分类为技术、金融、健康、商业和文化。"
      },
      "dashboard": {
        "title": "仪表板",
        "subtitle": "检测到的趋势和实时市场信号概览。",
        "top_trends": "顶部检测到的趋势",
        "all_trends": "所有趋势",
        "live_search": "实时趋势搜索",
        "live_search_desc": "搜索任何主题，获取带有 AI 生成见解的实时结果。",
        "open_search": "打开搜索",
        "status_breakdown": "趋势状态细分",
        "live_feed": "实时信号提要",
        "fetching": "正在获取实时信号…",
        "no_signals": "现在没有可用的信号。",
        "search_trends": "搜索实时趋势 →",
        "engagement": "参与度",
        "no_trends": "未找到趋势。请尝试搜索主题。",
        "api_error": "使用精选数据 — 实时 API 未连接。",
        "hot": "热门",
        "rising": "上升",
        "emerging": "新兴",
        "score_gte8": "分数 ≥ 8.0",
        "score_5_8": "分数 5.0–7.9",
        "score_lt5": "分数 < 5.0"
      },
      "trends": {
        "title": "实时趋势搜索",
        "subtitle": "来自全球新闻和社区的实时信号 — 包含 AI 见解和创业想法。",
        "search_placeholder": "搜索任何内容 — \"AI 智能体\"、\"气候技术\"…",
        "found": "个趋势",
        "search_anything": "搜索任何内容",
        "search_desc": "获取带有 AI 见解、重要性分析和创业想法的实时趋势数据。",
        "scanning": "正在扫描全球信号…",
        "generating": "正在生成 AI 见解和创业想法",
        "failed": "搜索失败",
        "no_found": "未找到相关趋势",
        "try_different": "尝试不同的关键字或扩大搜索范围。",
        "load_more": "加载更多",
        "click_insights": "点击获取 AI 见解和创业想法",
        "ai_insight": "AI 见解",
        "why_matters": "为什么重要",
        "startup_ideas": "创业想法",
        "who_cares": "谁应该关注",
        "signal_metrics": "信号指标",
        "sources": "来源"
      },
      "opportunities": {
        "title": "顶级机会",
        "subtitle": "高潜力趋势转化为可操作的商业机会。",
        "none": "尚未发现高潜力机会。",
        "none_desc": "当趋势分数超过 7.0 时会出现机会。",
        "why_matters": "为什么重要",
        "who_cares": "谁应该关注",
        "opportunity": "机会",
        "explore_opportunity": "探索机会",
        "api_error": "使用精选数据 — 实时 API 未连接。"
      },
      "insights": {
        "title": "洞察",
        "subtitle": "当前趋势和市场数据的动态智能摘要。",
        "emerging_pct": "的趋势是新兴的",
        "top_category": "本月顶级类别",
        "fastest_growing": "增长最快",
        "avg_score": "平均分 / 10",
        "by_category": "按类别",
        "status_overview": "所有趋势 — 状态概览",
        "hot": "热门",
        "rising": "上升",
        "emerging": "新兴",
        "no_data": "暂无趋势数据。"
      }
    }
  },
  FR: {
    translation: {
      "navbar": {
        "search_placeholder": "Rechercher des tendances...",
        "home": "Accueil",
        "trends": "Tendances",
        "dashboard": "Tableau de bord",
        "login": "Connexion"
      },
      "sidebar": {
        "dashboard": "Tableau de bord",
        "trends": "Tendances",
        "opportunities": "Opportunités",
        "insights": "Perspectives",
        "pricing": "Tarifs",
        "radar_scanning": "Scan des signaux en direct",
        "radar_label": "Radar scannant les signaux du marché",
        "updated_now": "Mis à jour maintenant"
      },
      "footer": {
        "made_by": "Fait avec ❤️ par Aneesha",
        "buy_coffee": "Offrez-moi un café"
      },
      "home": {
        "hero_title_1": "Voir les tendances de ",
        "hero_title_highlight": "demain",
        "hero_title_2": " avant qu'elles ne deviennent évidentes",
        "hero_subtitle": "Notre IA scanne les actualités, conversations et communautés sur Internet pour détecter les tendances émergentes tôt.",
        "explore_trends": "Explorer les tendances",
        "open_dashboard": "Ouvrir le tableau de bord",
        "used_by": "Utilisé par des fondateurs, analystes et bâtisseurs curieux explorant l'avenir."
      },
      "home_usecases": {
        "section_title": "Comment fonctionne la plateforme",
        "section_subtitle": "Transformez votre recherche de marché avec des workflows alimentés par l'IA.",
        "detection_title": "Détection des tendances",
        "detection_desc": "L'IA scanne continuellement les actualités et signaux de recherche pour identifier les modèles émergents.",
        "clustering_title": "Regroupement de signaux",
        "clustering_desc": "Les signaux connexes sont regroupés dans des catégories de tendances claires à l'aide de l'IA.",
        "momentum_title": "Suivi de la dynamique",
        "momentum_desc": "Les tendances sont classées en fonction de la vitesse, de l'engagement et des signaux multi-plateformes.",
        "opportunity_title": "Découverte d'opportunités",
        "opportunity_desc": "Explorez les insights, signaux et opportunités potentielles liés à chaque tendance."
      },
      "home_testimonials": {
        "quote": "\"Cet outil aide notre équipe à détecter les idées émergentes bien avant les rapports de recherche traditionnels.\"",
        "role": "Analyste en innovation"
      },
      "home_metrics": {
        "signals": "Signaux analysés",
        "trends": "Tendances actives suivies",
        "communities": "Communautés scannées",
        "insights": "Insights générés"
      },
      "home_faq": {
        "section_title": "Questions fréquentes",
        "q1": "Comment les tendances sont-elles détectées ?",
        "a1": "Notre IA surveille en permanence les actualités mondiales et les forums de discussion pour identifier les signaux précoces.",
        "q2": "D'où proviennent les données ?",
        "a2": "Les signaux sont agrégés à partir de sources d'actualités mondiales et de plateformes communautaires.",
        "q3": "À quelle fréquence les tendances sont-elles mises à jour ?",
        "a3": "La plateforme scanne les nouveaux signaux en temps réel et met à jour dynamiquement les scores.",
        "q4": "Puis-je explorer des tendances de différentes industries ?",
        "a4": "Oui. Notre plateforme catégorise les tendances dans la technologie, la finance, la santé, les affaires et la culture."
      },
      "dashboard": {
        "title": "Tableau de bord",
        "subtitle": "Aperçu des tendances détectées et des signaux de marché en direct.",
        "top_trends": "Meilleures tendances détectées",
        "all_trends": "Toutes les tendances",
        "live_search": "Recherche de tendances en direct",
        "live_search_desc": "Recherchez n'importe quel sujet et obtenez des résultats en temps réel avec des insights générés par l'IA.",
        "open_search": "Ouvrir la recherche",
        "status_breakdown": "Répartition du statut des tendances",
        "live_feed": "Fil de signaux en direct",
        "fetching": "Récupération des signaux en direct…",
        "no_signals": "Aucun signal disponible pour l'instant.",
        "search_trends": "Rechercher des tendances en direct →",
        "engagement": "engagement",
        "no_trends": "Aucune tendance trouvée. Essayez de rechercher un sujet.",
        "api_error": "Données sélectionnées utilisées — l'API en direct n'est pas connectée.",
        "hot": "Chaud",
        "rising": "En hausse",
        "emerging": "Émergent",
        "score_gte8": "Score ≥ 8.0",
        "score_5_8": "Score 5.0–7.9",
        "score_lt5": "Score < 5.0"
      },
      "trends": {
        "title": "Recherche de tendances en direct",
        "subtitle": "Signaux en temps réel des actualités mondiales — avec insights IA et idées de startups.",
        "search_placeholder": "Recherchez n'importe quoi — \"agents IA\", \"tech climatique\"…",
        "found": "tendances trouvées",
        "search_anything": "Recherchez n'importe quoi",
        "search_desc": "Obtenez des données de tendances en direct avec des insights IA, pourquoi c'est important et des idées de startups.",
        "scanning": "Scan des signaux mondiaux…",
        "generating": "Génération d'insights IA et d'idées de startups pour",
        "failed": "Échec de la recherche",
        "no_found": "Aucune tendance trouvée pour",
        "try_different": "Essayez un mot-clé différent ou élargissez votre recherche.",
        "load_more": "Charger plus",
        "click_insights": "Cliquez pour les insights IA et idées de startups",
        "ai_insight": "Insight IA",
        "why_matters": "Pourquoi c'est important",
        "startup_ideas": "Idées de startups",
        "who_cares": "Qui devrait s'y intéresser",
        "signal_metrics": "Métriques de signaux",
        "sources": "Sources"
      },
      "opportunities": {
        "title": "Meilleures opportunités",
        "subtitle": "Tendances à haut potentiel converties en opportunités d'affaires concrètes.",
        "none": "Aucune opportunité à haut potentiel détectée pour l'instant.",
        "none_desc": "Les opportunités apparaissent quand les tendances ont un score supérieur à 7.0",
        "why_matters": "Pourquoi c'est important",
        "who_cares": "Qui devrait s'y intéresser",
        "opportunity": "Opportunité",
        "explore_opportunity": "Explorer l'opportunité",
        "api_error": "Données sélectionnées utilisées — l'API en direct n'est pas connectée."
      },
      "insights": {
        "title": "Perspectives",
        "subtitle": "Résumé d'intelligence dynamique des données de tendances et de marché actuelles.",
        "emerging_pct": "des tendances sont émergentes",
        "top_category": "catégorie principale ce mois-ci",
        "fastest_growing": "à la croissance la plus rapide",
        "avg_score": "score moyen / 10",
        "by_category": "Par catégorie",
        "status_overview": "Toutes les tendances — Aperçu du statut",
        "hot": "Chaud",
        "rising": "En hausse",
        "emerging": "Émergent",
        "no_data": "Aucune donnée de tendance disponible pour l'instant."
      }
    }
  },
  JA: {
    translation: {
      "navbar": {
        "search_placeholder": "トレンドを検索...",
        "home": "ホーム",
        "trends": "トレンド",
        "dashboard": "ダッシュボード",
        "login": "ログイン"
      },
      "sidebar": {
        "dashboard": "ダッシュボード",
        "trends": "トレンド",
        "opportunities": "機会",
        "insights": "インサイト",
        "pricing": "料金",
        "radar_scanning": "ライブシグナルをスキャン中",
        "radar_label": "レーダーが市場シグナルをスキャン中",
        "updated_now": "たった今更新されました"
      },
      "footer": {
        "made_by": "Aneesha が ❤️ を込めて作成",
        "buy_coffee": "コーヒーをおごってください"
      },
      "home": {
        "hero_title_1": "明日のトレンドが",
        "hero_title_highlight": "明らかになる前に",
        "hero_title_2": "見極めよう",
        "hero_subtitle": "当社の AI はインターネット上のニュース、会話、コミュニティをスキャンして新興トレンドを早期に発見します。",
        "explore_trends": "トレンドを探索",
        "open_dashboard": "ダッシュボードを開く",
        "used_by": "未来を探求する創業者、アナリスト、好奇心旺盛なビルダーに使用されています。"
      },
      "home_usecases": {
        "section_title": "プラットフォームの仕組み",
        "section_subtitle": "最新の戦略チームのために設計された AI 駆動のワークフローで市場調査を変革します。",
        "detection_title": "トレンド検出",
        "detection_desc": "AI がニュースやスタートアップのシグナルを継続的にスキャンして新興パターンを特定します。",
        "clustering_title": "シグナルクラスタリング",
        "clustering_desc": "関連するシグナルが AI 分析を使用して明確なトレンドカテゴリにグループ化されます。",
        "momentum_title": "モメンタム追跡",
        "momentum_desc": "トレンドは速度、エンゲージメント、クロスプラットフォームシグナルに基づいてランク付けされます。",
        "opportunity_title": "機会の発見",
        "opportunity_desc": "各トレンドに関連するインサイト、シグナル、潜在的な機会を探索します。"
      },
      "home_testimonials": {
        "quote": "\"このツールにより、従来の調査レポートよりもはるかに早く新興アイデアを発見できます。\"",
        "role": "イノベーションアナリスト"
      },
      "home_metrics": {
        "signals": "分析されたシグナル",
        "trends": "追跡中のアクティブなトレンド",
        "communities": "スキャンされたコミュニティ",
        "insights": "生成されたインサイト"
      },
      "home_faq": {
        "section_title": "よくある質問",
        "q1": "トレンドはどのように検出されますか？",
        "a1": "当社の AI はグローバルニュースやソーシャルディスカッションを継続的に監視して初期シグナルを特定します。",
        "q2": "データはどこから来ますか？",
        "a2": "シグナルはグローバルニュースソース、ディスカッションフォーラム、コミュニティプラットフォームから集約されます。",
        "q3": "トレンドはどのくらいの頻度で更新されますか？",
        "a3": "プラットフォームはリアルタイムで新しいシグナルをスキャンし、トレンドスコアを動的に更新します。",
        "q4": "さまざまな業界のトレンドを探索できますか？",
        "a4": "はい。当社のプラットフォームはトレンドをテクノロジー、金融、健康、ビジネス、文化に分類します。"
      },
      "dashboard": {
        "title": "ダッシュボード",
        "subtitle": "検出されたトレンドとライブ市場シグナルの概要。",
        "top_trends": "トップ検出トレンド",
        "all_trends": "全トレンド",
        "live_search": "ライブトレンド検索",
        "live_search_desc": "任意のトピックを検索し、AI が生成したインサイトでリアルタイムの結果を取得します。",
        "open_search": "検索を開く",
        "status_breakdown": "トレンドステータス内訳",
        "live_feed": "ライブシグナルフィード",
        "fetching": "ライブシグナルを取得中…",
        "no_signals": "現在利用可能なシグナルはありません。",
        "search_trends": "ライブトレンドを検索 →",
        "engagement": "エンゲージメント",
        "no_trends": "トレンドが見つかりません。トピックを検索してみてください。",
        "api_error": "厳選されたデータを使用中 — ライブ API は接続されていません。",
        "hot": "ホット",
        "rising": "上昇中",
        "emerging": "新興",
        "score_gte8": "スコア ≥ 8.0",
        "score_5_8": "スコア 5.0–7.9",
        "score_lt5": "スコア < 5.0"
      },
      "trends": {
        "title": "ライブトレンド検索",
        "subtitle": "グローバルニュースとコミュニティからのリアルタイムシグナル — AI インサイトとスタートアップアイデアを含む。",
        "search_placeholder": "何でも検索 — \"AI エージェント\"、\"気候テック\"…",
        "found": "件のトレンド",
        "search_anything": "何でも検索",
        "search_desc": "AI インサイト、重要性の分析、スタートアップアイデアを含むライブトレンドデータを取得します。",
        "scanning": "グローバルシグナルをスキャン中…",
        "generating": "AI インサイトとスタートアップアイデアを生成中",
        "failed": "検索に失敗しました",
        "no_found": "のトレンドが見つかりません",
        "try_different": "別のキーワードを試すか、検索を広げてください。",
        "load_more": "さらに読み込む",
        "click_insights": "AI インサイトとスタートアップアイデアをクリック",
        "ai_insight": "AI インサイト",
        "why_matters": "なぜ重要か",
        "startup_ideas": "スタートアップアイデア",
        "who_cares": "誰が注目すべきか",
        "signal_metrics": "シグナルメトリクス",
        "sources": "ソース"
      },
      "opportunities": {
        "title": "トップオポチュニティ",
        "subtitle": "高ポテンシャルのトレンドを実用的なビジネスチャンスに変換。",
        "none": "まだ高ポテンシャルな機会は検出されていません。",
        "none_desc": "トレンドのスコアが 7.0 を超えると機会が表示されます。",
        "why_matters": "なぜ重要か",
        "who_cares": "誰が注目すべきか",
        "opportunity": "機会",
        "explore_opportunity": "機会を探る",
        "api_error": "厳選されたデータを使用中 — ライブ API は接続されていません。"
      },
      "insights": {
        "title": "インサイト",
        "subtitle": "現在のトレンドと市場データからの動的インテリジェンスサマリー。",
        "emerging_pct": "のトレンドが新興",
        "top_category": "今月のトップカテゴリ",
        "fastest_growing": "最も急成長",
        "avg_score": "平均スコア / 10",
        "by_category": "カテゴリ別",
        "status_overview": "全トレンド — ステータス概要",
        "hot": "ホット",
        "rising": "上昇中",
        "emerging": "新興",
        "no_data": "まだトレンドデータはありません。"
      }
    }
  }
};

// Load persisted language from localStorage
const savedLang = localStorage.getItem('trendy_lang') || 'EN';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
