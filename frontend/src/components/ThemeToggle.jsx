import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400 dark:hover:text-gray-100 transition-colors shadow-sm"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
