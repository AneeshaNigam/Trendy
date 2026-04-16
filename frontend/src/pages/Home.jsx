import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BarChart3, Target, Globe, Lightbulb, Radar, TrendingUp, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useTranslation();

  const useCases = [
    { icon: BarChart3, title: t('home_usecases.detection_title'), desc: t('home_usecases.detection_desc') },
    { icon: Target, title: t('home_usecases.clustering_title'), desc: t('home_usecases.clustering_desc') },
    { icon: Globe, title: t('home_usecases.momentum_title'), desc: t('home_usecases.momentum_desc') },
    { icon: Lightbulb, title: t('home_usecases.opportunity_title'), desc: t('home_usecases.opportunity_desc') }
  ];

  const faqs = [
    { q: t('home_faq.q1'), a: t('home_faq.a1') },
    { q: t('home_faq.q2'), a: t('home_faq.a2') },
    { q: t('home_faq.q3'), a: t('home_faq.a3') },
    { q: t('home_faq.q4'), a: t('home_faq.a4') }
  ];

  const howItWorksSteps = [
    {
      number: '01',
      icon: Radar,
      title: 'We scan online signals',
      desc: 'Our AI monitors Reddit, GitHub, Hacker News, and dozens of communities 24/7 to capture early-stage conversations and activity.'
    },
    {
      number: '02',
      icon: TrendingUp,
      title: 'Detect emerging trends',
      desc: 'Machine learning clusters related signals, scores momentum, and identifies patterns before they become mainstream.'
    },
    {
      number: '03',
      icon: Gem,
      title: 'Convert them into opportunities',
      desc: 'Each trend is transformed into a problem statement with an opportunity layer — so you can act on insights, not just observe them.'
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] pt-12 pb-24 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="px-8 mx-auto max-w-7xl relative overflow-visible w-full mb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-50/50 dark:bg-amber-900/10 rounded-full blur-[120px] pointer-events-none transition-colors"></div>
        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 w-full">
          <div className="w-full md:w-1/2 flex flex-col justify-center pr-0 md:pr-12 text-gray-900 dark:text-white transition-colors duration-300 relative z-20">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 mt-12 md:mt-0">
              {t('home.hero_title_1')}<span className="text-amber-500">{t('home.hero_title_highlight')}</span>{t('home.hero_title_2')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg font-medium">
              {t('home.hero_subtitle')}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/trends" 
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                {t('home.explore_trends')}
              </Link>
              <Link 
                to="/dashboard" 
                className="px-8 py-3.5 bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
              >
                {t('home.open_dashboard')}
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
               <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f1115] bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-xs">JD</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f1115] bg-gray-300 dark:bg-slate-700 flex items-center justify-center text-xs">AK</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f1115] bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">+9k</div>
               </div>
               {t('home.used_by')}
            </div>
          </div>

          <div className="w-full md:w-1/2 relative flex items-center justify-center mt-20 md:mt-0 h-[400px]">
            <div className="fire scale-75 md:scale-100">
              <div className="fire-left">
                <div className="main-fire"></div>
                <div className="particle-fire"></div>
              </div>
              <div className="fire-center">
                <div className="main-fire"></div>
                <div className="particle-fire"></div>
              </div>
              <div className="fire-right">
                <div className="main-fire"></div>
                <div className="particle-fire"></div>
              </div>
              <div className="fire-bottom">
                <div className="main-fire"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-white dark:from-slate-900/50 dark:to-[#0f1115] border-y border-gray-100 dark:border-slate-800/80 py-24 transition-colors">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">From Signals to Opportunities in 3 Steps</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Our AI-powered pipeline transforms raw online signals into actionable business intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 dark:from-amber-500/20 dark:via-amber-500/40 dark:to-orange-500/20 -translate-y-8"></div>
            
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-gray-200 dark:border-slate-700/50 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-extrabold text-gray-100 dark:text-slate-800 absolute top-4 right-6">{step.number}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="w-full bg-white dark:bg-slate-900/30 border-y border-gray-100 dark:border-slate-800/80 py-24 transition-colors">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{t('home_usecases.section_title')}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('home_usecases.section_subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {useCases.map((uc, i) => (
                <div key={i} className="bg-gray-50/50 dark:bg-slate-800/40 p-8 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                   <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 transition-all duration-300">
                      <uc.icon className="w-6 h-6 text-amber-500" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{uc.title}</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{uc.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Metrics */}
      <section className="py-24 max-w-4xl mx-auto px-8 text-center relative z-10">
         <div className="flex justify-center gap-1 mb-6 text-amber-500">
            {[...Array(5)].map((_, i) => <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
         </div>
         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-10">
            {t('home_testimonials.quote')}
         </h2>
         <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-[#0f1115] shadow-sm">
               <span className="font-bold text-gray-500 dark:text-gray-400">AM</span>
            </div>
            <div className="text-left">
               <div className="text-lg font-bold text-gray-900 dark:text-white">Alex Morgan</div>
               <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('home_testimonials.role')}</div>
            </div>
         </div>
         
         <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-200 dark:border-slate-800 pt-16">
            <div>
               <div className="text-4xl font-extrabold text-amber-500 mb-2">10M+</div>
               <div className="text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">{t('home_metrics.signals')}</div>
            </div>
            <div>
               <div className="text-4xl font-extrabold text-amber-500 mb-2">4,500+</div>
               <div className="text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">{t('home_metrics.trends')}</div>
            </div>
            <div>
               <div className="text-4xl font-extrabold text-amber-500 mb-2">500+</div>
               <div className="text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">{t('home_metrics.communities')}</div>
            </div>
            <div>
               <div className="text-4xl font-extrabold text-amber-500 mb-2">85k+</div>
               <div className="text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">{t('home_metrics.insights')}</div>
            </div>
         </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-gray-50 dark:bg-slate-900/30 border-t border-gray-200 dark:border-slate-800 py-24 transition-colors">
         <div className="max-w-3xl mx-auto px-8 relative z-10">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">{t('home_faq.section_title')}</h2>
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm transition-colors">
                     <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                     >
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                     </button>
                     <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
