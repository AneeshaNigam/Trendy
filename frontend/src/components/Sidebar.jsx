import { useEffect } from 'react';
import { BarChart3, TrendingUp, ChevronLeft, ChevronRight, CreditCard, Gem, PieChart, Radio } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { icon: BarChart3,   labelKey: 'sidebar.dashboard',     path: '/dashboard' },
    { icon: TrendingUp,  labelKey: 'sidebar.trends',        path: '/trends' },
    { icon: Gem,         labelKey: 'sidebar.opportunities', path: '/opportunities' },
    { icon: PieChart,    labelKey: 'sidebar.insights',      path: '/insights' },
    { icon: CreditCard,  labelKey: 'sidebar.pricing',       path: '/pricing' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#fafafa] dark:bg-[#0f1115] border-r border-gray-200 dark:border-slate-800 z-40 p-4 flex flex-col transition-all duration-300`}>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-700"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 mt-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.labelKey}
              to={item.path}
              title={isCollapsed ? t(item.labelKey) : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-slate-500'}`} />
              {!isCollapsed && <span>{t(item.labelKey)}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Radar System Status — live & animated */}
      <div className={`mt-auto mb-4 ${isCollapsed ? 'p-2 flex justify-center' : 'p-4'} rounded-xl bg-gray-100/50 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800 transition-all duration-300`}>
        {isCollapsed ? (
          <div
            className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"
            title={t('sidebar.radar_scanning')}
          />
        ) : (
          <div className="w-full space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Radar</span>
              </div>
              {/* Pulsing live dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              </span>
            </div>

            {/* Scanning line */}
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-snug">
              {t('sidebar.radar_scanning')}
            </p>

            {/* Bottom label */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-slate-800">
              <span className="font-medium">{t('sidebar.radar_label')}</span>
              <span>{t('sidebar.updated_now')}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
