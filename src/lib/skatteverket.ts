export interface KommunTaxData {
  kommun: string;
  församling: string;
  'kommunal-skatt': number;
  'landstings-skatt': number;
  'kyrkoavgift': number;
  'begravnings-avgift': number;
  'summa, inkl. kyrkoavgift': number;
  'summa, exkl. kyrkoavgift': number;
  år: number;
}

export interface KommunOption {
  name: string;
  municipalTax: number;
  countyTax: number;
  churchTax: number;
  burialFee: number;
  totalWithChurch: number;
  totalWithoutChurch: number;
}

let cachedKommunData: KommunOption[] | null = null;

export async function fetchKommunTaxData(): Promise<KommunOption[]> {
  if (cachedKommunData) {
    return cachedKommunData;
  }

  try {
    const kommunMap = new Map<string, KommunOption>();
    let offset = 0;
    const limit = 500;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `https://skatteverket.entryscape.net/rowstore/dataset/c67b320b-ffee-4876-b073-dd9236cd2a99/json?_limit=${limit}&_offset=${offset}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tax data');
      }

      const data: { results: KommunTaxData[] } = await response.json();

      if (data.results.length === 0) {
        hasMore = false;
        break;
      }

      data.results.forEach((entry) => {
        const kommunName = entry.kommun?.toUpperCase().trim();

        if (!kommunName) return;

        if (!kommunMap.has(kommunName)) {
          const totalWithoutChurch = parseFloat(String(entry['summa, exkl. kyrkoavgift'])) || 0;
          const churchTax = parseFloat(String(entry['kyrkoavgift'])) || 0;

          kommunMap.set(kommunName, {
            name: kommunName,
            municipalTax: totalWithoutChurch,
            countyTax: parseFloat(String(entry['landstings-skatt'])) || 0,
            churchTax: churchTax,
            burialFee: parseFloat(String(entry['begravnings-avgift'])) || 0,
            totalWithChurch: parseFloat(String(entry['summa, inkl. kyrkoavgift'])) || 0,
            totalWithoutChurch: totalWithoutChurch,
          });
        }
      });

      if (data.results.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    cachedKommunData = Array.from(kommunMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'sv')
    );

    return cachedKommunData;
  } catch (error) {
    console.error('Error fetching kommun tax data:', error);
    return [];
  }
}
