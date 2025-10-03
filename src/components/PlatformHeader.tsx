import { useState } from 'react';
import { Home,
        Calculator,
        Wallet,
        ChevronDown,
        PiggyBank,
        Moon,
        Sun,
        FileText,
        DollarSign,
        Github
       } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../imgs/konsultverktyg.svg';

interface PlatformHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const tools = [
  {
    name: 'Fakturera rätt timpris',
    icon: DollarSign,
    route: '/fakturera-ratt-timpris',
  },
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
  {
    name: 'Tjänstepension',
    icon: PiggyBank,
    route: '/tjanstepension',
  },
  
  {
    name: 'Belopp och procentsatser',
    icon: FileText,
    route: '/k10-blankett',
  },
];

export function PlatformHeader({ theme, onToggleTheme }: PlatformHeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1c1c1c]/95 backdrop-blur-sm border-b border-[#e0e0e0] dark:border-[#3a3a3a]">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="text-[16px] font-semibold tracking-[-0.01em] text-[#1c1c1c] dark:text-[#f7f8fa] hover:text-[#0f92e9] dark:hover:text-[#0f92e9] transition-colors duration-200"
          >
            <img src={logo} className="h-8" alt="Verktyg för konsulter" />
          </Link>
          <div className="hidden md:inline-flex items-center gap-2 rounded-md border border-[#e0e0e0] dark:border-[#3a3a3a] bg-white dark:bg-[#3a3a3a] px-3 py-2 text-[13px] text-[#70757a] dark:text-[#9ca3af]">
            <span className="h-2 w-2 rounded-md bg-[#27b423]"></span>
            Gratis • Ingen inloggning behövs
          </div>

          <div className="flex items-center gap-[10px]">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-5 py-[10px] rounded-md text-[13px] font-medium text-[#1c1c1c] dark:text-[#f7f8fa] hover:bg-white dark:hover:bg-[#3a3a3a] border border-[#e0e0e0] dark:border-[#3a3a3a] transition-colors duration-200"
                aria-label="Verktyg"
              >
                <span>Verktyg</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#3a3a3a] border border-[#e0e0e0] dark:border-[#3a3a3a] rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] overflow-hidden z-20">
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.route}
                          to={tool.route}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#1c1c1c] dark:text-[#f7f8fa] hover:bg-[#f7f8fa] dark:hover:bg-[#1c1c1c] border-b border-[#e0e0e0] dark:border-[#3a3a3a] last:border-b-0 transition-colors duration-200"
                        >
                          <Icon size={16} />
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
                className="flex items-center gap-2 px-5 py-[10px] rounded-md text-[13px] font-medium text-[#1c1c1c] dark:text-[#f7f8fa] hover:bg-white dark:hover:bg-[#3a3a3a] border border-[#e0e0e0] dark:border-[#3a3a3a] transition-colors duration-200"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Hem</span>
              </Link>
            )}

            <a
              href="https://github.com/hardrockhodl/utdelningsplaneraren"
              target="_blank"
              rel="noopener noreferrer"
              className="p-[10px] rounded-md text-[#1c1c1c] dark:text-[#f7f8fa] hover:bg-white dark:hover:bg-[#3a3a3a] border border-[#e0e0e0] dark:border-[#3a3a3a] transition-colors duration-200"
              aria-label="GitHub repository"
            >
              <Github size={18} />
            </a>

            <button
              onClick={onToggleTheme}
              className="p-[10px] rounded-md text-[#1c1c1c] dark:text-[#f9dc5c] hover:bg-white dark:hover:bg-[#3a3a3a] border border-[#e0e0e0] dark:border-[#3a3a3a] transition-colors duration-200"
              aria-label="Växla tema"
            >
              {theme === 'dark' ? <Sun color="yellow" size={18} fill="yellow" /> : <Moon color="lightblue" size={18} fill="lightblue" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
