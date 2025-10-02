import { Moon, Sun, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface PlatformHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function PlatformHeader({ theme, onToggleTheme }: PlatformHeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>Konsulthjälpen</span>
          </Link>

          <div className="flex items-center space-x-4">
            {!isHome && (
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Hem</span>
              </Link>
            )}

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Växla tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
