import { AlertTriangle } from 'lucide-react';

export function PlatformFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Observera:</strong> Beräkningarna i dessa verktyg är vägledande och kan innehålla fel eller avvikelser från faktiska skattebelopp.
              Använd gärna verktygen som underlag, men kontrollera alltid med Skatteverket eller din revisor för exakta uppgifter.
              Vi tar inget ansvar för eventuella felaktigheter i beräkningarna.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Konsulthjälpen {new Date().getFullYear()} • Verktyg för konsulter</p>
        </div>
      </div>
    </footer>
  );
}
