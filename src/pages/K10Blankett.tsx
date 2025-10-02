import { useState } from 'react';
import { Calculator, ChevronDown } from 'lucide-react';

const K10_DATA = {
  gransbelopp: {
    2025: 209550,
    2024: 204325,
    2023: 195250,
    2022: 187550,
    2021: 183700,
    2020: 177100,
  },
  upprakningsprocent: {
    2025: 104.96,
    2024: 105.62,
    2023: 104.94,
    2022: 103.23,
    2021: 103,
    2020: 103,
  },
  ranta: {
    2025: 10.96,
    2024: 11.62,
    2023: 10.94,
    2022: 9.23,
    2021: 9,
    2020: 9,
  },
  takbeloppUtdelning: {
    2025: 7254000,
    2024: 6858000,
    2023: 6687000,
    2022: 6390000,
    2021: 6138000,
    2020: 6012000,
  },
  takbeloppVinst: {
    2025: 8060000,
    2024: 7620000,
    2023: 7430000,
    2022: 7100000,
    2021: 6820000,
    2020: 6680000,
  },
  lonekrav: {
    2025: { fast: 731520, alternativ: 457200 },
    2024: { fast: 713280, alternativ: 445800 },
    2023: { fast: 681600, alternativ: 426000 },
    2022: { fast: 654720, alternativ: 409200 },
    2021: { fast: 641280, alternativ: 400800 },
    2020: { fast: 618240, alternativ: 386400 },
  },
};

export function K10Blankett() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showGransbelopp, setShowGransbelopp] = useState<boolean>(true);
  const [showUpprakning, setShowUpprakning] = useState<boolean>(false);
  const [showRanta, setShowRanta] = useState<boolean>(false);
  const [showTakbeloppUtdelning, setShowTakbeloppUtdelning] = useState<boolean>(false);
  const [showTakbeloppVinst, setShowTakbeloppVinst] = useState<boolean>(false);
  const [showLonekrav, setShowLonekrav] = useState<boolean>(false);

  const years = Object.keys(K10_DATA.gransbelopp).map(Number).sort((a, b) => b - a);

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Belopp och procentsatser (blankett K10)</h1>
            <p className="subtitle">
              Skatteuppgifter för fåmansföretag enligt blankett K10
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="settings-panel">
          <div className="panel-header">
            <Calculator size={20} />
            <h2>Välj inkomstår</h2>
          </div>

          <div className="setting-item">
            <label className="setting-label">Inkomstår</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gränsbelopp enligt förenklingsregeln */}
        <div className="results-section">
          <button
            onClick={() => setShowGransbelopp(!showGransbelopp)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              width: '100%',
            }}
          >
            <ChevronDown
              size={20}
              style={{
                transform: showGransbelopp ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
            Gränsbelopp enligt förenklingsregeln
          </button>
          {showGransbelopp && (
            <div className="totals-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(15, 146, 233, 0.15)' }}>
                  <Calculator size={24} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Inkomståret {selectedYear}</div>
                  <div className="card-value">
                    {K10_DATA.gransbelopp[selectedYear as keyof typeof K10_DATA.gransbelopp].toLocaleString('sv-SE')} kr
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Procentsats för uppräkning */}
        <div className="results-section">
          <button
            onClick={() => setShowUpprakning(!showUpprakning)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              width: '100%',
            }}
          >
            <ChevronDown
              size={20}
              style={{
                transform: showUpprakning ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
            Procentsats för uppräkning av sparat utdelningsutrymme
          </button>
          {showUpprakning && (
            <div className="totals-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(39, 180, 35, 0.15)' }}>
                  <Calculator size={24} style={{ color: 'var(--accent-green)' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Inkomståret {selectedYear}</div>
                  <div className="card-value">
                    {K10_DATA.upprakningsprocent[selectedYear as keyof typeof K10_DATA.upprakningsprocent].toLocaleString('sv-SE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ränta vid beräkning */}
        <div className="results-section">
          <button
            onClick={() => setShowRanta(!showRanta)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              width: '100%',
            }}
          >
            <ChevronDown
              size={20}
              style={{
                transform: showRanta ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
            Ränta vid beräkning av omkostnadsbeloppsdelen enligt huvudregeln
          </button>
          {showRanta && (
            <div className="totals-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(249, 220, 92, 0.15)' }}>
                  <Calculator size={24} style={{ color: 'var(--accent-orange)' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Inkomståret {selectedYear}</div>
                  <div className="card-value">
                    {K10_DATA.ranta[selectedYear as keyof typeof K10_DATA.ranta].toLocaleString('sv-SE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Takbelopp för utdelning */}
        <div className="results-section">
          <button
            onClick={() => setShowTakbeloppUtdelning(!showTakbeloppUtdelning)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              width: '100%',
            }}
          >
            <ChevronDown
              size={20}
              style={{
                transform: showTakbeloppUtdelning ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
            Takbelopp för utdelning som ska beskattas i tjänst
          </button>
          {showTakbeloppUtdelning && (
            <div className="totals-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(215, 38, 56, 0.15)' }}>
                  <Calculator size={24} style={{ color: 'var(--accent-red)' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Inkomståret {selectedYear}</div>
                  <div className="card-value">
                    {K10_DATA.takbeloppUtdelning[selectedYear as keyof typeof K10_DATA.takbeloppUtdelning].toLocaleString('sv-SE')} kr
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Takbelopp för vinst */}
        <div className="results-section">
          <button
            onClick={() => setShowTakbeloppVinst(!showTakbeloppVinst)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              width: '100%',
            }}
          >
            <ChevronDown
              size={20}
              style={{
                transform: showTakbeloppVinst ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
            Takbelopp för vinst som ska beskattas i tjänst
          </button>
          {showTakbeloppVinst && (
            <div className="totals-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(156, 39, 176, 0.15)' }}>
                  <Calculator size={24} style={{ color: '#9C27B0' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Inkomståret {selectedYear}</div>
                  <div className="card-value">
                    {K10_DATA.takbeloppVinst[selectedYear as keyof typeof K10_DATA.takbeloppVinst].toLocaleString('sv-SE')} kr
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lönekrav */}
        <div className="results-section">
          <button
            onClick={() => setShowLonekrav(!showLonekrav)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '0.5rem 0',
              width: '100%',
            }}
          >
            <ChevronDown
              size={20}
              style={{
                transform: showLonekrav ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            />
            Lönekrav
          </button>
          {showLonekrav && (
            <div className="totals-grid">
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(15, 146, 233, 0.15)' }}>
                  <Calculator size={24} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Fast lönekrav</div>
                  <div className="card-value">
                    {K10_DATA.lonekrav[selectedYear as keyof typeof K10_DATA.lonekrav].fast.toLocaleString('sv-SE')} kr
                  </div>
                </div>
              </div>
              <div className="total-card">
                <div className="card-icon" style={{ backgroundColor: 'rgba(39, 180, 35, 0.15)' }}>
                  <Calculator size={24} style={{ color: 'var(--accent-green)' }} />
                </div>
                <div className="card-content">
                  <div className="card-label">Alternativt lönekrav</div>
                  <div className="card-value">
                    {K10_DATA.lonekrav[selectedYear as keyof typeof K10_DATA.lonekrav].alternativ.toLocaleString('sv-SE')} kr + 5%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    + 5% av sammanlagd kontant ersättning
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
