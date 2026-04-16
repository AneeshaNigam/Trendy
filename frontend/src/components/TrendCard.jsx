import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { normalizeScore } from '../utils/normalizeScore';

export default function TrendCard({ trend }) {
  const navigate = useNavigate();
  const { _id, id, name, explanation, aiInsight, category } = trend;
  const score = normalizeScore(trend.score);
  
  const trendId = _id || id;

  const getStatusCls = (s) => {
    if (s >= 8) return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20';
    if (s >= 5) return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
    return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
  };

  const getStatusLabel = (s) => {
    if (s >= 8) return 'Hot 🔥';
    if (s >= 5) return 'Rising 📈';
    return 'Emerging 🌱';
  };

  return (
    <div 
      onClick={() => navigate(`/trends/${trendId}`)}
      className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full group relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/0 group-hover:bg-amber-400/5 dark:group-hover:bg-amber-500/5 rounded-full blur-[40px] transition-all duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors pr-2 leading-snug">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-full text-xs font-bold shrink-0" title={`Trend Score: ${score}/10`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{score}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
        {category && (
          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-medium">
            {category}
          </span>
        )}
        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getStatusCls(score)}`}>
          {getStatusLabel(score)}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed flex-1 relative z-10 line-clamp-3">
        {aiInsight || explanation || 'Trend intelligence being generated…'}
      </p>

      {/* Click hint */}
      <div className="flex items-center justify-end border-t border-gray-100 dark:border-slate-800 pt-3 mt-auto relative z-10">
        <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">View insights →</span>
      </div>
    </div>
  );
}
