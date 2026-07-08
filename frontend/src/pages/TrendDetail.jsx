import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Lightbulb, Loader2, Gem, Users, HelpCircle, Target, Sparkles, Info } from 'lucide-react';
import axios from 'axios';
import { generateOpportunityLayer } from '../utils/opportunityGenerator';
import { normalizeScore } from '../utils/normalizeScore';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config/api.js';

// Fallback mock data — no source platform names, non-dev-centric
const MOCK_TRENDS = [
  { id: 'f1', name: 'AI Healthcare Diagnostics', explanation: 'AI-powered diagnostic tools achieving near-physician accuracy in radiology and pathology, with FDA approvals accelerating clinical adoption globally.', score: 9.4, category: 'HealthTech', aiInsight: 'Healthcare AI is seeing regulatory approval and clinical adoption converge. Major hospital systems are deploying diagnostic AI at scale.', whyItMatters: 'A $20B+ market forming as AI diagnosis becomes standard clinical workflow. Early players defining protocols capture long-term value.', startupIdeas: ['AI second-opinion platform for radiologists', 'Clinical AI audit and compliance SaaS', 'Patient-facing diagnostic pre-screening app'], whoShouldCare: ['HealthTech founders', 'Medical device investors', 'Hospital innovation teams'] },
  { id: 'f2', name: 'Agentic AI Workflows',      explanation: 'Autonomous AI agents that plan, execute, and iterate across long-horizon enterprise tasks are becoming production-ready in 2026.', score: 9.1, category: 'AI & ML', aiInsight: 'Multi-agent systems are moving from demo to production. Enterprise teams are deploying agents for research, QA, and content workflows.', whyItMatters: 'Agentic AI unlocks a fundamentally new class of software — autonomous, goal-directed systems that eliminate entire categories of human labor.', startupIdeas: ['No-code agent builder for business analysts', 'Agent monitoring and reliability platform', 'Domain-specific agents for legal/finance workflows'], whoShouldCare: ['AI product managers', 'Enterprise software buyers', 'Venture investors'] },
];

function getStatusCls(score) {
  if (score >= 8) return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20';
  if (score >= 6) return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
  return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
}
function getStatusLabel(score) {
  if (score >= 8) return 'Hot 🔥';
  if (score >= 6) return 'Rising 📈';
  return 'Emerging 🌱';
}

export default function TrendDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [trend, setTrend]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/trends/${id}`, { withCredentials: true });
        setTrend(res.data.trend);
      } catch {
        const mock = MOCK_TRENDS.find(t => t.id === id || t._id === id);
        if (mock) {
          setTrend(mock);
        } else {
          try {
            const list = await axios.get(`${API_BASE}/api/trends`, { withCredentials: true });
            const found = (list.data.trends || []).find(t => t._id === id);
            found ? setTrend(found) : setError('Trend not found');
          } catch {
            setError('Trend not found');
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  if (error || !trend) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trend Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">We couldn't find this trend.</p>
        <Link to="/trends" className="text-amber-600 dark:text-amber-400 hover:underline font-medium">← Back to Trends</Link>
      </div>
    );
  }

  const score   = normalizeScore(trend.score);
  const oppLayer = generateOpportunityLayer(trend);

  // Use embedded fields first, then fallback to generated oppLayer
  const aiInsight    = trend.aiInsight    || null;
  const whyItMatters = trend.whyItMatters || trend.whyMatters || oppLayer.whyMatters;
  const startupIdeas = trend.startupIdeas?.length ? trend.startupIdeas : null;
  const whoShouldCare = trend.whoShouldCare?.length ? trend.whoShouldCare : null;

  return (
    <div className="max-w-3xl mx-auto pb-12 transition-colors">

      {/* Back link */}
      <Link to="/trends" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('trends.title')}
      </Link>

      {/* Title — no export buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {trend.category && (
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-xs font-bold">
              {trend.category}
            </span>
          )}
          <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusCls(score)}`}>
            {getStatusLabel(score)}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">{trend.name}</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-2xl font-bold w-fit shadow-sm">
          <TrendingUp className="w-5 h-5" />
          <span className="text-lg">{score}</span>
          <span className="text-sm font-normal text-amber-500/70">/ 10</span>
        </div>
      </div>

      <div className="space-y-5">

        {/* Explanation */}
        {trend.explanation && (
          <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{trend.explanation}</p>
          </div>
        )}

        {/* AI Insight */}
        {aiInsight && (
          <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-500/8 dark:to-orange-500/5 border border-amber-200/80 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</h2>
            </div>
            <p className="text-amber-900 dark:text-amber-200/90 leading-relaxed">{aiInsight}</p>
          </section>
        )}

        {/* Why It Matters */}
        {whyItMatters && (
          <section className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200/80 dark:border-blue-500/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">{t('trends.why_matters')}</h2>
            </div>
            <p className="text-blue-900 dark:text-blue-200/90 leading-relaxed">{whyItMatters}</p>
          </section>
        )}

        {/* Opportunity Layer */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-slate-800/40 dark:to-slate-800/20 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-500" /> {t('opportunities.opportunity')} Layer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">The Problem</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-6 italic">{oppLayer.problem}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Why Now</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-6">{oppLayer.whyMatters}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.who_cares')}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-6">{oppLayer.whoShouldCare}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Gem className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('opportunities.opportunity')}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pl-6">{oppLayer.opportunity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Startup Ideas */}
        {startupIdeas && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('trends.startup_ideas')}</h2>
            </div>
            <div className="space-y-3">
              {startupIdeas.map((idea, i) => (
                <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl p-4 hover:border-amber-200 dark:hover:border-amber-500/30 shadow-sm transition-colors">
                  <span className="text-xl font-extrabold text-gray-200 dark:text-slate-700 shrink-0 w-5">{i + 1}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{idea}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Who Should Care */}
        {whoShouldCare && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-500" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('trends.who_cares')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(whoShouldCare) ? whoShouldCare : [whoShouldCare]).map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">
                  {role}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
