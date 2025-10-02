import { Kommune } from '../types';

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
let cachedKommuner: Kommune[] | null = null;

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

export async function fetchKommuner(): Promise<Kommune[]> {
  if (cachedKommuner) {
    return cachedKommuner;
  }

  try {
    const kommunMap = new Map<string, Kommune>();
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
        const kommunName = entry.kommun?.trim();
        if (!kommunName) return;

        const kommunId = kommunName.toUpperCase().replace(/\s+/g, '_');

        if (!kommunMap.has(kommunId)) {
          kommunMap.set(kommunId, {
            KommunId: kommunId,
            Kommun: kommunName,
            Kommnskatt: String(entry['kommunal-skatt'] || 0),
            Landstingsskatt: String(entry['landstings-skatt'] || 0),
            Kyrkoskatt: entry['kyrkoavgift'] ? String(entry['kyrkoavgift']) : null,
            Begravningsavgift: String(entry['begravnings-avgift'] || 0),
            Arbetsgivaravgift: '31.42',
            Slutskatt: String(entry['summa, exkl. kyrkoavgift'] || 0),
            År: String(entry.år || new Date().getFullYear()),
          });
        }
      });

      if (data.results.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    cachedKommuner = Array.from(kommunMap.values()).sort((a, b) =>
      a.Kommun.localeCompare(b.Kommun, 'sv')
    );

    return cachedKommuner;
  } catch (error) {
    console.error('Error fetching kommuner:', error);
    return [];
  }
}

export function findKommun(kommuner: Kommune[], name: string): Kommune | null {
  return kommuner.find((k) => k.Kommun.toLowerCase() === name.toLowerCase()) || null;
}
