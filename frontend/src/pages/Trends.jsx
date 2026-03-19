import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TrendingUp, Flame } from 'lucide-react';
import TrendCard from '../components/TrendCard';

const mockEmergingTrends = [
  {
    id: '4',
    name: 'LLM Orchestration Frameworks',
    explanation: 'Surge in frameworks designed to orchestrate complex multi-agent LLM workflows.',
    score: 8.8,
    category: 'Technology',
    Posts: [{ source: 'GitHub' }, { source: 'Hacker News' }]
  },
  {
    id: '5',
    name: 'Edge AI inference',
    explanation: 'Increasing momentum around running small LLMs locally on edge devices for privacy and speed.',
    score: 7.9,
    category: 'Technology',
    Posts: [{ source: 'Reddit' }]
  },
  {
    id: '6',
    name: 'Synthetic Data Generation',
    explanation: 'Startups focusing on generating high-quality synthetic data to train specialized models.',
    score: 6.5,
    category: 'Business',
    Posts: [{ source: 'Product Hunt' }, { source: 'Hacker News' }]
  }
];

export default function Trends() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get('q') || '').toLowerCase();
  
  const [platformFilter, setPlatformFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Derive all unique platforms and categories for the filter dropdowns
  const allPlatforms = ['All', ...Array.from(new Set(
    mockEmergingTrends.flatMap(t => (t.Posts || []).map(p => p.source))
  ))];
  
  const allCategories = ['All', ...Array.from(new Set(
    mockEmergingTrends.map(t => t.category).filter(Boolean)
  ))];

  const filteredTrends = mockEmergingTrends.filter(trend => {
    // 1. Search Query Filter
    const matchesQuery = !query || 
      trend.name.toLowerCase().includes(query) ||
      (trend.explanation && trend.explanation.toLowerCase().includes(query));
      
    // 2. Platform Filter
    const trendPlatforms = (trend.Posts || []).map(p => p.source);
    const matchesPlatform = platformFilter === 'All' || trendPlatforms.includes(platformFilter);
    
    // 3. Score Filter
    let matchesScore = true;
    if (scoreFilter === 'High (>8)') matchesScore = trend.score > 8;
    if (scoreFilter === 'Medium (5-8)') matchesScore = trend.score >= 5 && trend.score <= 8;
    
    // 4. Category Filter
    const matchesCategory = categoryFilter === 'All' || trend.category === categoryFilter;

    return matchesQuery && matchesPlatform && matchesScore && matchesCategory;
  });

  const clearFilters = () => {
    setPlatformFilter('All');
    setScoreFilter('All');
    setCategoryFilter('All');
  };

  // Identify the top trend for the "Explore Trends" featured section
  const sortedTrends = [...filteredTrends].sort((a, b) => b.score - a.score);
  const featuredTrend = sortedTrends.length > 0 && sortedTrends[0].score >= 8.0 ? sortedTrends[0] : null;
  const standardTrends = featuredTrend ? sortedTrends.slice(1) : sortedTrends;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-6 transition-colors">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Trends Explorer</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">A comprehensive view of all early signals detected across platforms.</p>
        {query && <p className="text-gray-900 dark:text-gray-200 font-medium mt-2">Searching for: &quot;{query}&quot;</p>}
      </div>

      {/* Explore Trends Featured Section */}
      {!query && featuredTrend && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Explore Featured Trend</h3>
          <div 
             onClick={() => navigate(`/trends/${featuredTrend.id}`)}
             className="bg-white dark:bg-slate-900/50 border-2 border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 md:p-8 cursor-pointer hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-md group relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-400/20 dark:group-hover:bg-amber-500/10 transition-colors duration-500"></div>
             
             <div className="flex-1 z-10">
                <div className="flex items-center gap-3 mb-3">
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-500/20 shadow-sm">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500 animate-pulse" />
                      Hot Trend
                   </div>
                   {featuredTrend.category && (
                      <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-xs font-semibold">
                         {featuredTrend.category}
                      </span>
                   )}
                </div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                   {featuredTrend.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg line-clamp-2">
                   {featuredTrend.explanation}
                </p>
             </div>
             
             <div className="flex-shrink-0 z-10 flex items-center justify-center bg-gray-50 dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="text-center">
                   <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Score</span>
                   <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">
                      <TrendingUp className="w-6 h-6 text-amber-500" />
                      {featuredTrend.score.toFixed(1)}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
      
      {/* Filters Section */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Detected Trends</h3>
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform:</label>
           <select 
             className="text-sm border border-gray-300 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
             value={platformFilter}
             onChange={(e) => setPlatformFilter(e.target.value)}
           >
             {allPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
           </select>
        </div>
        <div className="flex items-center gap-2">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
           <select 
             className="text-sm border border-gray-300 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
             value={categoryFilter}
             onChange={(e) => setCategoryFilter(e.target.value)}
           >
             {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
        <div className="flex items-center gap-2">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Score:</label>
           <select 
             className="text-sm border border-gray-300 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
             value={scoreFilter}
             onChange={(e) => setScoreFilter(e.target.value)}
           >
             <option value="All">All Scores</option>
             <option value="High (>8)">High (&gt; 8.0)</option>
             <option value="Medium (5-8)">Medium (5.0 - 8.0)</option>
           </select>
        </div>
      </div>

      {standardTrends.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-16 text-center text-gray-500 dark:text-gray-400 shadow-sm transition-colors">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No trends found matching your filters.</p>
          <button 
             onClick={clearFilters}
             className="mt-4 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-md text-sm font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {standardTrends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      )}
    </div>
  );
}
