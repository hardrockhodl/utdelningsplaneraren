import { useState } from 'react';
import { Moon, Sun, Home, Calculator, Wallet, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface PlatformHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const tools = [
  {
    name: 'Lön efter skatt',
    icon: Wallet,
    route: '/lon-efter-skatt',
  },
  {
    name: 'Utdelningsplaneraren',
    icon: Calculator,
    route: '/utdelningsplaneraren',
  },
];

export function PlatformHeader({ theme, onToggleTheme }: PlatformHeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Verktyg"
              >
                <span>Verktyg</span>
                <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-20">
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.route}
                          to={tool.route}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Icon size={18} />
                          <span>{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

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
