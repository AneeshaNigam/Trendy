import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, TrendingUp, Loader2, AlertTriangle,
  ChevronDown, X, Lightbulb, Users, Sparkles, Info,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { normalizeScore } from '../utils/normalizeScore';
import { useTranslation } from 'react-i18next';

// ─── Status badge helper ───────────────────────────────────────────────────────

function getStatus(score) {
  if (score >= 8) return { label: 'Hot',      emoji: '🔥', cls: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' };
  if (score >= 6) return { label: 'Rising',   emoji: '📈', cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
  return           { label: 'Emerging', emoji: '🌱', cls: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' };
}

// ─── Trend card ────────────────────────────────────────────────────────────────

function TrendCard({ trend, onSelect }) {
  const { t } = useTranslation();
  const score  = normalizeScore(trend.score);
  const status = getStatus(score);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(trend)}
      onKeyDown={e => e.key === 'Enter' && onSelect(trend)}
      className="group bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col gap-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      aria-label={`View insights for ${trend.name}`}
    >
      {/* Hover glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/0 group-hover:bg-amber-400/8 dark:group-hover:bg-amber-500/6 blur-[50px] pointer-events-none transition-all duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {trend.category && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-[11px] font-bold tracking-wide">
                {trend.category}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${status.cls}`}>
              {status.label} {status.emoji}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug text-[15px] line-clamp-2">
            {trend.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs font-bold shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          {score}
        </div>
      </div>

      {/* AI Insight preview — real content, 2 lines */}
      {(trend.aiInsight || trend.explanation) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {trend.aiInsight || trend.explanation}
        </p>
      )}

      {/* CTA row */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-auto pt-3 border-t border-gray-100 dark:border-slate-800">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('trends.click_insights')}</span>
        <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}

// ─── Detail modal ──────────────────────────────────────────────────────────────

function TrendModal({ trend, onClose }) {
  const { t } = useTranslation();
  const score  = normalizeScore(trend.score);
  const status = getStatus(score);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {trend.category && (
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-bold">
                    {trend.category}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded border text-xs font-bold ${status.cls}`}>
                  {status.label} {status.emoji}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{trend.name}</h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm font-bold">
                <TrendingUp className="w-4 h-4" /> {score}/10
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Context / Explanation */}
          {trend.explanation && (
            <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/60 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{trend.explanation}</p>
            </div>
          )}

          {/* AI Insight */}
          {trend.aiInsight && (
            <section className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-500/8 dark:to-orange-500/5 border border-amber-200/80 dark:border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t('trends.ai_insight')}</h3>
              </div>
              <p className="text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">{trend.aiInsight}</p>
            </section>
          )}

          {/* Why It Matters */}
          {(trend.whyItMatters || trend.whyMatters) && (
            <section className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200/80 dark:border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">{t('trends.why_matters')}</h3>
              </div>
              <p className="text-sm text-blue-900 dark:text-blue-200/90 leading-relaxed">{trend.whyItMatters || trend.whyMatters}</p>
            </section>
          )}

          {/* Startup Ideas */}
          {trend.startupIdeas?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.startup_ideas')}</h3>
              </div>
              <div className="space-y-2.5">
                {trend.startupIdeas.map((idea, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-xl p-4 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors">
                    <span className="text-lg font-extrabold text-gray-200 dark:text-slate-700 shrink-0 w-5 leading-snug">{i + 1}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{idea}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Who Should Care */}
          {trend.whoShouldCare?.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('trends.who_cares')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(trend.whoShouldCare) ? trend.whoShouldCare : [trend.whoShouldCare]).map((role, i) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold">
                    {role}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Example queries ─────────────────────────────────────────────────────────

const EXAMPLE_QUERIES = [
  'AI agents', 'climate fintech', 'mental health tech', 'embedded finance',
  'personalized learning', 'vertical AI SaaS', 'edge computing', 'quantum startups'
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Trends() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue]     = useState(searchParams.get('q') || '');
  const [query, setQuery]               = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTrend, setSelectedTrend]   = useState(null);
  const debounceRef = useRef(null);

  const { trends, loading, error, total, hasMore, loadMore } = useSearch(query, 300);

  // Sync URL
  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true });
    else        setSearchParams({},           { replace: true });
  }, [query, setSearchParams]);

  const handleInput = (value) => {
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(value.trim());
      setCategoryFilter('All');
    }, 350);
  };

  const clearSearch = () => { setInputValue(''); setQuery(''); setCategoryFilter('All'); };

  const categories  = ['All', ...Array.from(new Set(trends.map(t => t.category).filter(Boolean)))];
  const filtered    = categoryFilter === 'All' ? trends : trends.filter(t => t.category === categoryFilter);
  const isIdle      = !query || query.length < 2;
  const isEmpty     = !loading && !error && query.length >= 2 && trends.length === 0;

  return (
    <div className="max-w-5xl mx-auto pb-16">

      {/* Page header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">{t('trends.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('trends.subtitle')}</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
          <input
            id="trends-search"
            type="text"
            value={inputValue}
            onChange={e => handleInput(e.target.value)}
            placeholder={t('trends.search_placeholder')}
            autoFocus
            aria-label="Search trends"
            className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl pl-12 pr-12 py-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm placeholder-gray-400 dark:placeholder-slate-500"
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-pulse w-3/4" />
          </div>
        )}
      </div>

      {/* Category filters — no export button */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
          {total > 0 && (
            <span className="ml-auto text-sm text-gray-400 dark:text-gray-500">{total} {t('trends.found')}</span>
          )}
        </div>
      )}

      {/* Idle state */}
      {isIdle && (
        <div className="mt-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl flex items-center justify-center border border-amber-200 dark:border-amber-500/20 shadow-sm">
            <Search className="w-9 h-9 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('trends.search_anything')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm mb-6">{t('trends.search_desc')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_QUERIES.map(ex => (
              <button
                key={ex}
                onClick={() => { setInputValue(ex); setQuery(ex); }}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-sm"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && trends.length === 0 && (
        <div className="mt-14 flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('trends.scanning')}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t('trends.generating')} &ldquo;{query}&rdquo;
            </p>
          </div>
          {/* Loading skeleton cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-4/5 mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 flex items-start gap-3 px-5 py-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-sm text-red-700 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{t('trends.failed')}</p>
            <p className="mt-0.5 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {isEmpty && (
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('trends.no_found')} &ldquo;<strong>{query}</strong>&rdquo;</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('trends.try_different')}</p>
        </div>
      )}

      {/* Results grid */}
      {filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(trend => (
              <TrendCard key={trend._id} trend={trend} onSelect={setSelectedTrend} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-sm disabled:opacity-50"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
                  : <><ChevronDown className="w-4 h-4" /> {t('trends.load_more')}</>}
              </button>
            </div>
          )}

          {loading && trends.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      {selectedTrend && (
        <TrendModal trend={selectedTrend} onClose={() => setSelectedTrend(null)} />
      )}
    </div>
  );
}
