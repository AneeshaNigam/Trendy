import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Activity, Radio, Flame } from 'lucide-react';
import TrendCard from '../components/TrendCard';

export default function Dashboard() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trends', {
          withCredentials: true
        });
        setTrends(res.data.trends || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredTrends = trends.filter(trend => {
    if (!query) return true;
    return (
      trend.name.toLowerCase().includes(query) ||
      (trend.explanation && trend.explanation.toLowerCase().includes(query))
    );
  });

  // Separate top 3 trends by score
  const sortedTrends = [...filteredTrends].sort((a, b) => b.score - a.score);
  const topTrends = sortedTrends.slice(0, 3);
  const otherTrends = sortedTrends.slice(3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-6 transition-colors">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time analysis of emerging market narratives.</p>
        </div>
        {query && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-500 font-medium">
            Filtering by: "{query}"
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content (Trends) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Top 3 Trends Highlight */}
          {!loading && topTrends.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" /> Top Growing Trends
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topTrends.map(trend => (
                  <div key={trend._id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative h-full">
                      <TrendCard trend={trend} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Detected Trends */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Other Detected Trends
               </h2>
            </div>
            
            {loading ? (
               <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-16 text-center shadow-sm h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-700 border-t-gray-800 dark:border-t-white rounded-full animate-spin"></div>
               </div>
            ) : filteredTrends.length === 0 ? (
               <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-16 text-center text-gray-500 dark:text-gray-400 shadow-sm">
                  No trends match your criteria.
               </div>
            ) : otherTrends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherTrends.map(trend => (
                  <TrendCard key={trend._id} trend={trend} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-900/30 border border-dashed border-gray-200 dark:border-slate-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                 No additional trends found.
              </div>
            )}
          </div>

          {/* Simple Trending Graphs */}
          <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Aggregate Trend Growth</h2>
             <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
                <div className="w-1/6 bg-blue-100 dark:bg-blue-900/40 rounded-t-sm h-1/4 relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 dark:text-white transition-opacity">12%</span>
                </div>
                <div className="w-1/6 bg-blue-200 dark:bg-blue-800/50 rounded-t-sm h-2/5 relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 dark:text-white transition-opacity">25%</span>
                </div>
                <div className="w-1/6 bg-blue-300 dark:bg-blue-700/60 rounded-t-sm h-[45%] relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 dark:text-white transition-opacity">30%</span>
                </div>
                <div className="w-1/6 bg-blue-400 dark:bg-blue-600/70 rounded-t-sm h-[60%] relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 dark:text-white transition-opacity">45%</span>
                </div>
                <div className="w-1/6 bg-blue-500 dark:bg-blue-500/80 rounded-t-sm h-[85%] relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 dark:text-white transition-opacity">80%</span>
                </div>
                <div className="w-1/6 bg-blue-600 dark:bg-blue-500 rounded-t-sm h-full relative group">
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 dark:text-white transition-opacity">100%</span>
                </div>
             </div>
             <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-2 px-2">
                <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
             </div>
          </div>
        </div>

        {/* Sidebar for Feed (Trending Signals) */}
        <div className="space-y-6">
           <div className="bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-800 rounded-lg p-5 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Radio className="w-5 h-5 text-amber-600 dark:text-amber-500" /> Live Signal Feed
              </h2>
              <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-slate-700 before:to-transparent">
                 <li className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-4 ring-gray-50 dark:ring-[#0f1115] border-2 border-white dark:border-transparent"></span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">"Anthropic releases new 3.5 Sonnet limits"</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hacker News • 2m ago</p>
                 </li>
                 <li className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 bg-gray-400 dark:bg-slate-500 rounded-full ring-4 ring-gray-50 dark:ring-[#0f1115] border-2 border-white dark:border-transparent"></span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">"Local fine-tuning on M4 Mac is insane"</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reddit r/LocalLLaMA • 15m ago</p>
                 </li>
                 <li className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 bg-gray-400 dark:bg-slate-500 rounded-full ring-4 ring-gray-50 dark:ring-[#0f1115] border-2 border-white dark:border-transparent"></span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">vercel/ai-sdk reached trending #1</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">GitHub • 1h ago</p>
                 </li>
                 <li className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 bg-gray-400 dark:bg-slate-500 rounded-full ring-4 ring-gray-50 dark:ring-[#0f1115] border-2 border-white dark:border-transparent"></span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">"Why RAG is actually a data engineering problem"</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">X (Twitter) • 2h ago</p>
                 </li>
                 <li className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 bg-gray-400 dark:bg-slate-500 rounded-full ring-4 ring-gray-50 dark:ring-[#0f1115] border-2 border-white dark:border-transparent"></span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">New paper on Transformer alternatives</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ArXiv • 4h ago</p>
                 </li>
              </ul>
              <button className="w-full mt-6 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                 View All Signals
              </button>
           </div>
           
           <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg p-5 shadow-sm transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Platform Dist.</h3>
              <div className="space-y-3">
                 <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                       <span>Reddit</span><span>45%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full w-[45%]"></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                       <span>GitHub</span><span>30%</span>
                     </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-gray-800 dark:bg-gray-400 h-1.5 rounded-full w-[30%]"></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                       <span>Hacker News</span><span>25%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-amber-600 h-1.5 rounded-full w-[25%]"></div></div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
