import { TrendingUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TrendCard({ trend }) {
  const navigate = useNavigate();
  const { _id, id, name, score, explanation, signals, Posts, category } = trend;
  
  // Use _id if available (MongoDB), else fallback to mocked id
  const trendId = _id || id;
  
  // Handle mixed data models between mocked and API data
  const platforms = Array.from(new Set(
    (Posts || signals || []).map(p => p.source)
  ));

  return (
    <div 
      onClick={() => navigate(`/trends/${trendId}`)}
      className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-full text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{Number(score).toFixed(1)}</span>
        </div>
      </div>
      
      {category && (
        <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded text-xs font-medium mb-3 w-fit">
          {category}
        </span>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-1 pt-1">
        {explanation || 'No AI explanation generated yet for this trend.'}
      </p>
      
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <span key={p} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded text-xs font-medium">
              {p}
            </span>
          ))}
          {platforms.length === 0 && (
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium italic">No signal sources</span>
          )}
        </div>
        
        <button className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors p-1">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
