import { useState, useEffect } from 'react';
import { Search, Flame, LogIn, Globe } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setSearchValue(searchParams.get('q') || "");
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-[#0f1115] border-b border-gray-200 dark:border-slate-800 z-50 transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-lg">MR</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Market Radar</span>
        </Link>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('navbar.search_placeholder')}
              className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-slate-500"
            />
          </form>
        </div>
        
        {/* Actions & Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{t('navbar.home')}</Link>
          <Link to="/trends" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{t('navbar.trends')}</Link>
          <Link to="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{t('navbar.dashboard')}</Link>
          
            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>
          
          {/* Language Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
            >
              <Globe className="w-4 h-4" />
              {lang}
            </button>
            
            {isLangOpen && (
               <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50">
                  <button 
                     onClick={() => { setLang('EN'); i18n.changeLanguage('EN'); setIsLangOpen(false); }}
                     className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${lang === 'EN' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                     English (EN)
                  </button>
                  <button 
                     onClick={() => { setLang('ES'); i18n.changeLanguage('ES'); setIsLangOpen(false); }}
                     className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${lang === 'ES' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                     Español (ES)
                  </button>
                  <button 
                     onClick={() => { setLang('HI'); i18n.changeLanguage('HI'); setIsLangOpen(false); }}
                     className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${lang === 'HI' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                     Hindi (HI)
                  </button>
               </div>
            )}
          </div>

          <ThemeToggle />

          <a href="http://localhost:5000/api/auth/google" className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded font-medium transition-colors border border-black dark:border-white shadow-sm">
            <LogIn className="w-4 h-4" />
            <span>{t('navbar.login')}</span>
          </a>
        </div>
        
      </div>
    </nav>
  );
}
