import { AlertTriangle } from 'lucide-react';

export function PlatformFooter() {
  return (
    <footer className="mt-auto border-t border-[#e0e0e0] dark:border-[#3a3a3a] bg-white dark:bg-[#1c1c1c]">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex items-start gap-3 p-4 bg-[#f9dc5c]/10 border border-[#f9dc5c]/40 rounded-md">
          <AlertTriangle size={18} className="text-[#f7931a] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[13px] text-[#1c1c1c] dark:text-[#f7f8fa] leading-[1.5]">
              <strong>Observera:</strong> Beräkningarna i dessa verktyg är vägledande och kan innehålla fel eller avvikelser från faktiska skattebelopp.
              Använd gärna verktygen som underlag, men kontrollera alltid med Skatteverket eller din revisor för exakta uppgifter.
              Vi tar inget ansvar för eventuella felaktigheter i beräkningarna.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-[13px] text-[#70757a]">
          <p>Konsulthjälpen {new Date().getFullYear()} • Verktyg för konsulter</p>
        </div>
      </div>
    </footer>
  );
}
