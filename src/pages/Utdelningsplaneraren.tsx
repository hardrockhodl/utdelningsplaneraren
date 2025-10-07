import { useState, useEffect } from 'react';
import { GlobalSettings, YearInput, YearCalculation } from '../types';
import { calculateAllYears } from '../lib/calculations';
import { labels } from '../lib/labels';
import { SettingsPanel } from '../components/SettingsPanel';
import { YearTable } from '../components/YearTable';
import { TotalsCards } from '../components/TotalsCards';
import { DebugView } from '../components/DebugView';
import { AdSenseUnit } from '../components/AdSenseUnit';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';

export function Utdelningsplaneraren() {
  const pageTitle = 'Utdelningsplaneraren';
  const pageDescription = 'Planera din lön, skatt och utdelning som konsult. Optimera din ekonomi över flera år med hänsyn till 3:12-reglerna och maximera din nettoinkomst.';
  const pageKeywords = 'utdelningsplaneraren, 3:12 regler, utdelning konsult, lön och utdelning, fåmansföretag utdelning, beskattning utdelning, skatt på utdelning';
  const pageUrl = 'https://konsulthjalpen.se/utdelningsplaneraren';

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
      grossSalaryMonthly: 53600,
      otherCostsMonthly: 5000,
      bufferPercent: 10,
      dividendPercent: 0,
    },
    {
      hourlyRate: 800,
      hoursPerMonth: 133,
      grossSalaryMonthly: 55700,
      otherCostsMonthly: 5000,
      bufferPercent: 10,
      dividendPercent: 10,
    },
    {
      hourlyRate: 850,
      hoursPerMonth: 133,
      grossSalaryMonthly: 57900,
      otherCostsMonthly: 5000,
      bufferPercent: 10,
      dividendPercent: 20,
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
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={pageUrl}
        ogUrl={pageUrl}
      />
      <StructuredData
        type="tool"
        toolName={pageTitle}
        toolDescription={pageDescription}
        toolUrl={pageUrl}
      />
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

        <div style={{ margin: '20px 0' }}>
          <AdSenseUnit
            adSlot="1234567892"
            style={{ display: 'block', textAlign: 'center' }}
          />
        </div>

        <div className="results-section">
          <h2 className="section-title">Översikt</h2>
          <YearTable years={calculations} onUpdateYear={handleUpdateYear} />
        </div>

        <div className="results-section">
          <h2 className="section-title">Sammanfattning</h2>
          <TotalsCards years={calculations} />
        </div>

        <div style={{ margin: '20px 0' }}>
          <AdSenseUnit
            adSlot="1234567893"
            style={{ display: 'block', textAlign: 'center' }}
          />
        </div>

        <DebugView settings={settings} years={calculations} />
      </main>
    </div>
    </>
  );
}
