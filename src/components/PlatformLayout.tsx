import { ReactNode } from 'react';
import { PlatformHeader } from './PlatformHeader';
import { PlatformFooter } from './PlatformFooter';
import { useTheme } from '../hooks/useTheme';

interface PlatformLayoutProps {
  children: ReactNode;
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <PlatformHeader theme={theme} onToggleTheme={toggleTheme} />
      <div className="flex-1">{children}</div>
      <PlatformFooter />
    </div>
  );
}
