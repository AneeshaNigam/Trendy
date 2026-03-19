import { Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-8 mt-auto border-t border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 bg-[#fafafa] dark:bg-[#0f1115] text-sm text-gray-500 dark:text-gray-400 z-10 relative transition-colors duration-300">
      <p className="font-medium text-gray-600 dark:text-gray-400">{t('footer.made_by')}</p>
      <a
        href="#"
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 dark:bg-amber-600 border border-amber-800 dark:border-amber-500 rounded-full hover:bg-amber-800 dark:hover:bg-amber-500 transition-colors text-white font-semibold shadow-sm"
      >
        <Coffee className="w-4 h-4" /> {t('footer.buy_coffee')}
      </a>
    </footer>
  );
}
