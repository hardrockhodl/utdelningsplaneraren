export interface CarRecord {
  brand: string;
  model: string;
  modelYear: number;
  nybilspris: number;
  fordonsskatt: number;
  co2: number;
  drivmedel: string;
}

const API_BASE = 'https://skatteverket.entryscape.net/rowstore/dataset/fad86bf9-67e3-4d68-829c-7b9a23bc5e42/json';

// Robust number parsing helper
const toNumber = (v?: string) => Number(String(v ?? '').replace(/[^\d.-]/g, '')) || 0;

interface ApiResponse {
  results: ApiRecord[];
  limit: number;
  offset: number;
}

interface ApiRecord {
  Fabrikat?: string;
  Modell?: string;
  Modellår?: string;
  'Nybilspris exkl moms'?: string;
  Fordonsskatt?: string;
  'CO2-utsläpp'?: string;
  Drivmedel?: string;
}

// Fetch all car records with pagination
export async function fetchAllCars(
  limit = 500,
  onChunk?: (chunk: CarRecord[]) => void
): Promise<CarRecord[]> {
  const records: CarRecord[] = [];
  let offset = 0;
  const maxRecords = 5000;

  try {
    while (records.length < maxRecords) {
      const url = `${API_BASE}?_limit=${limit}&_offset=${offset}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) break;
      const data: ApiResponse = await res.json();
      if (!data.results?.length) break;

      const chunk: CarRecord[] = [];
      for (const r of data.results) {
        const parsed = parseCarRecord(r);
        if (parsed) {
          records.push(parsed);
          chunk.push(parsed);
        }
      }

      // NEW: push partial result so UI kan visa märken direkt
      if (onChunk && chunk.length) onChunk(chunk);

      if (data.results.length < limit) break;
      offset += limit;
    }
    return records;
  } catch {
    return [];
  }
}

// Parse API record to typed CarRecord
function parseCarRecord(record: ApiRecord): CarRecord | null {
  try {
    const brand = record.Fabrikat?.trim();
    const model = record.Modell?.trim();
    const modelYear = toNumber(record.Modellår);
    const nybilspris = toNumber(record['Nybilspris exkl moms']);
    const fordonsskatt = toNumber(record.Fordonsskatt);
    const co2 = toNumber(record['CO2-utsläpp']);
    const drivmedel = record.Drivmedel?.trim() || '';

    if (!brand || !model) { return null; }

    return {
      brand,
      model,
      modelYear,
      nybilspris,
      fordonsskatt,
      co2,
      drivmedel
    };
  } catch (error) {
    return null;
  }
}

// Get unique brands from records
export function getBrands(records: CarRecord[]): string[] {
  const brands = new Set(records.map(r => r.brand));
  return Array.from(brands).sort();
}

// Get models for a specific brand
export function getModelsForBrand(records: CarRecord[], brand: string): string[] {
  const models = new Set(
    records
      .filter(r => r.brand === brand)
      .map(r => r.model)
  );
  return Array.from(models).sort();
}

// Get years for a specific brand and model
export function getYearsForModel(records: CarRecord[], brand: string, model: string): number[] {
  const years = new Set(
    records
      .filter(r => r.brand === brand && r.model === model)
      .map(r => r.modelYear)
  );
  return Array.from(years).sort((a, b) => b - a);
}

// Find specific car record
export function findCarRecord(
  records: CarRecord[],
  brand: string,
  model: string,
  year: number
): CarRecord | null {
  return records.find(
    r => r.brand === brand && r.model === model && r.modelYear === year
  ) || null;
}

// Calculate förmånsvärde based on car data
export function calculateFormansvarde(params: {
  nybilspris: number;
  fordonsskatt: number;
  extrautrustning: number;
  milReducering: boolean; // 3000 mil i tjänsten
  co2?: number;
  drivmedel?: string;
}): number {
  // Basic calculation: (nybilspris + extrautrustning) * 0.09 / 12 + fordonsskatt / 12
  // This is a simplified version; actual Skatteverket rules are more complex

  const totalPrice = params.nybilspris + params.extrautrustning;
  let monthlyForman = (totalPrice * 0.09) / 12 + params.fordonsskatt / 12;

  // Apply 25% reduction if >= 3000 km in work-related driving
  if (params.milReducering) {
    monthlyForman *= 0.75;
  }

  return Math.round(monthlyForman);
}
