import { useState, useEffect } from 'react';
import { Calculator, Loader } from 'lucide-react';
import { Kommune } from '../types';
import { fetchKommuner, findKommun } from '../lib/skatteverket';
import { fetchTaxTable, calculateTaxDeduction, TaxTableEntry, TAX_COLUMNS } from '../lib/taxTables';

export function LonEfterSkatt() {
  const [grossSalary, setGrossSalary] = useState<number>(35000);
  const [selectedKommun, setSelectedKommun] = useState<Kommune | null>(null);
  const [kommuner, setKommuner] = useState<Kommune[]>([]);
  const [loading, setLoading] = useState(false);
  const [taxTable, setTaxTable] = useState<TaxTableEntry[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<number>(1);
  const [churchMember, setChurchMember] = useState(false);

  useEffect(() => {
    loadKommuner();
    loadTaxTable();
  }, []);

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

  const loadTaxTable = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const table = await fetchTaxTable(currentYear, '29', '30B');
      setTaxTable(table);
    } catch (error) {
      console.error('Failed to load tax table:', error);
    }
  };

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

    const taxDeduction = calculateTaxDeduction(grossSalary, taxTable, selectedColumn);
    const netSalary = grossSalary - taxDeduction;
    const taxRate = (taxDeduction / grossSalary) * 100;

    const municipalTax = parseFloat(selectedKommun.Kommnskatt);
    const countyTax = parseFloat(selectedKommun.Landstingsskatt);
    const churchTax = churchMember ? parseFloat(selectedKommun.Kyrkoskatt || '0') : 0;
    const totalTaxRate = municipalTax + countyTax + churchTax;

    return {
      grossSalary,
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
        <div className="settings-panel">
          <div className="panel-header">
            <Calculator size={20} />
            <h2>Inställningar</h2>
          </div>

          {/* --- SETTINGS GRID SOM RAD --- */}
          <div className="settings-grid" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
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
                onChange={(e) => setSelectedColumn(Number(e.target.value))}
                style={{ minWidth: 100 }}
              >
                {Object.entries(TAX_COLUMNS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </select>
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
                  maxWidth: '15rem',
                  boxSizing: 'border-box',
                }}
              >
                {TAX_COLUMNS[selectedColumn as keyof typeof TAX_COLUMNS].description}
              </div>
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
        </div>

        {/* --- RESULTAT --- */}
        {result && (
          <>
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

            {/* Skatteuppdelning */}
            {selectedKommun && (
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
          </>
        )}
      </main>
    </div>
  );
}