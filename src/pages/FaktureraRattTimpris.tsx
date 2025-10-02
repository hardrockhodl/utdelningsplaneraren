import { useState } from 'react';
import { Calculator } from 'lucide-react';

interface HourlyRateInputs {
  desiredNetSalary: number;
  municipalTax: number;
  employerContribution: number;
  businessCosts: number;
  billableHours: number;
  bufferPercentage: number;
  savingsGoal: number;
}

interface HourlyRateResults {
  grossSalary: number;
  employerContributions: number;
  totalMonthlyCost: number;
  hourlyRate: number;
  hourlyRateWithVAT: number;
  annualGrossSalary: number;
  annualCost: number;
  annualRevenue: number;
}

const VAT_RATE = 1.25;
const SCENARIO_HOURS = [120, 140, 160, 180] as const;

export function FaktureraRattTimpris() {
  const [inputs, setInputs] = useState<HourlyRateInputs>({
    desiredNetSalary: 30000,
    municipalTax: 32,
    employerContribution: 31.42,
    businessCosts: 5000,
    billableHours: 140,
    bufferPercentage: 20,
    savingsGoal: 0,
  });

  const updateInput = (field: keyof HourlyRateInputs, value: number) => {
    setInputs({ ...inputs, [field]: value });
  };

  const calculateResults = (billableHours: number): HourlyRateResults => {
    const grossSalary = inputs.desiredNetSalary / (1 - inputs.municipalTax / 100);

    const employerContributions = grossSalary * (inputs.employerContribution / 100);

    const baseCost = grossSalary + employerContributions + inputs.businessCosts + inputs.savingsGoal;

    const totalMonthlyCost = baseCost * (1 + inputs.bufferPercentage / 100);

    const hourlyRate = totalMonthlyCost / billableHours;
    const hourlyRateWithVAT = hourlyRate * VAT_RATE;

    return {
      grossSalary,
      employerContributions,
      totalMonthlyCost,
      hourlyRate,
      hourlyRateWithVAT,
      annualGrossSalary: grossSalary * 12,
      annualCost: totalMonthlyCost * 12,
      annualRevenue: hourlyRate * billableHours * 12,
    };
  };

  const mainResults = calculateResults(inputs.billableHours);
  const hourlyRateScenario120 = calculateResults(120);
  const hourlyRateScenario140 = calculateResults(140);
  const hourlyRateScenario160 = calculateResults(160);
  const hourlyRateScenario180 = calculateResults(180);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Fakturera rätt timpris</h1>
            <p className="subtitle">
              Med vårt verktyg kan du enkelt räkna fram vilket timpris du behöver ta för dina tjänster.
              Ange din önskade lön, dina kostnader och hur många timmar du fakturerar per månad.
            </p>
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
              <label htmlFor="netSalary">Önskad nettolön per månad (kr)</label>
              <input
                id="netSalary"
                type="number"
                value={inputs.desiredNetSalary}
                onChange={(e) => updateInput('desiredNetSalary', Number(e.target.value))}
                step="1000"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="municipalTax">Kommunalskatt (%)</label>
              <input
                id="municipalTax"
                type="number"
                value={inputs.municipalTax}
                onChange={(e) => updateInput('municipalTax', Number(e.target.value))}
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="employerContribution">Arbetsgivaravgift (%)</label>
              <input
                id="employerContribution"
                type="number"
                value={inputs.employerContribution}
                onChange={(e) => updateInput('employerContribution', Number(e.target.value))}
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="businessCosts">Månadskostnader företag (kr)</label>
              <input
                id="businessCosts"
                type="number"
                value={inputs.businessCosts}
                onChange={(e) => updateInput('businessCosts', Number(e.target.value))}
                step="500"
              />
              <span className="setting-hint">Programvara, kontor, försäkringar, etc.</span>
            </div>

            <div className="setting-item">
              <label htmlFor="billableHours">Fakturerbara timmar per månad</label>
              <input
                id="billableHours"
                type="number"
                value={inputs.billableHours}
                onChange={(e) => updateInput('billableHours', Number(e.target.value))}
                step="10"
                min="1"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="buffer">Buffert/Marginal (%)</label>
              <input
                id="buffer"
                type="number"
                value={inputs.bufferPercentage}
                onChange={(e) => updateInput('bufferPercentage', Number(e.target.value))}
                step="5"
                min="0"
                max="100"
              />
              <span className="setting-hint">För risker, stillestånd, semester</span>
            </div>

            <div className="setting-item">
              <label htmlFor="savings">Sparmål/Vinstmarginal per månad (kr)</label>
              <input
                id="savings"
                type="number"
                value={inputs.savingsGoal}
                onChange={(e) => updateInput('savingsGoal', Number(e.target.value))}
                step="1000"
                min="0"
              />
              <span className="setting-hint">Valfritt: extra sparande eller vinst</span>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2>Resultat</h2>

          <div className="totals-grid">
            <div className="total-card highlight">
              <div className="card-content">
                <div className="card-label">Rekommenderat timpris</div>
                <div className="card-value">{mainResults.hourlyRate.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</div>
                <div className="card-sublabel">exkl. moms</div>
              </div>
            </div>

            <div className="total-card">
              <div className="card-content">
                <div className="card-label">Timpris inkl. moms</div>
                <div className="card-value">{mainResults.hourlyRateWithVAT.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</div>
                <div className="card-sublabel">25% moms</div>
              </div>
            </div>

            <div className="total-card">
              <div className="card-content">
                <div className="card-label">Total månadskostnad</div>
                <div className="card-value">{mainResults.totalMonthlyCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</div>
                <div className="card-sublabel">inkl. buffert</div>
              </div>
            </div>

            <div className="total-card">
              <div className="card-content">
                <div className="card-label">Årlig omsättning</div>
                <div className="card-value">{mainResults.annualRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</div>
                <div className="card-sublabel">baserat på {inputs.billableHours} tim/mån</div>
              </div>
            </div>
          </div>

          <h3 className="section-subtitle">Detaljerad uppdelning per månad</h3>
          <div className="table-container">
            <table className="year-table">
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      Önskad nettolön
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      {inputs.desiredNetSalary.toLocaleString('sv-SE')} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                      }}
                    >
                      Bruttolön (före skatt)
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {mainResults.grossSalary.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      Arbetsgivaravgift ({inputs.employerContribution}%)
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      {mainResults.employerContributions.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                      }}
                    >
                      Företagskostnader
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {inputs.businessCosts.toLocaleString('sv-SE')} kr
                    </td>
                  </tr>
                  {inputs.savingsGoal > 0 && (
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th
                        scope="row"
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontWeight: 500,
                          color: 'var(--text-secondary)',
                          textAlign: 'left',
                          backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                        }}
                      >
                        Sparmål/Vinstmarginal
                      </th>
                      <td
                        style={{
                          padding: '0.5rem 0.75rem',
                          textAlign: 'right',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                        }}
                      >
                        {inputs.savingsGoal.toLocaleString('sv-SE')} kr
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                        backgroundColor: inputs.savingsGoal > 0 ? 'transparent' : 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      Buffert ({inputs.bufferPercentage}%)
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                        backgroundColor: inputs.savingsGoal > 0 ? 'transparent' : 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      {(mainResults.totalMonthlyCost - (mainResults.grossSalary + mainResults.employerContributions + inputs.businessCosts + inputs.savingsGoal)).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', fontWeight: 600 }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        backgroundColor: inputs.savingsGoal > 0 ? 'var(--stripe-bg, rgba(0,0,0,0.02))' : 'transparent',
                      }}
                    >
                      Total månadskostnad
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        backgroundColor: inputs.savingsGoal > 0 ? 'var(--stripe-bg, rgba(0,0,0,0.02))' : 'transparent',
                      }}
                    >
                      {mainResults.totalMonthlyCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          <h3 className="section-subtitle">Jämförelse: Timpris vid olika fakturerbara timmar</h3>
          <div className="table-container">
            <table className="year-table">
                <thead>
                  <tr>
                    <th>Fakturerbara timmar/mån</th>
                    <th>Timpris (exkl. moms)</th>
                    <th>Timpris (inkl. moms)</th>
                    <th>Årsomsättning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { hours: 120, results: hourlyRateScenario120 },
                    { hours: 140, results: hourlyRateScenario140 },
                    { hours: 160, results: hourlyRateScenario160 },
                    { hours: 180, results: hourlyRateScenario180 },
                  ].map(({ hours, results }, idx) => {
                    const isCurrentScenario = hours === inputs.billableHours;
                    return (
                      <tr
                        key={hours}
                        style={{
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: isCurrentScenario
                            ? 'var(--row-highlight, rgba(15,146,233,0.08))'
                            : idx % 2 === 0
                            ? 'var(--stripe-bg, rgba(0,0,0,0.02))'
                            : 'transparent',
                          fontWeight: isCurrentScenario ? 600 : 400,
                        }}
                      >
                        <td
                          style={{
                            padding: '0.5rem 0.75rem',
                            color: isCurrentScenario ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderRight: '1px solid var(--border-color)',
                          }}
                        >
                          {hours} timmar{isCurrentScenario ? ' (ditt val)' : ''}
                        </td>
                        <td
                          style={{
                            padding: '0.5rem 0.75rem',
                            textAlign: 'right',
                            color: isCurrentScenario ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderRight: '1px solid var(--border-color)',
                          }}
                        >
                          {results.hourlyRate.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                        </td>
                        <td
                          style={{
                            padding: '0.5rem 0.75rem',
                            textAlign: 'right',
                            color: isCurrentScenario ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderRight: '1px solid var(--border-color)',
                          }}
                        >
                          {results.hourlyRateWithVAT.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                        </td>
                        <td
                          style={{
                            padding: '0.5rem 0.75rem',
                            textAlign: 'right',
                            color: isCurrentScenario ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}
                        >
                          {results.annualRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          <h3 className="section-subtitle">Årlig översikt</h3>
          <div className="table-container">
            <table className="year-table">
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      Årlig bruttolön
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      {mainResults.annualGrossSalary.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                      }}
                    >
                      Årlig total kostnad
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {mainResults.annualCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      Årlig omsättning
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      }}
                    >
                      {mainResults.annualRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textAlign: 'left',
                      }}
                    >
                      Total fakturerbara timmar per år
                    </th>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {(inputs.billableHours * 12).toLocaleString('sv-SE')} timmar
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </main>
    </div>
  );
}
