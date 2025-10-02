import { FileText } from 'lucide-react';

type Year = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;
type K10Map<T> = Record<Year, T>;

const K10_DATA: {
  gransbelopp: K10Map<number>;
  upprakningsprocent: K10Map<number>;
  ranta: K10Map<number>;
  takbeloppUtdelning: K10Map<number>;
  takbeloppVinst: K10Map<number>;
  lonekrav: K10Map<{ fast: number; alternativ: number }>;
} = {
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
  const years = Object.keys(K10_DATA.gransbelopp)
    .map(Number)
    .sort((a, b) => b - a) as Year[];

  const now = new Date().getFullYear();

  const cell = (value: number | string, year: number, rowIndex: number) => (
    <td
      key={year}
      style={{
        padding: '0.5rem 0.75rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        borderRight: '1px solid var(--border-color)',
        backgroundColor:
          year === now
            ? 'var(--row-highlight, rgba(15,146,233,0.08))'
            : rowIndex % 2 === 0
            ? 'var(--stripe-bg, rgba(0,0,0,0.02))'
            : 'transparent',
      }}
    >
      {value}
    </td>
  );

  const row = (
    label: string,
    values: (year: Year) => number | string,
    format?: 'kr' | '%' | 'raw',
    rowIndex: number = 0
  ) => (
    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
      <th
        scope="row"
        style={{
          padding: '0.5rem 0.75rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          borderRight: '1px solid var(--border-color)',
          textAlign: 'right',
          position: 'sticky',
          left: 0,
          background: rowIndex % 2 === 0 ? 'var(--stripe-bg, rgba(0,0,0,0.02))' : 'var(--card-bg)',
          zIndex: 1,
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
      >
        {label}
      </th>
      {years.map((year) => {
        const v = values(year);
        if (typeof v !== 'number') return cell(v, year, rowIndex);
        if (format === '%')
          return cell(
            v.toLocaleString('sv-SE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + '%',
            year,
            rowIndex
          );
        if (format === 'kr') return cell(v.toLocaleString('sv-SE') + ' kr', year, rowIndex);
        return cell(v, year, rowIndex);
      })}
    </tr>
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} />
            <h1>Belopp och procentsatser (blankett K10)</h1>
          </div>
          <p className="subtitle">Skatteuppgifter för fåmansföretag enligt blankett K10</p>
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
                fontSize: '0.875rem',
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
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      borderRight: '1px solid var(--border-color)',
                      minWidth: '240px',
                      position: 'sticky',
                      left: 0,
                      background: 'var(--header-bg)',
                      zIndex: 2,
                    }}
                  >
                    År
                  </th>
                  {years.map((year) => (
                    <th
                      key={year}
                      style={{
                        padding: '0.5rem 0.75rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        borderRight: '1px solid var(--border-color)',
                        minWidth: '110px',
                        backgroundColor:
                          year === now
                            ? 'var(--row-highlight, rgba(15,146,233,0.08))'
                            : 'var(--header-bg)',
                      }}
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {row('Gränsbelopp enligt förenklingsregeln', (y) => K10_DATA.gransbelopp[y], 'kr', 0)}
                {row(
                  'Procentsats för uppräkning av sparat utdelningsutrymme',
                  (y) => K10_DATA.upprakningsprocent[y],
                  '%',
                  1
                )}
                {row(
                  'Ränta vid beräkning av omkostnadsbeloppsdelen (huvudregeln)',
                  (y) => K10_DATA.ranta[y],
                  '%',
                  2
                )}
                {row(
                  'Takbelopp för utdelning som ska beskattas i tjänst',
                  (y) => K10_DATA.takbeloppUtdelning[y],
                  'kr',
                  3
                )}
                {row(
                  'Takbelopp för vinst som ska beskattas i tjänst',
                  (y) => K10_DATA.takbeloppVinst[y],
                  'kr',
                  4
                )}
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th
                    scope="row"
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderRight: '1px solid var(--border-color)',
                      textAlign: 'right',
                      position: 'sticky',
                      left: 0,
                      background: 'var(--stripe-bg, rgba(0,0,0,0.02))',
                      zIndex: 1,
                      backdropFilter: 'blur(5px)',
                      WebkitBackdropFilter: 'blur(5px)',
                    }}
                  >
                    Lönekrav
                  </th>
                  {years.map((year) => {
                    const l = K10_DATA.lonekrav[year];
                    return cell(
                      `${l.fast.toLocaleString('sv-SE')} kr eller ${l.alternativ.toLocaleString(
                        'sv-SE'
                      )} kr + 5% av sammanlagd kontant ersättning`,
                      year,
                      5
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}