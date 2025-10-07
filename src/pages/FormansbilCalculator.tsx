import { useState, useEffect } from 'react';
import { Car, Calculator, Loader, Info } from 'lucide-react';
import { Kommune, Actor } from '../types';
import { fetchKommuner, findKommun } from '../lib/skatteverket';
import { fetchTaxTable, TaxTableEntry } from '../lib/taxTables';
import { calculateFormansbil, FormansbilInput, getBestDeductionModel, calculateAllScenarios } from '../lib/formansbilCalculations';
import { fetchAllCars, getYears, getBrandsForYear, getModelsForYearAndBrand, findCarRecord, calculateFormansvarde, CarRecord } from '../lib/cars';
import { AdSenseUnit } from '../components/AdSenseUnit';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';

export function FormansbilCalculator() {
  const pageTitle = 'Förmånsbilskalkylator';
  const pageDescription = 'Räkna ut nettoeffekten av en förmånsbil på din nettolön. Jämför bruttolöneavdrag och nettolöneavdrag för olika bilmodeller och se vilken som ger lägst kostnad.';
  const pageKeywords = 'förmånsbil kalkylator, förmånsvärde bil, bruttolöneavdrag bil, nettolöneavdrag bil, bilförmån beräkning, firmabil kostnad';
  const pageUrl = 'https://konsulthjalpen.se/formansbil';

  const [grossSalary, setGrossSalary] = useState<number>(53500);
  const [selectedKommun, setSelectedKommun] = useState<Kommune | null>(null);
  const [kommuner, setKommuner] = useState<Kommune[]>([]);
  const [loading, setLoading] = useState(false);
  const [kommunError, setKommunError] = useState<string | null>(null);
  const [taxTable, setTaxTable] = useState<TaxTableEntry[]>([]);
  const [churchMember, setChurchMember] = useState(false);

  // Car selection
  const [carRecords, setCarRecords] = useState<CarRecord[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [manualMode, setManualMode] = useState(true);

  // Förmån inputs
  const [formansvarde, setFormansvarde] = useState<number>(5000);
  const [nybilspris, setNybilspris] = useState<number>(600000);
  const [fordonsskatt, setFordonsskatt] = useState<number>(360);
  const [extrautrustning, setExtrautrustning] = useState<number>(0);
  const [milReducering, setMilReducering] = useState(false);
  const [businessLeasing, setBusinessLeasing] = useState<number>(6000);

  // Deduction model
  const [deductionModel, setDeductionModel] = useState<'brutto' | 'netto'>('netto');
  const [bruttoDeduction, setBruttoDeduction] = useState<number>(6000);
  const [nettoDeduction, setNettoDeduction] = useState<number>(6000);
  const [privatLeasing, setPrivatLeasing] = useState<number>(0);
  const [actor, setActor] = useState<Actor>('ab');

  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    loadKommuner();
  }, []);

  useEffect(() => {
    if (!selectedKommun) return;
    const rate = getTotalLocalTaxRate(selectedKommun, churchMember);
    const base = Math.round(rate);
    const tableId = churchMember ? `${base}B` : `${base}`;
    loadTaxTable(tableId);
  }, [selectedKommun, churchMember]);
  
  useEffect(() => {
  if (!manualMode && carRecords.length === 0) {
    loadCars();
  }
}, [manualMode]); 
  
  // Update förmånsvärde when manual inputs change
  useEffect(() => {
    if (manualMode) {
      const calculated = calculateFormansvarde({
        nybilspris,
        fordonsskatt,
        extrautrustning,
        milReducering
      });
      setFormansvarde(calculated);
    }
  }, [nybilspris, fordonsskatt, extrautrustning, milReducering, manualMode]);

  // Update from selected car
  useEffect(() => {
    if (!manualMode && selectedBrand && selectedModel && selectedYear) {
      const car = findCarRecord(carRecords, selectedBrand, selectedModel, selectedYear);
      if (car) {
        setNybilspris(car.nybilspris);
        setFordonsskatt(car.fordonsskatt);
        const calculated = calculateFormansvarde({
          nybilspris: car.nybilspris,
          fordonsskatt: car.fordonsskatt,
          extrautrustning,
          milReducering
        });
        setFormansvarde(calculated);
      }
    }
  }, [selectedYear, selectedBrand, selectedModel, extrautrustning, milReducering, manualMode, carRecords]);

  const getTotalLocalTaxRate = (k: Kommune, includeChurch: boolean) => {
    const municipalTax = Number(
      (k as any).Kommunskatt ??
      (k as any).Kommunalskatt ??
      (k as any).Kommnskatt ?? 0
    );
    const countyTax = Number(
      (k as any).Landstingsskatt ??
      (k as any).Regionskatt ?? 0
    );
    const churchTax = includeChurch ? Number(
      (k as any).Kyrkoskatt ??
      (k as any).Kyrkoavgift ?? 0
    ) : 0;
    return municipalTax + countyTax + churchTax;
  };

  const loadKommuner = async () => {
    setLoading(true);
    setKommunError(null);
    try {
      const data = await fetchKommuner();
      setKommuner(data);

      if (data.length === 0) {
        setKommunError('Kunde inte ladda kommundata. Försök igen.');
      } else {
        const stockholm = findKommun(data, 'Stockholm');
        if (stockholm) {
          setSelectedKommun(stockholm);
        }
      }
    } catch (error) {
      console.error('Failed to load kommuner:', error);
      setKommunError('Fel vid hämtning av kommundata. Kontrollera din internetanslutning och försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const loadTaxTable = async (tableId?: string) => {
    try {
      const currentYear = new Date().getFullYear();
      const requestedTable = tableId ?? '30';

      let table = await fetchTaxTable(currentYear, requestedTable);

      if (table.length === 0 && requestedTable.endsWith('B')) {
        const fallbackTable = requestedTable.slice(0, -1);
        table = await fetchTaxTable(currentYear, fallbackTable);
      }

      setTaxTable(table);
    } catch (error) {
      console.error('Failed to load tax table:', error);
    }
  };

  const loadCars = async () => {
    setLoadingCars(true);
    setCarsError(null);
    setCarRecords([]);
    try {
      const all: CarRecord[] = [];
      await fetchAllCars(500, (chunk) => {
        all.push(...chunk);
        setCarRecords(prev => [...prev, ...chunk]);
        if (all.length >= 200 && loadingCars) setLoadingCars(false);
      });
      setLoadingCars(false);
      if (all.length === 0) {
        setCarsError('Kunde inte ladda bildata från Skatteverket.');
      }
    } catch (error) {
      console.error('Failed to load cars:', error);
      setCarsError('Fel vid hämtning av bildata. Kontrollera din internetanslutning och försök igen.');
      setLoadingCars(false);
    }
  };

  const handleKommunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const kommunId = e.target.value;
    const kommun = kommuner.find((k) => k.KommunId === kommunId);
    if (kommun) {
      setSelectedKommun(kommun);
    }
  };

  const calculateResults = () => {
    if (!selectedKommun || taxTable.length === 0) {
      return null;
    }

    const municipalTax = getTotalLocalTaxRate(selectedKommun, churchMember);

    const input: FormansbilInput = {
      grossSalary,
      municipalTax,
      formansvarde,
      deductionModel,
      bruttoDeduction,
      nettoDeduction,
      privatLeasing,
      businessLeasing,
      employerContribution: 31.42
    };

    const result = calculateFormansbil(input, taxTable, 1);
    const bestModel = getBestDeductionModel(input, taxTable, 1);

    return { result, bestModel };
  };

  const results = calculateResults();

  const years = getYears(carRecords);
  const brands = selectedYear ? getBrandsForYear(carRecords, selectedYear) : [];
  const models = selectedYear && selectedBrand ? getModelsForYearAndBrand(carRecords, selectedYear, selectedBrand) : [];

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
            <h1>Förmånsbilskalkylator</h1>
            <p className="subtitle">Beräkna nettoeffekten av en förmånsbil på din nettolön</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {results && (
          <>
            <div className="results-section">
              <div className="totals-grid">
                <div className="total-card">
                  <div className="card-icon" style={{ backgroundColor: 'rgba(15, 146, 233, 0.15)' }}>
                    <Calculator size={24} style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Nettolön utan bil</div>
                    <div className="card-value">{results.result.netSalaryWithoutCar.toLocaleString('sv-SE')} kr</div>
                  </div>
                </div>

                <div className="total-card">
                  <div className="card-icon" style={{ backgroundColor: 'rgba(39, 180, 35, 0.15)' }}>
                    <Car size={24} style={{ color: 'var(--accent-green)' }} />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Nettolön med förmånsbil</div>
                    <div className="card-value">{results.result.netSalaryWithCar.toLocaleString('sv-SE')} kr</div>
                    {deductionModel === results.bestModel && (
                      <div className="card-sublabel" style={{ color: 'var(--accent-green)' }}>
                        Lägst nettokostnad
                      </div>
                    )}
                  </div>
                </div>

                <div className="total-card">
                  <div className="card-icon" style={{ backgroundColor: 'rgba(215, 38, 56, 0.15)' }}>
                    <Calculator size={24} style={{ color: 'var(--accent-red)' }} />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Nettolönsförändring</div>
                    <div className="card-value">
                      {results.result.monthlyDifference >= 0 ? '+' : ''}
                      {results.result.monthlyDifference.toLocaleString('sv-SE')} kr
                    </div>
                    <div className="card-sublabel">
                      {results.result.monthlyDifference >= 0 ? 'Högre nettolön' : 'Lägre nettolön'}
                    </div>
                  </div>
                </div>

                {privatLeasing > 0 && (
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(249, 220, 92, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'var(--accent-orange)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Jämfört med privat leasing</div>
                      <div className="card-value">
                        {results.result.comparedToPrivateLeasing >= 0 ? '+' : ''}
                        {results.result.comparedToPrivateLeasing.toLocaleString('sv-SE')} kr
                      </div>
                      <div className="card-sublabel">
                        {results.result.comparedToPrivateLeasing >= 0 ? 'Billigare' : 'Dyrare'}
                      </div>
                    </div>
                  </div>
                )}

                {actor !== 'anstalld' && businessLeasing > 0 && (
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(20, 184, 166, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'rgb(20, 184, 166)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Bolagets kostnad jämfört med businessleasing</div>
                      <div className="card-value">
                        {results.result.comparedToBusinessLeasing >= 0 ? '+' : ''}
                        {results.result.comparedToBusinessLeasing.toLocaleString('sv-SE')} kr
                      </div>
                      <div className="card-sublabel">
                        {results.result.comparedToBusinessLeasing >= 0 ? 'Förmånsbil dyrare' : 'Förmånsbil billigare'}
                      </div>
                    </div>
                  </div>
                )}

                {actor !== 'anstalld' && (
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(100, 116, 139, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'rgb(100, 116, 139)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Bolagets TCO (med bil)</div>
                      <div className="card-value">{results.result.tcoWithCar.toLocaleString('sv-SE')} kr</div>
                      <div className="card-sublabel">
                        Diff mot utan bil: {results.result.tcoDelta >= 0 ? '+' : ''}
                        {results.result.tcoDelta.toLocaleString('sv-SE')} kr
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          <div className="settings-panel">
            <div className="panel-header">
              <Calculator size={20} />
              <h2>Grundinställningar</h2>
            </div>

            <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="setting-item">
                <label className="setting-label">Bruttolön per månad</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    step="1000"
                  />
                  <span className="suffix">kr</span>
                </div>
              </div>

              <div className="setting-item">
                <label className="setting-label">Kommun</label>
                {loading ? (
                  <div className="loading-container">
                    <Loader size={16} className="spinner" />
                    <span>Laddar kommuner...</span>
                  </div>
                ) : kommunError ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--accent-red)', fontSize: '0.875rem' }}>
                      {kommunError}
                    </div>
                    <button
                      onClick={loadKommuner}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Försök igen
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedKommun?.KommunId || ''}
                    onChange={handleKommunChange}
                    disabled={kommuner.length === 0}
                  >
                    <option value="">Välj kommun</option>
                    {kommuner.map((kommun) => (
                      <option key={kommun.KommunId} value={kommun.KommunId}>
                        {kommun.Kommun}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={churchMember}
                    onChange={(e) => setChurchMember(e.target.checked)}
                  />
                  Medlem i svenska kyrkan
                </label>
              </div>

              <div className="setting-item">
                <label className="setting-label">Vem är du?</label>
                <select
                  value={actor}
                  onChange={(e) => setActor(e.target.value as Actor)}
                >
                  <option value="ab">Egenföretagare (AB)</option>
                  <option value="enskild">Enskild firma</option>
                  <option value="anstalld">Anställd</option>
                </select>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)'
                }}>
                  {actor === 'anstalld' && (
                    <p>Businessleasing hanteras av arbetsgivaren. Din privata ekonomi påverkas främst via förmånsvärdet (och ev. netto/bruttolöneavdrag). Jämförelse mot businessleasing visas därför inte här.</p>
                  )}
                  {actor === 'ab' && (
                    <p>Du är arbetsgivaren. Businessleasing är en faktisk kostnad i bolaget och ingår i TCO (Total Cost of Ownership). Nettolönen påverkas indirekt via hur mycket lön/utdelning du kan ta ut.</p>
                  )}
                  {actor === 'enskild' && (
                    <p>Bilen ligger i rörelsen. Leasing och drift är företagskostnader som sänker resultatet. Här visar vi TCO och hur det indirekt påverkar din privata ekonomi.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="settings-panel">
            <div className="panel-header">
              <Car size={20} />
              <h2>Bilinformation</h2>
            </div>

            <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={manualMode}
                    onChange={(e) => {
                      setManualMode(e.target.checked);
                      if (!e.target.checked) {
                        setSelectedBrand('');
                        setSelectedModel('');
                        setSelectedYear(0);
                      }
                    }}
                  />
                  Ange värden manuellt
                </label>
              </div>

              {!manualMode && (
                <>
                  <div className="setting-item">
                    <label className="setting-label">Tillverkningsår</label>
                    {loadingCars ? (
                      <div className="loading-container">
                        <Loader size={16} className="spinner" />
                        <span>Laddar bilar... ({carRecords.length} hittade)</span>
                      </div>
                    ) : carsError ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ color: 'var(--accent-red)', fontSize: '0.875rem' }}>
                          {carsError}
                        </div>
                        <button
                          onClick={loadCars}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--accent-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Försök igen
                        </button>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Tips: Aktivera "Ange värden manuellt" för att fortsätta utan bildata
                        </div>
                      </div>
                    ) : years.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Inga bilar laddade. Klicka för att ladda bildata.
                        </div>
                        <button
                          onClick={loadCars}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--accent-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Ladda bildata
                        </button>
                      </div>
                    ) : (
                      <select
                        value={selectedYear}
                        onChange={(e) => {
                          setSelectedYear(Number(e.target.value));
                          setSelectedBrand('');
                          setSelectedModel('');
                        }}
                      >
                        <option value={0}>Välj år</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedYear > 0 && (
                    <div className="setting-item">
                      <label className="setting-label">Märke</label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => {
                          setSelectedBrand(e.target.value);
                          setSelectedModel('');
                        }}
                      >
                        <option value="">Välj märke</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedYear > 0 && selectedBrand && (
                    <div className="setting-item">
                      <label className="setting-label">Modell</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => {
                          setSelectedModel(e.target.value);
                        }}
                      >
                        <option value="">Välj modell</option>
                        {models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {manualMode && (
                <>
                  <div className="setting-item">
                    <label className="setting-label">Nybilspris (exkl. moms)</label>
                    <div className="input-with-suffix">
                      <input
                        type="number"
                        value={nybilspris}
                        onChange={(e) => setNybilspris(Number(e.target.value))}
                        min="0"
                        step="10000"
                      />
                      <span className="suffix">kr</span>
                    </div>
                  </div>

                  <div className="setting-item">
                    <label className="setting-label">Fordonsskatt per år</label>
                    <div className="input-with-suffix">
                      <input
                        type="number"
                        value={fordonsskatt}
                        onChange={(e) => setFordonsskatt(Number(e.target.value))}
                        min="0"
                        step="100"
                      />
                      <span className="suffix">kr</span>
                    </div>
                  </div>
                </>
              )}

              <div className="setting-item">
                <label className="setting-label">Extrautrustning</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    value={extrautrustning}
                    onChange={(e) => setExtrautrustning(Number(e.target.value))}
                    min="0"
                    step="5000"
                  />
                  <span className="suffix">kr</span>
                </div>
              </div>

              {actor !== 'anstalld' && (
                <div className="setting-item">
                  <label className="setting-label">
                    Businessleasing per månad
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 'normal'
                    }}>
                      (Bolagets månadskostnad)
                    </span>
                  </label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      value={businessLeasing}
                      onChange={(e) => setBusinessLeasing(Number(e.target.value))}
                      min="0"
                      step="1000"
                    />
                    <span className="suffix">kr</span>
                  </div>
                </div>
              )}

              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={milReducering}
                    onChange={(e) => setMilReducering(e.target.checked)}
                  />
                  Minst 3 000 mil i tjänsten (25% reducering)
                </label>
              </div>

              <div className="setting-item">
                <label className="setting-label">Beräknat förmånsvärde per månad</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    value={formansvarde}
                    onChange={(e) => setFormansvarde(Number(e.target.value))}
                    min="0"
                    step="100"
                  />
                  <span className="suffix">kr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-panel">
          <div className="panel-header">
            <Calculator size={20} />
            <h2>Avdragsmodell</h2>
          </div>

          <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="setting-item">
              <label className="setting-label">
                Välj avdragsmodell
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  style={{
                    marginLeft: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--accent-blue)',
                    padding: 0
                  }}
                >
                  <Info size={16} />
                </button>
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="deductionModel"
                    checked={deductionModel === 'netto'}
                    onChange={() => setDeductionModel('netto')}
                  />
                  Nettolöneavdrag (privat betalning efter skatt)
                </label>

                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="deductionModel"
                    checked={deductionModel === 'brutto'}
                    onChange={() => setDeductionModel('brutto')}
                  />
                  Bruttolöneavdrag (reducerad bruttolön)
                </label>
              </div>

              {showInfo && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Nettolöneavdrag:</strong> Du betalar en del privat (efter skatt).
                    Detta minskar beskattningsbar förmån krona-för-krona upp till förmånsvärdet.
                    Ofta skatteeffektivt om man vill neutralisera förmånsvärdet.
                  </p>
                  <p>
                    <strong>Bruttolöneavdrag:</strong> Sänker bruttolön med ett belopp.
                    Förmånsvärdet kvarstår. Ger lägre skatt men påverkar pensionsunderlag och 3:12-löneunderlag.
                  </p>
                </div>
              )}
            </div>

            {deductionModel === 'brutto' && (
              <div className="setting-item">
                <label className="setting-label">Bruttolöneavdrag per månad</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    value={bruttoDeduction}
                    onChange={(e) => setBruttoDeduction(Number(e.target.value))}
                    min="0"
                    step="500"
                  />
                  <span className="suffix">kr</span>
                </div>
              </div>
            )}

            {deductionModel === 'netto' && (
              <div className="setting-item">
                <label className="setting-label">Nettolöneavdrag per månad</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    value={nettoDeduction}
                    onChange={(e) => setNettoDeduction(Number(e.target.value))}
                    min="0"
                    step="500"
                  />
                  <span className="suffix">kr</span>
                </div>
              </div>
            )}

            <div className="setting-item">
              <label className="setting-label">Privat leasing per månad (för jämförelse)</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={privatLeasing}
                  onChange={(e) => setPrivatLeasing(Number(e.target.value))}
                  min="0"
                  step="500"
                />
                <span className="suffix">kr</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <AdSenseUnit
            adSlot="1234567899"
            style={{ display: 'block', textAlign: 'center' }}
          />
        </div>

            <div className="results-section">
              <h2 className="section-title">Detaljerad uppdelning</h2>
              <div className="settings-panel">
                <div className="calculation-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-label">Bruttolön {deductionModel === 'brutto' ? '(efter avdrag)' : ''}</div>
                    <div className="breakdown-value">{results.result.adjustedGrossSalary.toLocaleString('sv-SE')} kr</div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-label">Skatt på lön</div>
                    <div className="breakdown-value">{results.result.taxWithCar.toLocaleString('sv-SE')} kr</div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-label">Beskattningsbar förmån</div>
                    <div className="breakdown-value">{results.result.taxableForman.toLocaleString('sv-SE')} kr</div>
                  </div>

                  {deductionModel === 'netto' && results.result.privatePayment > 0 && (
                    <div className="breakdown-item">
                      <div className="breakdown-label">Privat betalning (efter skatt)</div>
                      <div className="breakdown-value">{results.result.privatePayment.toLocaleString('sv-SE')} kr</div>
                    </div>
                  )}

                  <div className="breakdown-separator"></div>

                  <div className="breakdown-item">
                    <div className="breakdown-label">Arbetsgivaravgift på förmån (31.42%)</div>
                    <div className="breakdown-value">{results.result.employerCostForman.toLocaleString('sv-SE')} kr</div>
                  </div>

                  <div className="breakdown-item total">
                    <div className="breakdown-label">Total kostnad för bolaget</div>
                    <div className="breakdown-value">
                      {results.result.employerCostTotal.toLocaleString('sv-SE')} kr
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="results-section">
              <h2 className="section-title">Information om förmånsbil</h2>
              <div className="settings-panel" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>Vad påverkar förmånsvärdet?</strong>
                </p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Nybilspriset (exkl. moms) + värde av extrautrustning</li>
                  <li>Fordonsskatt per år</li>
                  <li>Bilens miljöklass och CO2-utsläpp</li>
                  <li>Om du kör minst 3 000 mil i tjänsten under året (25% reducering av förmånsvärdet)</li>
                </ul>

                <p style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(249, 220, 92, 0.1)', borderLeft: '3px solid var(--accent-orange)', fontSize: '0.875rem' }}>
                  <strong>Obs!</strong> Förmånsvärdet här är förenklat. För exakt värde – använd Skatteverkets beräkning eller din lönespec och mata in beloppet manuellt.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>När uppstår bilförmån?</strong>
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Bilförmån uppstår när du har tillgång till en bil som ägs eller leasas av arbetsgivaren
                  och du får använda den privat. Du måste föra körjournal för att visa tjänsteresor om
                  du vill undvika förmånsbeskattning eller få reducering.
                </p>

                <p style={{ marginBottom: '1rem' }}>
                  <strong>Hur upphör bilförmånen?</strong>
                </p>
                <p>
                  Förmånen upphör när bilen avställs för en hel kalendermånad eller när du inte längre
                  har tillgång till den för privat bruk.
                </p>
              </div>
            </div>

            <div className="results-section">
              <h2 className="section-title">Jämförelse av alternativ</h2>
              <div className="settings-panel">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}>
                  {(() => {
                    const scenarios = calculateAllScenarios(
                      {
                        grossSalary,
                        municipalTax: getTotalLocalTaxRate(selectedKommun!, churchMember),
                        formansvarde,
                        deductionModel,
                        bruttoDeduction,
                        nettoDeduction,
                        privatLeasing,
                        businessLeasing,
                        employerContribution: 31.42
                      },
                      taxTable,
                      1,
                      nybilspris,
                      fordonsskatt
                    );

                    const validScenarios = scenarios.filter(s => s.monthlyCost !== null);
                    const bestScenario = validScenarios.length > 0
                      ? validScenarios.reduce((best, current) =>
                          current.netSalaryImpact > best.netSalaryImpact ? current : best
                        )
                      : scenarios.reduce((best, current) =>
                          current.netSalaryImpact > best.netSalaryImpact ? current : best
                        );

                    return scenarios.map((scenario) => (
                      <div
                        key={scenario.scenario}
                        style={{
                          padding: '1.25rem',
                          background: scenario.scenario === bestScenario.scenario
                            ? 'rgba(39, 180, 35, 0.08)'
                            : 'var(--card-bg)',
                          border: scenario.scenario === bestScenario.scenario
                            ? '2px solid var(--accent-green)'
                            : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          position: 'relative'
                        }}
                      >
                        {scenario.scenario === bestScenario.scenario && (
                          <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '10px',
                            background: 'var(--accent-green)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            Bäst
                          </div>
                        )}

                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                          color: 'var(--text-primary)'
                        }}>
                          {scenario.scenario}
                        </div>

                        <div style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          marginBottom: '1rem'
                        }}>
                          {scenario.description}
                        </div>

                        <div style={{
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                          color: 'var(--text-secondary)'
                        }}>
                          Månadskostnad:
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: 'var(--accent-blue)',
                          marginBottom: '1rem'
                        }}>
                          {scenario.monthlyCost !== null
                            ? `${scenario.monthlyCost.toLocaleString('sv-SE')} kr`
                            : '-'
                          }
                        </div>

                        <div style={{
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--border-color)',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)'
                        }}>
                          Nettolön kvar: <strong style={{ color: 'var(--text-primary)' }}>
                            {scenario.netSalaryImpact.toLocaleString('sv-SE')} kr
                          </strong>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
    </>
  );
}
