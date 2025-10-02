import { useState, useEffect } from 'react';
import { GlobalSettings, YearInput, YearCalculation } from '../types';
import { calculateAllYears } from '../lib/calculations';
import { labels } from '../lib/labels';
import { SettingsPanel } from '../components/SettingsPanel';
import { YearTable } from '../components/YearTable';
import { TotalsCards } from '../components/TotalsCards';
import { DebugView } from '../components/DebugView';

export function Utdelningsplaneraren() {
  const [settings, setSettings] = useState<GlobalSettings>({
    kommun: null,
    municipalTax: 32.0,
    churchMember: false,
    churchTax: 1.0,
    marginalTaxRate: 50.0,
    employerContribution: 31.42,
    regionalSupport: false,
    ibb: 80600,
    corporateTax: 20.6,
    shareAcquisitionValue: 25000,
    openingFreeEquity: 0,
    numberOfYears: 3,
  });

  const [yearInputs, setYearInputs] = useState<YearInput[]>([
    {
      hourlyRate: 750,
      hoursPerMonth: 133,
      grossSalaryMonthly: 50000,
      otherCostsMonthly: 15000,
      bufferPercent: 10,
      dividendPercent: 5,
    },
    {
      hourlyRate: 800,
      hoursPerMonth: 133,
      grossSalaryMonthly: 50000,
      otherCostsMonthly: 15000,
      bufferPercent: 10,
      dividendPercent: 10,
    },
    {
      hourlyRate: 850,
      hoursPerMonth: 133,
      grossSalaryMonthly: 50000,
      otherCostsMonthly: 15000,
      bufferPercent: 10,
      dividendPercent: 15,
    },
  ]);

  const [calculations, setCalculations] = useState<YearCalculation[]>([]);

  useEffect(() => {
    const numberOfYears = settings.numberOfYears;
    if (yearInputs.length > numberOfYears) {
      setYearInputs(yearInputs.slice(0, numberOfYears));
    } else if (yearInputs.length < numberOfYears) {
      const lastInput = yearInputs[yearInputs.length - 1] || {
        hourlyRate: 750,
        hoursPerMonth: 133,
        grossSalaryMonthly: 50000,
        otherCostsMonthly: 15000,
        bufferPercent: 10,
        dividendPercent: 20,
      };
      const newInputs = [...yearInputs];
      while (newInputs.length < numberOfYears) {
        newInputs.push({ ...lastInput });
      }
      setYearInputs(newInputs);
    }
  }, [settings.numberOfYears]);

  useEffect(() => {
    const results = calculateAllYears(yearInputs, settings);
    setCalculations(results);
  }, [yearInputs, settings]);

  const handleUpdateYear = (
    yearIndex: number,
    field: keyof YearCalculation,
    value: number
  ) => {
    const newInputs = [...yearInputs];
    newInputs[yearIndex] = { ...newInputs[yearIndex], [field]: value };
    setYearInputs(newInputs);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>{labels.site.title.sv}</h1>
            <p className="subtitle">{labels.site.subtitle.sv}</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <SettingsPanel settings={settings} onChange={setSettings} />

        <div className="results-section">
          <h2 className="section-title">Översikt</h2>
          <YearTable years={calculations} onUpdateYear={handleUpdateYear} />
        </div>

        <div className="results-section">
          <h2 className="section-title">Sammanfattning</h2>
          <TotalsCards years={calculations} />
        </div>

        <DebugView settings={settings} years={calculations} />
      </main>
    </div>
  );
}
