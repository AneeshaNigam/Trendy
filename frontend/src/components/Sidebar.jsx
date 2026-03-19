import { BarChart3, TrendingUp, History, Bell, Settings, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeQuery = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Trends', path: '/trends' },
    { icon: History, label: 'Trend History', path: '/history' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: CreditCard, label: 'Pricing', path: '/pricing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#fafafa] dark:bg-[#0f1115] border-r border-gray-200 dark:border-slate-800 z-40 p-4 flex flex-col transition-all duration-300`}>
      <div className="flex justify-end mb-4">
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-slate-700"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="flex-1 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.label}
              to={`${item.path}${activeQuery}`}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg font-medium transition-all ${
                isActive 
                  ? 'bg-gray-100/80 dark:bg-slate-800 text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'
              }`} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Simple */}
      <div className={`mt-auto mb-4 ${isCollapsed ? 'p-2' : 'p-4'} rounded-xl bg-gray-100/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-800 transition-all duration-300 flex justify-center`}>
        {isCollapsed ? (
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" title="Radar Online"></div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">System Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Radar Online</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
