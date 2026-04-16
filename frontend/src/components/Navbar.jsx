import { useState, useEffect } from 'react';
import { Search, Globe } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'ZH', label: '中文' },
  { code: 'HI', label: 'हिंदी' },
  { code: 'ES', label: 'Español' },
  { code: 'FR', label: 'Français' },
  { code: 'JA', label: '日本語' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('trendy_lang') || 'EN');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleLangChange = (code) => {
    setLang(code);
    i18n.changeLanguage(code);
    localStorage.setItem('trendy_lang', code);
    setIsLangOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchValue.trim()
      ? `/trends?q=${encodeURIComponent(searchValue.trim())}`
      : '/trends'
    );
  };

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 z-50 transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Trendy</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder={t('navbar.search_placeholder')}
              className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder-gray-400 dark:placeholder-slate-500"
            />
          </form>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          <Link to="/"            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{t('navbar.home')}</Link>
          <Link to="/trends"      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{t('navbar.trends')}</Link>
          <Link to="/dashboard"   className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{t('navbar.dashboard')}</Link>

          <div className="w-px h-6 bg-gray-200 dark:bg-slate-700" />

          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang.label}</span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${lang === l.code ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
