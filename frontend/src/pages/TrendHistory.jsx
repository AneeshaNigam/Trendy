import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';



const fallbackArchives = [
  { topic: 'Generative Image Models', peak: 'Oct 2024', max: '9.5', status: 'Plateaued' },
  { topic: 'Vector Databases', peak: 'Aug 2024', max: '8.8', status: 'Mainstream' },
  { topic: 'No-Code/Low-Code', peak: 'Jun 2024', max: '7.2', status: 'Mainstream' },
  { topic: 'Web3 Gaming', peak: 'Mar 2024', max: '6.5', status: 'Declined' },
];

export default function TrendHistory() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();
  const [trends, setTrends] = useState([]);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Try to derive history from the trends API
        const res = await axios.get('http://localhost:5000/api/trends', { withCredentials: true });
        const apiTrends = res.data.trends || [];
        
        if (apiTrends.length > 0) {
          setTrends(apiTrends);
          // Derive archives from lower-scoring trends
          const apiArchives = apiTrends
            .filter(t => t.score < 7)
            .map(t => ({
              topic: t.name,
              peak: new Date(t.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              max: Number(t.score).toFixed(1),
              status: t.score >= 6 ? 'Plateaued' : t.score >= 4 ? 'Mainstream' : 'Declined',
            }));
          setArchives(apiArchives.length > 0 ? apiArchives : fallbackArchives);
        } else {
          setTrends([]);
          setArchives(fallbackArchives);
        }
      } catch (err) {
        console.warn('API unavailable for history:', err.message);
        setTrends([]);
        setArchives(fallbackArchives);
        setError('Showing sample history data (API unavailable)');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredArchives = archives.filter(arch => {
    if (!query) return true;
    return arch.topic.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto z-10 relative pb-12 transition-colors">
      <div className="mb-10 border-b border-gray-200 dark:border-slate-800 pb-6 relative transition-colors">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Trend History</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Historical view of the fastest growing startup sectors.</p>
        {query && <p className="text-amber-600 dark:text-amber-400 mt-2 font-medium">Filtering archives by: &quot;{query}&quot;</p>}
      </div>

      {error && (
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!query && trends && trends.length > 0 && (() => {
        const hot      = trends.filter(t => (t.score || 0) >= 8);
        const rising   = trends.filter(t => (t.score || 0) >= 5 && (t.score || 0) < 8);
        const emerg    = trends.filter(t => (t.score || 0) < 5);
        return (
          <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 mb-10 shadow-sm transition-colors">
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-6">Current Trend Status Overview</h3>
            <div className="grid grid-cols-3 gap-5">
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-5 text-center">
                <div className="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-2">{hot.length}</div>
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Hot 🔥</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Score ≥ 8.0</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 text-center">
                <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 mb-2">{rising.length}</div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Rising 📈</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Score 5.0–7.9</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5 text-center">
                <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{emerg.length}</div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Emerging 🌱</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Score &lt; 5.0</div>
              </div>
            </div>
          </div>
        );
      })()}
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Historical Archives</h3>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
            {filteredArchives.length === 0 ? (
               <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <p>No historical archives match your search.</p>
               </div>
            ) : (
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-8 py-5 font-semibold tracking-wide">Topic</th>
                  <th className="px-8 py-5 font-semibold tracking-wide">Peak Month</th>
                  <th className="px-8 py-5 font-semibold tracking-wide">Max Score</th>
                  <th className="px-8 py-5 font-semibold tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50 bg-white dark:bg-transparent">
                {filteredArchives.map((arch, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-900 dark:text-white">{arch.topic}</td>
                    <td className="px-8 py-5 text-gray-500 dark:text-gray-400">{arch.peak}</td>
                    <td className="px-8 py-5 text-gray-500 dark:text-gray-400">{arch.max}</td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm ${
                        arch.status === 'Plateaued' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                        arch.status === 'Mainstream' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20' :
                        'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                      }`}>
                        {arch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
        </div>
      </div>
    </div>
  );
}
