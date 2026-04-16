import { useState, useEffect } from 'react';
import { BellRing, PlusCircle, Clock, Lightbulb, AlertTriangle, Loader2, ChevronDown, Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const fallbackAlerts = [
  { id: 1, keyword: 'Autonomous Agents', condition: 'Score > 8.0', channel: 'Email', status: 'Active', whyMatters: 'Autonomous agents are rapidly becoming the backbone of AI workflow automation. A breakout in this space signals new tooling and infrastructure opportunities.', history: [{ event: 'Score exceeded 8.5', time: '2 hours ago' }, { event: 'Mention velocity spike (+140%)', time: '1 day ago' }] },
  { id: 2, keyword: 'Rust Backend', condition: 'Mentions > 500/day', channel: 'Slack', status: 'Active', whyMatters: 'Rust adoption in backend systems indicates a shift toward performance-critical infrastructure. Companies rebuilding core services in Rust often signal new platform plays.', history: [{ event: 'Daily mentions crossed 520', time: '4 hours ago' }] },
  { id: 3, keyword: 'Serverless SQLite', condition: 'Emerging (Score > 5)', channel: 'Email', status: 'Paused', whyMatters: 'Serverless SQLite bridges edge computing and traditional databases. Early movement here could define the next generation of data-intensive applications.', history: [{ event: 'Score reached 5.2', time: '3 days ago' }, { event: 'Alert paused by user', time: '2 days ago' }] },
];

const suggestedAlerts = [
  { keyword: 'LLM Orchestration', reason: 'Score 8.8 — high velocity growth detected' },
  { keyword: 'Edge AI Inference', reason: 'Score 7.9 — cross-platform signal spike' },
  { keyword: 'Synthetic Data', reason: 'Score 6.5 — emerging startup activity' },
];

export default function Alerts() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // In a full implementation, this would call a dedicated alerts API
        // For now, use fallback data with realistic structure
        await new Promise(resolve => setTimeout(resolve, 500));
        setAlerts(fallbackAlerts);
      } catch (err) {
        console.warn('Alert fetch failed:', err);
        setAlerts(fallbackAlerts);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (!query) return true;
    return alert.keyword.toLowerCase().includes(query) || alert.condition.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto z-10 relative pb-12 transition-colors">
      <div className="mb-10 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-6 relative transition-colors">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-[50px] pointer-events-none transition-colors"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Alerts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Manage notifications for specific keywords or trend thresholds.</p>
          {query && <p className="text-amber-600 dark:text-amber-400 mt-2 font-medium">Filtering by: &quot;{query}&quot;</p>}
        </div>
        <button className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98]">
          <PlusCircle className="w-4 h-4" />
          Create Alert
        </button>
      </div>

      {/* Active Alerts */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-16 text-center text-gray-500 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No alerts match your search.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-slate-700 transition-all shadow-sm group">
              {/* Main Alert Row */}
              <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}>
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
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedAlert === alert.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              <div className={`overflow-hidden transition-all duration-300 ${expandedAlert === alert.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-slate-800 pt-4 space-y-4">
                  {/* Why This Alert Matters */}
                  <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Why This Alert Matters</span>
                    </div>
                    <p className="text-sm text-amber-900 dark:text-amber-300/90 leading-relaxed">{alert.whyMatters}</p>
                  </div>

                  {/* Alert History */}
                  {alert.history && alert.history.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent History</span>
                      </div>
                      <div className="space-y-2">
                        {alert.history.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{h.event}</span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">{h.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button className="text-sm text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-white font-medium transition-colors px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">Edit</button>
                    <button className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Alerts */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" /> Suggested Alerts
        </h3>
        <div className="space-y-3">
          {suggestedAlerts.map((sa, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors group">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{sa.keyword}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{sa.reason}</p>
              </div>
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-500/30 transition-all">
                + Add Alert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
