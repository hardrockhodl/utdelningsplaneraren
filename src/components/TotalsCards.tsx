import { YearCalculation } from '../types';
import { formatNumber } from '../lib/calculations';
import { Wallet, TrendingUp, Banknote, PiggyBank } from 'lucide-react';

interface TotalsCardsProps {
  years: YearCalculation[];
}

export function TotalsCards({ years }: TotalsCardsProps) {
  const totalNetSalary = years.reduce((sum, year) => sum + year.netSalaryYearly, 0);
  const totalNetDividend = years.reduce((sum, year) => sum + year.netDividend, 0);
  const totalNetToOwner = totalNetSalary + totalNetDividend;
  const finalEquity = years.length > 0 ? years[years.length - 1].closingEquity : 0;

  const cards = [
    {
      icon: Wallet,
      label: 'Total nettolön',
      value: totalNetSalary,
      color: '#27b423',
    },
    {
      icon: TrendingUp,
      label: 'Total utdelning netto',
      value: totalNetDividend,
      color: '#27b423',
    },
    {
      icon: Banknote,
      label: 'Totalt netto till ägare',
      value: totalNetToOwner,
      color: '#27b423',
    },
    {
      icon: PiggyBank,
      label: 'Utgående fritt eget kapital',
      value: finalEquity,
      color: '#27b423',
    },
  ];

  return (
    <div className="totals-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="total-card">
            <div className="card-icon" style={{ color: card.color }}>
              <Icon size={24} />
            </div>
            <div className="card-content">
              <div className="card-label">{card.label}</div>
              <div className="card-value">{formatNumber(card.value, 0)} kr</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
