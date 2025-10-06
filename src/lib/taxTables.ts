export interface TaxTableEntry {
  'kolumn 1': string;
  'kolumn 2': string;
  'kolumn 3': string;
  'kolumn 4': string;
  'kolumn 5': string;
  'kolumn 6': string;
  'kolumn 7': string;
  'tabellnr': string;
  'antal dgr': string;
  'inkomst t.o.m.': string;
  'år': string;
  'inkomst fr.o.m.': string;
}

interface TaxTableResponse {
  results: TaxTableEntry[];
  resultCount: number;
  offset: number;
  limit: number;
  next?: string;
}

const TAX_TABLE_API = 'https://skatteverket.entryscape.net/rowstore/dataset/88320397-5c32-4c16-ae79-d36d95b17b95';

const toNumber = (v: string): number => Number(String(v).replace(/[^\d-]/g, '')) || 0;

export async function fetchTaxTable(
  year: number,
  tableNumber: string
): Promise<TaxTableEntry[]> {
  try {
    // Fetch ALL entries by using a very high limit
    const query = `år=${year}&tabellnr=${tableNumber}`;
    const url = `${TAX_TABLE_API}?${encodeURI(query)}&_limit=10000`;
    
    console.log('Fetching tax table:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tax table: ${response.statusText}`);
    }

    const data: TaxTableResponse = await response.json();
    
    console.log('API returned:', {
      resultCount: data.resultCount,
      limit: data.limit,
      offset: data.offset,
      actualResults: data.results.length,
      hasNext: !!data.next
    });
    
    // If there are more results, fetch them too
    let allResults = data.results;
    let nextUrl = data.next;
    
    while (nextUrl && allResults.length < 5000) {
      console.log('Fetching next page:', nextUrl);
      const nextResponse = await fetch(nextUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!nextResponse.ok) break;
      
      const nextData: TaxTableResponse = await nextResponse.json();
      allResults = [...allResults, ...nextData.results];
      nextUrl = nextData.next;
    }
    
    console.log('Total entries fetched:', allResults.length);
    
    return allResults;
  } catch (error) {
    console.error('Error fetching tax table:', error);
    throw error;
  }
}

export function calculateTaxDeduction(
  grossSalary: number,
  taxTable: TaxTableEntry[],
  columnNumber: number
): number {
  const columnKey = `kolumn ${columnNumber}` as keyof TaxTableEntry;

  const entry = taxTable.find((row) => {
    const from = toNumber(row['inkomst fr.o.m.']);
    const to = toNumber(row['inkomst t.o.m.']);
    return grossSalary >= from && grossSalary <= to;
  });

  if (!entry) {
    if (grossSalary < toNumber(taxTable[0]['inkomst fr.o.m.'])) {
      return 0;
    }
    const lastEntry = taxTable[taxTable.length - 1];
    return toNumber(lastEntry[columnKey] || '0');
  }

  return toNumber(entry[columnKey] || '0');
}

export const TAX_COLUMNS = {
  1: {
    name: 'Kolumn 1: Lön (<66 år)',
    description: 'Löner och arvoden till den som vid årets ingång inte fyllt 66 år. Ger rätt till jobbskatteavdrag.',
  },
  2: {
    name: 'Kolumn 2: Pension (≥66 år)',
    description: 'Pensioner och andra ersättningar till den som vid årets ingång fyllt 66 år.',
  },
  3: {
    name: 'Kolumn 3: Lön (≥66 år)',
    description: 'Löner och arvoden till den som vid årets ingång fyllt 66 år. Ger rätt till förhöjt jobbskatteavdrag.',
  },
  4: {
    name: 'Kolumn 4: Sjuk/aktivitetsersättning',
    description: 'Sjuk- och aktivitetsersättning till den som vid årets ingång inte fyllt 66 år.',
  },
  5: {
    name: 'Kolumn 5: A-kassa och liknande',
    description: 'Ersättning från arbetslöshetskassa och egen arbetsskadelivränta (född 1938 eller senare).',
  },
  6: {
    name: 'Kolumn 6: Pension (<66 år)',
    description: 'Pensioner och andra ersättningar till den som vid årets ingång inte fyllt 66 år.',
  },
} as const;