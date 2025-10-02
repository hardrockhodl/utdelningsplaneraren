import { FileText } from 'lucide-react';

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
  const years = Object.keys(K10_DATA.gransbelopp).map(Number).sort((a, b) => b - a);

  return (
    <div className="app">
      <header className="app-header">
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
        <div className="results-section">
          <div
            style={{
              overflowX: 'auto',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--header-bg)',
                    borderBottom: '2px solid var(--border-color)',
                  }}
                >
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      borderRight: '1px solid var(--border-color)',
                      minWidth: '280px',
                    }}
                  >
                    ÅRTAL
                  </th>
                  {years.map((year) => (
                    <th
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        borderRight: '1px solid var(--border-color)',
                        minWidth: '120px',
                      }}
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                      textAlign: 'right',
                    }}
                  >
                    Gränsbelopp enligt förenklingsregeln
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid var(--border-color)',
                      }}
                    >
                      {K10_DATA.gransbelopp[year as keyof typeof K10_DATA.gransbelopp].toLocaleString('sv-SE')} kr
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                      textAlign: 'right',
                    }}
                  >
                    Procentsats för uppräkning av sparat utdelningsutrymme
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid var(--border-color)',
                      }}
                    >
                      {K10_DATA.upprakningsprocent[year as keyof typeof K10_DATA.upprakningsprocent].toLocaleString('sv-SE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                    }}
                  >
                    Ränta vid beräkning av omkostnadsbeloppsdelen enligt huvudregeln
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid var(--border-color)',
                      }}
                    >
                      {K10_DATA.ranta[year as keyof typeof K10_DATA.ranta].toLocaleString('sv-SE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                    }}
                  >
                    Takbelopp för utdelning som ska beskattas i tjänst
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid var(--border-color)',
                      }}
                    >
                      {K10_DATA.takbeloppUtdelning[year as keyof typeof K10_DATA.takbeloppUtdelning].toLocaleString('sv-SE')} kr
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                    }}
                  >
                    Takbelopp för vinst som ska beskattas i tjänst
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid var(--border-color)',
                      }}
                    >
                      {K10_DATA.takbeloppVinst[year as keyof typeof K10_DATA.takbeloppVinst].toLocaleString('sv-SE')} kr
                    </td>
                  ))}
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '1rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                    }}
                  >
                    Lönekrav
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        borderRight: '1px solid var(--border-color)',
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                      }}
                    >
                      {K10_DATA.lonekrav[year as keyof typeof K10_DATA.lonekrav].fast.toLocaleString('sv-SE')} kr eller{' '}
                      {K10_DATA.lonekrav[year as keyof typeof K10_DATA.lonekrav].alternativ.toLocaleString('sv-SE')} kr + 5% av sammanlagd kontant ersättning
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
