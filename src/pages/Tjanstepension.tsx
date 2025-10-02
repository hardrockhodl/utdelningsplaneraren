import { useState } from 'react';
import { PiggyBank, Calculator } from 'lucide-react';

const IBB_VALUES: Record<number, number> = {
  2025: 81700,
  2024: 80600,
  2023: 76100,
  2022: 71800,
  2021: 68200,
};

export function Tjanstepension() {
  const currentYear = new Date().getFullYear();
  const [monthlySalary, setMonthlySalary] = useState<number>(50000);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [ibb, setIbb] = useState<number>(IBB_VALUES[currentYear] || 81700);
  const [lowerRate, setLowerRate] = useState<number>(4.5);
  const [higherRate, setHigherRate] = useState<number>(30);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setIbb(IBB_VALUES[year] || IBB_VALUES[currentYear]);
  };

  const calculatePension = () => {
    const ibbThreshold = ibb * 7.5 / 12;
    const salaryUpToThreshold = Math.min(monthlySalary, ibbThreshold);
    const salaryAboveThreshold = Math.max(0, monthlySalary - ibbThreshold);

    const lowerPart = (salaryUpToThreshold * lowerRate) / 100;
    const higherPart = (salaryAboveThreshold * higherRate) / 100;
    const totalMonthly = lowerPart + higherPart;
    const totalYearly = totalMonthly * 12;

    return {
      ibbThreshold,
      salaryUpToThreshold,
      salaryAboveThreshold,
      lowerPart,
      higherPart,
      totalMonthly,
      totalYearly,
      percentageOfSalary: monthlySalary > 0 ? (totalMonthly / monthlySalary) * 100 : 0,
    };
  };

  const result = calculatePension();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Räkna ut din tjänstepension</h1>
            <p className="subtitle">Beräkna din tjänstepension enligt ITP-1 reglerna</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="settings-panel">
          <div className="panel-header">
            <Calculator size={20} />
            <h2>Inställningar</h2>
          </div>

          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label" title="Din månadslön före skatt">
                Månadslön (brutto)
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  min="0"
                  step="1000"
                />
                <span className="suffix">kr</span>
              </div>
            </div>

            <div className="setting-item">
              <label className="setting-label" title="Välj år för IBB-värde">
                År
              </label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                {Object.keys(IBB_VALUES)
                  .map(Number)
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label" title="Inkomstbasbelopp för valt år">
                Inkomstbasbelopp (IBB)
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={ibb}
                  onChange={(e) => setIbb(Number(e.target.value))}
                  min="0"
                  step="100"
                />
                <span className="suffix">kr</span>
              </div>
            </div>

            <div className="setting-item">
              <label className="setting-label" title="Premie på lön upp till 7,5 IBB">
                Premie på lön upp till 7,5 IBB ({((ibb * 7.5) / 12).toLocaleString('sv-SE')} kr/mån)
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={lowerRate}
                  onChange={(e) => setLowerRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="suffix">%</span>
              </div>
            </div>

            <div className="setting-item">
              <label className="setting-label" title="Premie på lön över 7,5 IBB">
                Premie på lön över 7,5 IBB ({((ibb * 7.5) / 12).toLocaleString('sv-SE')} kr/mån)
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={higherRate}
                  onChange={(e) => setHigherRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="suffix">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2 className="section-title">Beräkning</h2>
          <div className="settings-panel">
            <div className="calculation-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-label">Tröskel (7,5 × IBB)</div>
                <div className="breakdown-value">{result.ibbThreshold.toLocaleString('sv-SE')} kr/mån</div>
              </div>

              <div className="breakdown-separator"></div>

              <div className="breakdown-item">
                <div className="breakdown-label">Lön upp till tröskel</div>
                <div className="breakdown-value">{result.salaryUpToThreshold.toLocaleString('sv-SE')} kr</div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-label">× Premie ({lowerRate}%)</div>
                <div className="breakdown-value highlight-green">
                  = {result.lowerPart.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                </div>
              </div>

              {result.salaryAboveThreshold > 0 && (
                <>
                  <div className="breakdown-separator"></div>

                  <div className="breakdown-item">
                    <div className="breakdown-label">Lön över tröskel</div>
                    <div className="breakdown-value">{result.salaryAboveThreshold.toLocaleString('sv-SE')} kr</div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-label">× Premie ({higherRate}%)</div>
                    <div className="breakdown-value highlight-green">
                      = {result.higherPart.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </div>
                  </div>
                </>
              )}

              <div className="breakdown-separator"></div>

              <div className="breakdown-item total">
                <div className="breakdown-label">Total tjänstepension per månad</div>
                <div className="breakdown-value">
                  {result.totalMonthly.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2 className="section-title">Resultat</h2>
          <div className="totals-grid">
            <div className="total-card">
              <div className="card-icon" style={{ backgroundColor: 'rgba(15, 146, 233, 0.15)' }}>
                <PiggyBank size={24} style={{ color: 'var(--accent-blue)' }} />
              </div>
              <div className="card-content">
                <div className="card-label">Tjänstepension per månad</div>
                <div className="card-value">
                  {result.totalMonthly.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                </div>
              </div>
            </div>

            <div className="total-card">
              <div className="card-icon" style={{ backgroundColor: 'rgba(39, 180, 35, 0.15)' }}>
                <PiggyBank size={24} style={{ color: 'var(--accent-green)' }} />
              </div>
              <div className="card-content">
                <div className="card-label">Tjänstepension per år</div>
                <div className="card-value">
                  {result.totalYearly.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                </div>
              </div>
            </div>

            <div className="total-card">
              <div className="card-icon" style={{ backgroundColor: 'rgba(249, 220, 92, 0.15)' }}>
                <Calculator size={24} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <div className="card-content">
                <div className="card-label">Andel av lön</div>
                <div className="card-value">{result.percentageOfSalary.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2 className="section-title">Information om ITP-1</h2>
          <div className="settings-panel">
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.1', marginBottom: '0.5rem' }}>
              <strong>ITP-1</strong> är tjänstepensionsplanen för privatanställda tjänstemän födda 1979 eller senare.
              Premien betalas av arbetsgivaren och är en procentsats av din bruttolön.
            </p>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.1', fontSize: '0.75rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Standardregler:</strong>
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.75rem' }}>
                <li style={{ marginBottom: '0.45rem' }}>
                  <strong>4,5%</strong> på lön upp till 7,5 inkomstbasbelopp (IBB)
                </li>
                <li style={{ marginBottom: '0.45rem' }}>
                  <strong>30%</strong> på lön över 7,5 IBB
                </li>
              </ul>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Inkomstbasbelopp (IBB):</strong>
              </p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {Object.entries(IBB_VALUES)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, value]) => (
                    <li key={year} style={{ marginBottom: '0.45rem' }}>
                      {year}: {value.toLocaleString('sv-SE')} kr 
                      (tröskel: {((value * 7.5) / 12).toLocaleString('sv-SE')} kr/mån, {(value * 7.5).toLocaleString('sv-SE')} kr/år)
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
