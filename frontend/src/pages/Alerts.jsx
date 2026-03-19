import { BellRing, PlusCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const mockAlerts = [
  { id: 1, keyword: 'Autonomous Agents', condition: 'Score > 8.0', channel: 'Email', status: 'Active' },
  { id: 2, keyword: 'Rust Backend', condition: 'Mentions > 500/day', channel: 'Slack', status: 'Active' },
  { id: 3, keyword: 'Serverless SQLite', condition: 'Emerging (Score > 5)', channel: 'Email', status: 'Paused' }
];

export default function Alerts() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();

  const filteredAlerts = mockAlerts.filter(alert => {
    if (!query) return true;
    return alert.keyword.toLowerCase().includes(query) || alert.condition.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-4xl mx-auto z-10 relative pb-12 transition-colors">
      <div className="mb-10 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-6 relative transition-colors">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-[50px] pointer-events-none transition-colors"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Alerts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Manage notifications for specific keywords or trend thresholds.</p>
          {query && <p className="text-blue-600 dark:text-blue-400 mt-2 font-medium">Filtering by: &quot;{query}&quot;</p>}
        </div>
        <button className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-full text-sm font-semibold transition-all shadow-sm">
          <PlusCircle className="w-4 h-4" />
          Create Alert
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-16 text-center text-gray-500 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No alerts match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-colors group shadow-sm">
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-xl ${alert.status === 'Active' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{alert.keyword}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trigger: {alert.condition} • via {alert.channel}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  alert.status === 'Active' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
                }`}>
                  {alert.status}
                </span>
                <button className="text-sm text-gray-500 dark:text-slate-500 hover:text-black dark:hover:text-white font-medium transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
