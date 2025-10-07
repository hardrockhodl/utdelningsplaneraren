import { useState, useEffect } from 'react';
import { Calculator, Loader } from 'lucide-react';
import { Kommune } from '../types';
import { fetchKommuner, findKommun } from '../lib/skatteverket';
import { fetchTaxTable, calculateTaxDeduction, TaxTableEntry, TAX_COLUMNS } from '../lib/taxTables';
import { AdSenseUnit } from '../components/AdSenseUnit';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';

export function LonEfterSkatt() {
  const pageTitle = 'Lön efter skatt';
  const pageDescription = 'Beräkna din nettolön efter skatt baserat på bruttolön och kommun. Använder Skatteverkets officiella skattetabeller för exakta beräkningar av månadslön.';
  const pageKeywords = 'lön efter skatt, nettolön kalkylator, bruttolön till nettolön, skattetabell, löneberäkning, skatteavdrag, kommunalskatt, Sverige';
  const pageUrl = 'https://konsulthjalpen.se/lon-efter-skatt';

  const [grossSalary, setGrossSalary] = useState<number>(35000);
  const [selectedKommun, setSelectedKommun] = useState<Kommune | null>(null);
  const [kommuner, setKommuner] = useState<Kommune[]>([]);
  const [loading, setLoading] = useState(false);
  const [taxTable, setTaxTable] = useState<TaxTableEntry[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('1');
  const [churchMember, setChurchMember] = useState(false);
  const [showInkomstInfo, setShowInkomstInfo] = useState<boolean>(false);

  useEffect(() => {
    loadKommuner();
    loadTaxTable(); // initial fallback
  }, []);

  // --- Helpers ---
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
    return municipalTax + countyTax + churchTax; // t.ex. 29.82
  };

  const loadKommuner = async () => {
    setLoading(true);
    try {
      const data = await fetchKommuner();
      setKommuner(data);

      const stockholm = findKommun(data, 'Stockholm');
      if (stockholm) {
        setSelectedKommun(stockholm);
      }
    } catch (error) {
      console.error('Failed to load kommuner:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTaxTable = async (tableId?: string) => {
  try {
    const currentYear = new Date().getFullYear();
    const requestedTable = tableId ?? '30';
    
    // Try to fetch the requested table
    let table = await fetchTaxTable(currentYear, requestedTable);
    
    // If we got 0 results and this was a "B" table, try without the B
    if (table.length === 0 && requestedTable.endsWith('B')) {
      const fallbackTable = requestedTable.slice(0, -1); // Remove the "B"
      console.log(`Table ${requestedTable} not found, trying ${fallbackTable} instead`);
      table = await fetchTaxTable(currentYear, fallbackTable);
    }
    
    setTaxTable(table);
  } catch (error) {
    console.error('Failed to load tax table:', error);
  }
};

  // Ladda rätt skattetabell när kommun/kyrka ändras
  useEffect(() => {
    if (!selectedKommun) return;
    const rate = getTotalLocalTaxRate(selectedKommun, churchMember); // t.ex. 29.82
    const base = Math.round(rate);                                   // -> 30
    const tableId = churchMember ? `${base}B` : `${base}`;           // 30 eller 30B
    loadTaxTable(tableId);
  }, [selectedKommun, churchMember]);

  const handleKommunChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const kommunId = e.target.value;
    const kommun = kommuner.find((k) => k.KommunId === kommunId);
    if (kommun) {
      setSelectedKommun(kommun);
    }
  };

  const calculateNetSalary = () => {
    if (!selectedKommun || taxTable.length === 0) {
      return null;
    }

    const salary = Math.max(0, Math.round(grossSalary));
    const td = calculateTaxDeduction(salary, taxTable, Number(selectedColumn));
    const taxDeduction = Number.isFinite(td) ? td : 0;
    const netSalary = Math.max(0, salary - taxDeduction);
    const taxRate = salary > 0 ? (taxDeduction / salary) * 100 : 0;

    const municipalTax = Number(
      (selectedKommun as any).Kommunskatt ??
      (selectedKommun as any).Kommunalskatt ??
      (selectedKommun as any).Kommnskatt ?? 0
    );
    const countyTax = Number(
      (selectedKommun as any).Landstingsskatt ??
      (selectedKommun as any).Regionskatt ?? 0
    );
    const churchTax = churchMember ? Number(
      (selectedKommun as any).Kyrkoskatt ??
      (selectedKommun as any).Kyrkoavgift ?? 0
    ) : 0;
    const totalTaxRate = municipalTax + countyTax + churchTax;

    return {
      grossSalary: salary,
      taxDeduction,
      netSalary,
      taxRate,
      municipalTax,
      countyTax,
      churchTax,
      totalTaxRate,
    };
  };

  const result = calculateNetSalary();

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
            <h1>Lön efter skatt</h1>
            <p className="subtitle">Beräkna din nettolön baserat på aktuella skattetabeller</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          <div className="settings-panel">
            <div className="panel-header">
              <Calculator size={20} />
              <h2>Inställningar</h2>
            </div>

            {/* --- SETTINGS GRID SOM RAD --- */}
            <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Bruttolön */}
              <div className="setting-item">
                <label className="setting-label" title="Din månadslön före skatt">
                  Bruttolön per månad
                </label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    min="0"
                    step="1000"
                  />
                  <span className="suffix">kr</span>
                </div>
              </div>

              {/* Inkomsttyp */}
              <div className="setting-item">
                <label className="setting-label" title="Välj typ av inkomst för korrekt skattetabell">
                  Inkomsttyp
                </label>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  style={{ minWidth: 100 }}
                >
                  {Object.entries(TAX_COLUMNS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowInkomstInfo(!showInkomstInfo)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    padding: '0.5rem 0',
                    marginTop: '0.25rem',
                  }}
                >
                  <span>{showInkomstInfo ? '▼' : '▶'}</span>
                  mer information
                </button>
                {showInkomstInfo && (
                  <div
                    style={{
                      marginTop: '6px',
                      background: '#FFF9C4',
                      border: '2px solid #FFEB3B',
                      borderRadius: 4,
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      color: 'var(--text-muted)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {TAX_COLUMNS[selectedColumn].description}
                  </div>
                )}
              </div>

              {/* Kommun */}
              <div className="setting-item">
                <label className="setting-label" title="Välj din kommun för att få rätt skattesatser">
                  Kommun
                </label>
                {loading ? (
                  <div className="loading-container">
                    <Loader size={16} className="spinner" />
                    <span>Laddar kommuner...</span>
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

              {/* Kyrkoskatt */}
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
            </div>
          </div>

          {/* --- RESULTAT --- */}
          {result && (
            <div>
              <div className="results-section">
                <h2 className="section-title">Resultat</h2>
                <div className="totals-grid">
                  {/* Brutto */}
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(15, 146, 233, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'var(--accent-blue)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Bruttolön</div>
                      <div className="card-value">{result.grossSalary.toLocaleString('sv-SE')} kr</div>
                    </div>
                  </div>

                  {/* Skatt */}
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(215, 38, 56, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'var(--accent-red)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Skatteavdrag</div>
                      <div className="card-value">{result.taxDeduction.toLocaleString('sv-SE')} kr</div>
                    </div>
                  </div>

                  {/* Netto */}
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(39, 180, 35, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'var(--accent-green)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Nettolön</div>
                      <div className="card-value">{result.netSalary.toLocaleString('sv-SE')} kr</div>
                    </div>
                  </div>

                  {/* Effektiv */}
                  <div className="total-card">
                    <div className="card-icon" style={{ backgroundColor: 'rgba(249, 220, 92, 0.15)' }}>
                      <Calculator size={24} style={{ color: 'var(--accent-orange)' }} />
                    </div>
                    <div className="card-content">
                      <div className="card-label">Effektiv skattesats</div>
                      <div className="card-value">{result.taxRate.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ margin: '20px 0' }}>
          <AdSenseUnit
            adSlot="1234567894"
            style={{ display: 'block', textAlign: 'center' }}
          />
        </div>

        {/* Skatteuppdelning */}
        {result && selectedKommun && (
          <div className="results-section">
            <h2 className="section-title">Skatteuppdelning i {selectedKommun.Kommun}</h2>
            <div className="totals-grid">
              <div className="total-card">
                <div className="card-content">
                  <div className="card-label">Kommunalskatt</div>
                  <div className="card-value">{result.municipalTax.toFixed(2)}%</div>
                </div>
              </div>

              <div className="total-card">
                <div className="card-content">
                  <div className="card-label">Landstingsskatt</div>
                  <div className="card-value">{result.countyTax.toFixed(2)}%</div>
                </div>
              </div>

              {churchMember && (
                <div className="total-card">
                  <div className="card-content">
                    <div className="card-label">Kyrkoskatt</div>
                    <div className="card-value">{result.churchTax.toFixed(2)}%</div>
                  </div>
                </div>
              )}

              <div className="total-card">
                <div className="card-content">
                  <div className="card-label">Total skattesats (kommun)</div>
                  <div className="card-value">{result.totalTaxRate.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  );
}