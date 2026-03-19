import { useSearchParams } from 'react-router-dom';

const mockHistoryData = [
  { month: 'Jan', AI_Agents: 45, Video_Tools: 30, Edge_AI: 20 },
  { month: 'Feb', AI_Agents: 55, Video_Tools: 38, Edge_AI: 22 },
  { month: 'Mar', AI_Agents: 85, Video_Tools: 45, Edge_AI: 35 },
  { month: 'Apr', AI_Agents: 95, Video_Tools: 60, Edge_AI: 40 },
  { month: 'May', AI_Agents: 120, Video_Tools: 85, Edge_AI: 55 },
];

const mockArchives = [
  { topic: 'Generative Image Models', peak: 'Oct 2024', max: '9.5', status: 'Plateaued' },
  { topic: 'Vector Databases', peak: 'Aug 2024', max: '8.8', status: 'Mainstream' }
];

export default function TrendHistory() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();

  const filteredArchives = mockArchives.filter(arch => {
    if (!query) return true;
    return arch.topic.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-6xl mx-auto z-10 relative pb-12 transition-colors">
      <div className="mb-10 border-b border-gray-200 dark:border-slate-800 pb-6 relative transition-colors">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Trend History</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Historical view of the fastest growing startup sectors.</p>
        {query && <p className="text-blue-600 dark:text-blue-400 mt-2 font-medium">Filtering archives by: &quot;{query}&quot;</p>}
      </div>

      {!query && (
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 mb-10 relative overflow-hidden group shadow-sm transition-colors">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-blue-100 dark:group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-8 relative z-10">Mention Velocity over 5 Months</h3>
          <div className="h-80 w-full relative z-10">
            <div className="flex h-64 items-end gap-6 border-l border-b border-gray-200 dark:border-slate-700/50 px-6 pt-4 relative">
               {/* Grid lines */}
               <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between hidden md:flex pointer-events-none">
                 {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-t border-gray-100 dark:border-slate-700/30 w-full transition-colors"></div>
                 ))}
               </div>
               {mockHistoryData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-3 group/bar relative z-10">
                     <div className="w-full bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-t-xl transition-all duration-300 group-hover/bar:bg-blue-500 dark:group-hover/bar:bg-blue-600/60 group-hover/bar:border-blue-600 dark:group-hover/bar:border-blue-500/60 relative dark:group-hover/bar:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-sm" style={{ height: `${d.AI_Agents * 1.5}px` }}>
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-blue-300 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm whitespace-nowrap">{d.AI_Agents} signals</span>
                     </div>
                     <span className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-500 uppercase mt-2">{d.month}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>
      )}
      
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
                    <td className="px-8 py-5"><span className="px-4 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-bold tracking-wide shadow-sm">{arch.status}</span></td>
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
