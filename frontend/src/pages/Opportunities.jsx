import { useState, useEffect } from 'react';
import {
  Gem, TrendingUp, Lightbulb, Loader2, Users,
  Sparkles, Info, ArrowRight, X, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { generateOpportunityLayer } from '../utils/opportunityGenerator';
import { normalizeScore } from '../utils/normalizeScore';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config/api.js';

// ─── Rich fallback opportunities ─────────────────────────────────────────────
const FALLBACK_TRENDS = [
  { _id: 'o1',  name: 'AI Healthcare Diagnostics',      score: 9.4, category: 'HealthTech', explanation: 'AI-powered diagnostic tools achieving near-physician accuracy in radiology and pathology.', aiInsight: 'Healthcare AI is seeing regulatory approval and clinical adoption converge. Major hospital systems are deploying diagnostic AI at scale.', whyItMatters: 'A $20B+ market forming as AI diagnosis becomes standard clinical workflow. Early players defining protocols capture long-term value.', startupIdeas: ['AI second-opinion platform for radiologists', 'Clinical AI audit and compliance SaaS', 'Patient-facing diagnostic pre-screening app'], whoShouldCare: ['HealthTech founders', 'Medical device investors', 'Hospital innovation teams'] },
  { _id: 'o2',  name: 'Agentic AI Workflows',           score: 9.1, category: 'AI & ML',    explanation: 'Autonomous AI agents that plan, execute, and iterate across long-horizon enterprise tasks are production-ready.', aiInsight: 'Multi-agent systems are moving from demo to production. Enterprise teams deploy agents for research, QA, and content workflows.', whyItMatters: 'Agentic AI unlocks a fundamentally new class of software — autonomous systems that eliminate entire categories of human labor.', startupIdeas: ['No-code agent builder for business analysts', 'Agent monitoring and reliability platform', 'Domain-specific agents for legal/finance workflows'], whoShouldCare: ['AI product managers', 'Enterprise software buyers', 'Venture investors'] },
  { _id: 'o3',  name: 'Climate Fintech',                 score: 8.9, category: 'Climate',   explanation: 'Financial products built around carbon markets, ESG scoring, and green lending attracting massive institutional capital.', aiInsight: 'Carbon credit verification and ESG data infrastructure are the fastest-growing sub-sectors. EU regulatory tailwinds accelerate global adoption.', whyItMatters: 'Mandatory ESG reporting creates a compliance market worth billions. First-mover data infrastructure players become essential intermediaries.', startupIdeas: ['Carbon credit verification API', 'SME ESG reporting automation tool', 'Green loan origination platform for banks'], whoShouldCare: ['Climate tech founders', 'ESG strategists', 'VC funds with sustainability mandates'] },
  { _id: 'o4',  name: 'Synthetic Data Pipelines',        score: 8.7, category: 'AI & ML',   explanation: 'Programmatic generation of high-quality synthetic datasets unlocking model training at scale without expensive labelling.', aiInsight: 'Synthetic data quality is now competitive with real data in regulated domains like healthcare and finance.', whyItMatters: 'Training data scarcity is the bottleneck for AI in regulated industries. Synthetic data removes this constraint entirely.', startupIdeas: ['Domain-specific synthetic data generation API', 'Synthetic data quality validation platform', 'Privacy-preserving data marketplace'], whoShouldCare: ['AI/ML engineers', 'Regulated industry CTOs', 'Data science teams'] },
  { _id: 'o5',  name: 'Embedded Finance Infrastructure', score: 8.4, category: 'Fintech',   explanation: 'Banking and payments embedded into non-financial products via BaaS layers, reshaping software distribution.', aiInsight: 'Every SaaS product is becoming a financial product. Infrastructure — ledgers, compliance, payment rails — is where defensible value accumulates.', whyItMatters: 'Embedded finance is a $7T opportunity. Infrastructure providers who win will power the financial layer of the entire software economy.', startupIdeas: ['Embedded lending for B2B SaaS platforms', 'Multi-currency payment infrastructure for global apps', 'Compliance-as-a-service for embedded finance'], whoShouldCare: ['Fintech founders', 'SaaS product leaders', 'Financial regulators'] },
  { _id: 'o6',  name: 'Personalized Learning AI',        score: 8.1, category: 'EdTech',    explanation: 'AI tutors adapting in real-time to student knowledge gaps demonstrate 2-3x learning efficiency improvements.', aiInsight: 'Personalized AI tutoring shows measurable outcomes traditional ed-tech never achieved. School districts and corporate L&D are both investing heavily.', whyItMatters: 'The $6T education market is deeply inefficient. AI-native learning products that demonstrate ROI displace legacy platforms rapidly.', startupIdeas: ['AI tutor for professional certification prep', 'Corporate L&D platform with skill-gap analytics', 'Adaptive curriculum builder for K-12 schools'], whoShouldCare: ['EdTech founders', 'Corporate L&D leaders', 'Education investors'] },
  { _id: 'o7',  name: 'Edge AI Inference',               score: 7.9, category: 'AI & ML',   explanation: 'Running quantised LLMs locally on consumer hardware creating private, offline-capable AI applications.', aiInsight: 'On-device AI enables use cases impossible in the cloud — private health data, real-time manufacturing QA, offline field tools.', whyItMatters: 'Edge inference removes privacy barriers, unlocking industrial AI deployments that cloud-first approaches cannot serve.', startupIdeas: ['Edge AI deployment platform for manufacturers', 'Privacy-first AI medical device software', 'On-device AI for field operations'], whoShouldCare: ['Hardware founders', 'Industrial IoT teams', 'Privacy-focused enterprise buyers'] },
  { _id: 'o8',  name: 'Creator Economy Infrastructure',  score: 7.6, category: 'Business',  explanation: 'Platforms enabling creators to monetize through subscriptions, digital products, and communities maturing fast.', aiInsight: 'Top creators are building media businesses, driving demand for sophisticated financial, legal, and analytics tools.', whyItMatters: 'Over 200M people identify as creators. The infrastructure serving them — payments, analytics, legal, taxes — is massively underbuilt.', startupIdeas: ['Creator revenue analytics and forecasting tool', 'Cross-platform audience management SaaS', 'Creator-focused financial services'], whoShouldCare: ['Creator economy founders', 'Media investors', 'Financial services innovators'] },
  { _id: 'o9',  name: 'B2B AI Sales Intelligence',       score: 7.3, category: 'Business',  explanation: 'AI tools identifying buying signals, predicting churn, and automating outreach for enterprise revenue operations.', aiInsight: 'CROs are standardizing on AI sales tools. The next wave is predictive — systems that surface deals before reps know to pursue them.', whyItMatters: 'Sales efficiency is leverage for every B2B business. AI that measurably lifts win rates creates immediate ROI and stickiness.', startupIdeas: ['AI deal intelligence layer for CRM systems', 'Churn prediction and prevention platform', 'AI-powered competitive intelligence for sales teams'], whoShouldCare: ['SaaS founders', 'Revenue Operations leaders', 'B2B investors'] },
  { _id: 'o10', name: 'Mental Health Tech',              score: 7.1, category: 'HealthTech', explanation: 'Digital mental health platforms from AI therapy assistants to employer EAP tools seeing explosive adoption.', aiInsight: 'Payer reimbursement for digital mental health is expanding. Platforms with clinical validation and insurance coverage are pulling away from the market.', whyItMatters: '1 in 4 adults experiences a mental health episode annually. Technology is the only scalable solution to the global treatment gap.', startupIdeas: ['Employer mental health benefits platform', 'AI-powered CBT app with clinical validation', 'Mental health data analytics for insurers'], whoShouldCare: ['HealthTech founders', 'HR tech innovators', 'Healthcare investors'] },
  { _id: 'o11', name: 'Supply Chain Visibility SaaS',    score: 6.8, category: 'Business',  explanation: 'Real-time visibility, risk detection, and supplier intelligence platforms for post-pandemic supply chain resilience.', aiInsight: 'CFOs now treat supply chain visibility as a board-level priority. RFP cycles have shortened dramatically as budgets expand.', whyItMatters: 'Supply chain disruptions cost $1.5T annually. Platforms providing early warning command premium pricing.', startupIdeas: ['AI supply chain risk detection API', 'Supplier financial health monitoring SaaS', 'Real-time freight and logistics intelligence platform'], whoShouldCare: ['Supply chain leaders', 'Procurement strategists', 'Manufacturing investors'] },
  { _id: 'o12', name: 'Vertical AI SaaS',                score: 6.5, category: 'AI & ML',   explanation: 'AI-native software built for specific industries outcompeting horizontal tools in construction, legal, and agriculture.', aiInsight: 'Domain-specific training data creates durable moats. Generic AI tools are losing deals to purpose-built vertical competitors.', whyItMatters: 'Vertical AI winners will become new category leaders — replacing legacy software the way Salesforce replaced Siebel.', startupIdeas: ['AI contract analysis for construction projects', 'Precision agriculture AI advisory platform', 'AI-powered legal discovery and research tool'], whoShouldCare: ['Vertical SaaS founders', 'Industry operators turned founders', 'Sector-focused VCs'] },
];

function getStatus(score) {
  if (score >= 8) return { label: 'Hot',     emoji: '🔥', cls: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' };
  if (score >= 6) return { label: 'Rising',   emoji: '📈', cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
  return           { label: 'Emerging', emoji: '🌱', cls: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' };
}

// ─── Opportunity detail modal ─────────────────────────────────────────────────
function OpportunityModal({ opp, onClose }) {
  const { t } = useTranslation();
  const score  = normalizeScore(opp.score);
  const status = getStatus(score);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800 z-10 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {opp.category && (
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-bold">{opp.category}</span>
              )}
              <span className={`px-2 py-0.5 rounded border text-xs font-bold ${status.cls}`}>{status.label} {status.emoji}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{opp.name}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> {score}/10
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Context / explanation */}
          {opp.explanation && (
            <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/60 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{opp.explanation}</p>
            </div>
          )}

          {/* AI Insight */}
          {opp.aiInsight && (
            <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-500/8 dark:to-orange-500/5 border border-amber-200/80 dark:border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</h3>
              </div>
              <p className="text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">{opp.aiInsight}</p>
            </section>
          )}

          {/* Why It Matters */}
          {(opp.whyItMatters || opp.whyMatters) && (
            <section className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200/80 dark:border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">{t('opportunities.why_matters')}</h3>
              </div>
              <p className="text-sm text-blue-900 dark:text-blue-200/90 leading-relaxed">{opp.whyItMatters || opp.whyMatters}</p>
            </section>
          )}

          {/* Startup Ideas */}
          {opp.startupIdeas?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.startup_ideas')}</h3>
              </div>
              <div className="space-y-2.5">
                {opp.startupIdeas.map((idea, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-xl p-4 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors">
                    <span className="text-lg font-extrabold text-gray-200 dark:text-slate-700 shrink-0 w-5">{i + 1}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{idea}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Who Should Care */}
          {opp.whoShouldCare?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('opportunities.who_cares')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(opp.whoShouldCare) ? opp.whoShouldCare : [opp.whoShouldCare]).map((role, i) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">{role}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Opportunity card — expanded mini-report face ────────────────────────────────
function OpportunityCard({ opp, onSelect }) {
  const { t } = useTranslation();
  const score  = normalizeScore(opp.score);
  const status = getStatus(score);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(opp)}
      onKeyDown={e => e.key === 'Enter' && onSelect(opp)}
      className="group bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
    >
      {/* Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/0 group-hover:bg-amber-400/6 dark:group-hover:bg-amber-500/5 blur-[50px] pointer-events-none transition-all duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {opp.category && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-bold">{opp.category}</span>
            )}
            <span className={`px-2 py-0.5 rounded border text-xs font-bold ${status.cls}`}>{status.label} {status.emoji}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">{opp.name}</h3>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs font-bold shrink-0">
          <TrendingUp className="w-3.5 h-3.5" /> {score}
        </div>
      </div>

      {/* AI Insight — 3 lines */}
      {opp.aiInsight && (
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">{opp.aiInsight}</p>
        </div>
      )}

      {/* Why It Matters — 2-line teaser */}
      {(opp.whyItMatters || opp.whyMatters) && (
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Info className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t('opportunities.why_matters')}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{opp.whyItMatters || opp.whyMatters}</p>
        </div>
      )}

      {/* First startup idea in full */}
      {opp.startupIdeas?.[0] && (
        <div className="bg-amber-50 dark:bg-amber-500/8 border border-amber-200/60 dark:border-amber-500/20 rounded-xl px-3.5 py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('trends.startup_ideas')}</span>
            {opp.startupIdeas.length > 1 && (
              <span className="ml-auto text-[10px] text-amber-600/60 dark:text-amber-400/50 font-medium">+{opp.startupIdeas.length - 1} more</span>
            )}
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300/80 line-clamp-2 leading-relaxed">{opp.startupIdeas[0]}</p>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-auto pt-2 border-t border-gray-100 dark:border-slate-800">
        <Gem className="w-3.5 h-3.5" />
        <span>{t('opportunities.explore_opportunity')}</span>
        <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Opportunities() {
  const { t } = useTranslation();
  const [trends, setTrends]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/trends`, { withCredentials: true });
        const api = (res.data.trends || []);
        setTrends(api.length > 0 ? api : FALLBACK_TRENDS);
      } catch (err) {
        console.warn('API unavailable, using fallback:', err.message);
        setTrends(FALLBACK_TRENDS);
        setError(t('opportunities.api_error'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const opportunities = trends
    .map(t => ({
      ...t,
      score: normalizeScore(t.score),
      ...generateOpportunityLayer(t),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header — no export */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
          <Gem className="w-7 h-7 text-amber-500" /> {t('opportunities.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('opportunities.subtitle')}</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {opportunities.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="font-semibold">{t('opportunities.none')}</p>
          <p className="text-sm mt-1">{t('opportunities.none_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {opportunities.map(opp => (
            <OpportunityCard key={opp._id || opp.name} opp={opp} onSelect={setSelectedOpp} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedOpp && <OpportunityModal opp={selectedOpp} onClose={() => setSelectedOpp(null)} />}
    </div>
  );
}
