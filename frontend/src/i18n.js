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
      "footer": {
        "made_by": "Made with ❤️ by Aneesha",
        "buy_coffee": "Buy me a coffee"
      },
      "home": {
        "hero_title_1": "See ",
        "hero_title_highlight": "Tomorrow’s",
        "hero_title_2": " Trends Before They Become Obvious",
        "hero_subtitle": "Our AI scans conversations, startups, research, and communities across the internet to detect emerging trends early.",
        "explore_trends": "Explore Trends",
        "open_dashboard": "Open Dashboard",
        "used_by": "Used by founders, analysts, and curious builders exploring the future."
      },
      "home_usecases": {
        "section_title": "How the Platform Works",
        "section_subtitle": "Transform your market research with AI-powered workflows designed specifically for modern strategy teams.",
        "detection_title": "Trend Detection",
        "detection_desc": "AI continuously scans online discussions, startup launches, and research signals to identify emerging patterns.",
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
        "a1": "Our AI continuously monitors developer platforms, social networks, and research repositories to identify early stage signals and discussions.",
        "q2": "Where does the data come from?",
        "a2": "Signals are aggregated horizontally from technical forums (Hacker News), code repositories (GitHub), targeted communities (Reddit), and global industry news.",
        "q3": "How often are trends updated?",
        "a3": "The platform scans for new signals in real-time and updates trend velocity scores and clustering dynamically.",
        "q4": "Can I explore trends from different industries?",
        "a4": "Yes. Our platform categorizes trends across technology, finance, health, business, and culture, allowing you to filter based on your specific focus area."
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
      "footer": {
        "made_by": "Hecho con ❤️ por Aneesha",
        "buy_coffee": "Cómprame un café"
      },
      "home": {
        "hero_title_1": "Vea las tendencias del ",
        "hero_title_highlight": "mañana",
        "hero_title_2": " antes de que sean evidentes",
        "hero_subtitle": "Nuestra IA escanea conversaciones, startups, investigaciones y comunidades en todo Internet para detectar tendencias emergentes a tiempo.",
        "explore_trends": "Explorar tendencias",
        "open_dashboard": "Abrir panel",
        "used_by": "Usado por fundadores, analistas y constructores curiosos que exploran el futuro."
      },
      "home_usecases": {
        "section_title": "Cómo funciona la plataforma",
        "section_subtitle": "Transforme su investigación de mercado con flujos de trabajo impulsados por IA diseñados específicamente para equipos de estrategia modernos.",
        "detection_title": "Detección de tendencias",
        "detection_desc": "La IA escanea continuamente discusiones en línea, lanzamientos de startups y señales de investigación para identificar patrones emergentes.",
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
        "a1": "Nuestra IA monitorea continuamente plataformas de desarrolladores, redes sociales y repositorios de investigación para identificar señales y discusiones en etapas iniciales.",
        "q2": "¿De dónde provienen los datos?",
        "a2": "Las señales se agregan horizontalmente desde foros técnicos (Hacker News), repositorios de código (GitHub), comunidades específicas (Reddit) y noticias de la industria global.",
        "q3": "¿Con qué frecuencia se actualizan las tendencias?",
        "a3": "La plataforma escanea nuevas señales en tiempo real y actualiza puntajes de velocidad de tendencia y la agrupación de forma dinámica.",
        "q4": "¿Puedo explorar tendencias de diferentes industrias?",
        "a4": "Sí. Nuestra plataforma clasifica las tendencias en tecnología, finanzas, salud, negocios y cultura, lo que le permite filtrar en función de su área de enfoque específica."
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
      "footer": {
        "made_by": "अनीशा द्वारा ❤️ के साथ निर्मित",
        "buy_coffee": "मेरे लिए एक कॉफ़ी खरीदें"
      },
      "home": {
        "hero_title_1": "प्रत्यक्ष होने से पहले ",
        "hero_title_highlight": "कल",
        "hero_title_2": " के रुझान देखें",
        "hero_subtitle": "हमारा AI उभरते रुझानों का जल्दी पता लगाने के लिए इंटरनेट पर बातचीत, स्टार्टअप, शोध और समुदायों को स्कैन करता है।",
        "explore_trends": "रुझान देखें",
        "open_dashboard": "डैशबोर्ड खोलें",
        "used_by": "भविष्य की खोज करने वाले संस्थापकों, विश्लेषकों और जिज्ञासु निर्माताओं द्वारा उपयोग किया जाता है।"
      },
      "home_usecases": {
        "section_title": "प्लेटफ़ॉर्म कैसे काम करता है",
        "section_subtitle": "आधुनिक रणनीति टीमों के लिए विशेष रूप से डिज़ाइन किए गए AI-संचालित वर्कफ़्लो के साथ अपने बाज़ार अनुसंधान को बदलें।",
        "detection_title": "रुझान का पता लगाना",
        "detection_desc": "AI उभरते पैटर्न की पहचान करने के लिए ऑनलाइन चर्चाओं, स्टार्टअप लॉन्च और शोध संकेतों को लगातार स्कैन करता है।",
        "clustering_title": "संकेत समूहीकरण",
        "clustering_desc": "संबंधित संकेतों को AI विश्लेषण का उपयोग करके स्पष्ट रुझान श्रेणियों में एक साथ समूहीकृत किया जाता है।",
        "momentum_title": "गति ट्रैकिंग",
        "momentum_desc": "रुझानों को वेग, सहभागिता, और क्रॉस-प्लेटफ़ॉर्म संकेतों के आधार पर रैंक किया जाता है।",
        "opportunity_title": "अवसर की खोज",
        "opportunity_desc": "प्रत्येक रुझान से जुड़े अंतर्दृष्टि, संकेत और संभावित अवसरों का अन्वेषण करें।"
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
        "a1": "हमारी AI प्रारंभिक चरण के संकेतों और चर्चाओं की पहचान करने के लिए डेवलपर प्लेटफ़ॉर्म, सोशल नेटवर्क और शोध रिपॉजिटरी की लगातार निगरानी करता है।",
        "q2": "डेटा कहाँ से आता है?",
        "a2": "संकेतों को क्षैतिज रूप से तकनीकी फ़ोरम (Hacker News), कोड रिपॉजिटरी (GitHub), लक्षित समुदायों (Reddit), और वैश्विक उद्योग समाचारों से एकत्रित किया जाता है।",
        "q3": "रुझान कितनी बार अपडेट होते हैं?",
        "a3": "प्लेटफ़ॉर्म वास्तविक समय में नए संकेतों के लिए स्कैन करता है और रुझान वेग स्कोर और क्लस्टरिंग को गतिशील रूप से अपडेट करता है।",
        "q4": "क्या मैं विभिन्न उद्योगों के रुझानों का पता लगा सकता हूँ?",
        "a4": "हां. हमारा प्लेटफ़ॉर्म रुझानों को प्रौद्योगिकी, वित्त, स्वास्थ्य, व्यवसाय और संस्कृति में वर्गीकृत करता है, जिससे आप अपने विशिष्ट फोकस क्षेत्र के आधार पर फ़िल्टर कर सकते हैं।"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "EN",
    fallbackLng: "EN",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
