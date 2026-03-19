import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, ExternalLink, Lightbulb, Loader2, FileText, Sheet, Code } from 'lucide-react';
import axios from 'axios';

// Fallback mock data in case API is down or trend is not found
const mockEmergingTrends = [
  {
    id: '4',
    name: 'LLM Orchestration Frameworks',
    explanation: 'Surge in frameworks designed to orchestrate complex multi-agent LLM workflows. Companies are moving beyond single-prompt apps to complex systems where multiple AI agents collaborate, requiring new infrastructure to manage state, memory, and execution flow.',
    score: 8.8,
    category: 'Technology',
    Posts: [
      { source: 'GitHub', url: 'https://github.com/trending' }, 
      { source: 'Hacker News', url: 'https://news.ycombinator.com' }
    ],
    signals: [
      { text: "LangChain releases new agent architecture", source: "GitHub", url: "https://github.com/langchain" },
      { text: "Why orchestrating LLMs is the next big infrastructure play", source: "Hacker News", url: "https://news.ycombinator.com" },
      { text: "Building robust multi-agent systems", source: "Reddit", url: "https://reddit.com/r/MachineLearning" }
    ]
  },
  {
    id: '5',
    name: 'Edge AI inference',
    explanation: 'Increasing momentum around running small LLMs locally on edge devices for privacy and speed. As open-source models become smaller and more capable, developers are pushing inference to laptops and phones rather than relying on expensive cloud APIs.',
    score: 7.9,
    category: 'Technology',
    Posts: [{ source: 'Reddit', url: 'https://reddit.com/r/LocalLLaMA' }],
    signals: [
      { text: "Llama.cpp runs 7B model on iPhone", source: "GitHub", url: "https://github.com/ggerganov/llama.cpp" },
      { text: "The future of AI is local", source: "Reddit", url: "https://reddit.com/r/LocalLLaMA" }
    ]
  }
];

export default function TrendDetail() {
  const { id } = useParams();
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [startupIdeas, setStartupIdeas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);
        // Try fetching from the actual backend
        const res = await axios.get(`http://localhost:5000/api/trends/${id}`, {
          withCredentials: true
        });
        setTrend(res.data.trend);
      } catch (err) {
        console.warn("Backend fetch failed, using mock data", err);
        // Fallback to mock data if API fails or returns 404/401
        const mockTrend = mockEmergingTrends.find(t => t.id === id);
        if (mockTrend) {
          setTrend(mockTrend);
        } else {
          setError('Trend not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, [id]);

  const generateIdeas = async () => {
    setGeneratingIdeas(true);
    // Simulate API call for generating ideas based on this trend
    setTimeout(() => {
      setStartupIdeas([
        `A developer tool that makes it seamless to implement ${trend?.name} into existing pipelines.`,
        `A highly targeted B2B SaaS platform leveraging ${trend?.name} to solve a niche industry pain point.`,
        `An open-source infrastructure project designed to commoditize the core technology behind ${trend?.name}.`
      ]);
      setGeneratingIdeas(false);
    }, 1500);
  };

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
         <p className="text-gray-500 dark:text-gray-400 mb-8">We couldn't find the details for this trend.</p>
         <Link to="/trends" className="text-blue-600 dark:text-blue-400 hover:underline">Back to Trends</Link>
       </div>
     );
  }

  // Handle both mock structures and mongoose populated structures
  const signalsList = trend.signals || trend.Posts || [];

  return (
    <div className="max-w-4xl mx-auto pb-12 transition-colors">
      {/* Header */}
      <div className="mb-6">
        <Link to="/trends" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Trends
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{trend.name}</h1>
            {trend.category && (
               <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-xs font-semibold mt-3">
                  {trend.category}
               </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-full font-bold shadow-sm">
               <TrendingUp className="w-5 h-5" />
               <span className="text-lg">{Number(trend.score).toFixed(1)}</span>
             </div>
             <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-1 ml-auto md:ml-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors" title="Export to PDF">
                   <FileText className="w-3.5 h-3.5 text-red-500" /> PDF
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-slate-700"></div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors" title="Export to Excel">
                   <Sheet className="w-3.5 h-3.5 text-green-600 dark:text-green-500" /> Excel
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-slate-700"></div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors" title="Export via API (JSON)">
                   <Code className="w-3.5 h-3.5 text-blue-500" /> JSON
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl p-8 mb-8 shadow-sm transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Explanation</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {trend.explanation || 'No detailed explanation available for this trend.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
         {/* Signals / Sources */}
         <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
               Signal Sources
            </h2>
            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
               {signalsList.length > 0 ? (
                  <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                     {signalsList.map((signal, idx) => (
                        <li key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                           <a 
                              href={signal.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-start justify-between group"
                           >
                              <div>
                                 <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded mb-2 border border-gray-200 dark:border-slate-700">
                                    {signal.source || 'Internet'}
                                 </span>
                                 <p className="text-sm text-gray-800 dark:text-gray-200 font-medium group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                    {signal.text || signal.title || `Discussion thread on ${signal.source}`}
                                 </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </a>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No specific signals recorded.</div>
               )}
            </div>
         </div>

         {/* Startup Idea Generator */}
         <div>
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-xl p-6 h-full flex flex-col transition-colors">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 inline-flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Startup Ideas
               </h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Use our AI to brainstorm potential startup ideas capitalizing on this emerging trend.
               </p>
               
               {startupIdeas.length > 0 ? (
                  <div className="flex-1">
                     <ul className="space-y-4 mb-6">
                        {startupIdeas.map((idea, idx) => (
                           <li key={idx} className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm relative pl-10">
                              <span className="absolute left-4 top-4 font-bold text-amber-500">{idx + 1}.</span>
                              {idea}
                           </li>
                        ))}
                     </ul>
                     <button 
                        onClick={generateIdeas}
                        disabled={generatingIdeas}
                        className="w-full py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                     >
                        {generatingIdeas ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                        Generate More Ideas
                     </button>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                     <button 
                        onClick={generateIdeas}
                        disabled={generatingIdeas}
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-md active:scale-95 flex items-center gap-2"
                     >
                        {generatingIdeas ? (
                           <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                           </>
                        ) : (
                           <>
                              <Lightbulb className="w-5 h-5" /> Generate Ideas
                           </>
                        )}
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
