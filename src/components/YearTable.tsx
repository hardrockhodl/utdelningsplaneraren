import { YearCalculation } from '../types';
import { formatNumber } from '../lib/calculations';
import { labels } from '../lib/labels';

interface YearTableProps {
  years: YearCalculation[];
  onUpdateYear: (yearIndex: number, field: keyof YearCalculation, value: number) => void;
}

export function YearTable({ years, onUpdateYear }: YearTableProps) {
  const editableFields: Array<{ key: keyof YearCalculation; label: string; suffix: string; desc?: string }> = [
    { key: 'hourlyRate', label: 'Timpris', suffix: 'kr', desc: 'Fakturerat timpris exkl. moms' },
    { key: 'hoursPerMonth', label: 'Timmar/mån', suffix: 'h', desc: 'Antal fakturerbara timmar per månad' },
    { key: 'grossSalaryMonthly', label: 'Bruttolön (mån)', suffix: 'kr', desc: labels.terms.grossSalary.desc.sv },
    { key: 'otherCostsMonthly', label: 'Övr. kostn (mån)', suffix: 'kr', desc: 'Övriga månadskostnader i bolaget' },
    { key: 'bufferPercent', label: 'Buffert', suffix: '%', desc: labels.terms.buffer.desc.sv },
    { key: 'dividendPercent', label: 'Utdelning', suffix: '%', desc: labels.terms.dividendPct.desc.sv },
  ];

  const calculatedFields: Array<{ key: keyof YearCalculation; label: string; desc?: string; divideBy12?: boolean; highlight?: 'green' | 'yellow' }> = [
    { key: 'billedYearly', label: 'Fakturerat (år)', desc: 'Total fakturering för året' },
    { key: 'grossSalaryYearly', label: 'Bruttolön (år)', desc: labels.terms.grossSalary.desc.sv },
    { key: 'netSalaryYearly', label: 'Nettolön (år)', desc: labels.terms.netSalary.desc.sv },
    { key: 'netSalaryYearly', label: 'Nettolön (mån)', desc: 'Nettolön per månad', divideBy12: true, highlight: 'green' },
    { key: 'employerContributionYearly', label: 'Arbetsgivaravgift (år)', desc: labels.terms.employerContribution.desc.sv },
    { key: 'costsYearly', label: 'Kostnader (år)', desc: 'Totala övriga kostnader för året' },
    { key: 'bufferYearly', label: 'Buffert (år)', desc: 'Belopp som sparas som buffert' },
    { key: 'surplusYearly', label: 'Överskott (år)', desc: labels.terms.operatingSurplus.desc.sv },
    { key: 'netProfitYearly', label: 'Årets resultat', desc: labels.terms.netProfit.desc.sv },
    { key: 'openingEquity', label: 'Ing. fritt EK', desc: labels.terms.equityOpening.desc.sv, highlight: 'yellow' },
    { key: 'maxDividendByEquity', label: 'Max utd. EK', desc: labels.terms.maxDividendByEquity.desc.sv, highlight: 'green' },
    { key: 'dividendAllowancePct', label: 'Utdeln. utrymme (%)', desc: labels.terms.dividendAllowancePct.desc.sv },
    { key: 'grossDividend', label: 'Utd. brutto', desc: labels.terms.grossDividend.desc.sv },
    { key: 'netDividend', label: 'Utd. netto', desc: labels.terms.netDividend.desc.sv },
    { key: 'totalNetMonthly', label: 'Totalt netto (mån)', desc: 'Total nettoinkomst per månad (lön + utdelning)', highlight: 'green' },
    { key: 'equivalentGrossSalaryMonthly', label: 'Motsv. bruttolön (mån)', desc: 'Vilken bruttolön som skulle ge samma netto', highlight: 'yellow' },
    { key: 'closingEquity', label: 'Utg. fritt EK', desc: labels.terms.equityClosing.desc.sv },
    { key: 'savedDividendAllowance', label: 'Sparat utd. utrymme', desc: labels.terms.savedDividendAllowance.desc.sv, highlight: 'green' },
  ];

  return (
    <div className="table-container">
      <table className="year-table">
        <thead>
          <tr>
            <th className="row-header">Metric</th>
            {years.map((_, idx) => (
              <th key={idx}>År {idx + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableFields.map((field) => (
            <tr key={field.key} className="editable-row">
              <td className="row-header" title={field.desc}>
                {field.label}
              </td>
              {years.map((year, idx) => (
                <td key={idx}>
                  <div className="input-with-suffix inline">
                    <input
                      type="number"
                      value={year[field.key] as number}
                      onChange={(e) =>
                        onUpdateYear(idx, field.key, parseFloat(e.target.value) || 0)
                      }
                      step={field.suffix === '%' ? '1' : '10'}
                      min="0"
                    />
                    <span className="suffix">{field.suffix}</span>
                  </div>
                </td>
              ))}
            </tr>
          ))}

          <tr className="separator-row">
            <td colSpan={years.length + 1}></td>
          </tr>

          {calculatedFields.map((field, fieldIdx) => (
            <tr key={`${field.key}-${fieldIdx}`} className={`calculated-row${field.highlight ? ` highlight-${field.highlight}` : ''}`}>
              <td className="row-header" title={field.desc}>
                {field.label}
              </td>
              {years.map((year, idx) => {
                const value = year[field.key] as number;
                const displayValue = field.divideBy12 ? value / 12 : value;
                return (
                  <td key={idx}>
                    {field.key === 'dividendAllowancePct'
                      ? `${formatNumber(displayValue, 1)} %`
                      : formatNumber(displayValue, 0)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
