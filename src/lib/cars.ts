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
const CAR_CACHE_KEY = 'skatteverket_cars_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

interface CachedData<T> {
  data: T;
  timestamp: number;
}

function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsed: CachedData<T> = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;

    if (age > CACHE_DURATION_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cached));
  } catch {
    // localStorage full or unavailable
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function retryFetch(url: string, maxRetries: number = 2): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetchWithTimeout(url);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError || new Error('Fetch failed');
}

// Robust number parsing helper
const toNumber = (v?: string) => Number(String(v ?? '').replace(/[^\d.-]/g, '')) || 0;

interface ApiResponse {
  results: ApiRecord[];
  limit: number;
  offset: number;
}

interface ApiRecord {
  marke?: string;
  modell?: string;
  tillverkningsar?: string;
  nybilspris?: string;
  fordonsskatt?: string;
  bransletyp?: string;
}

// Fetch all car records with pagination
export async function fetchAllCars(
  limit = 500,
  onChunk?: (chunk: CarRecord[]) => void
): Promise<CarRecord[]> {
  const cached = getCachedData<CarRecord[]>(CAR_CACHE_KEY);
  if (cached && cached.length > 0) {
    if (onChunk) onChunk(cached);
    return cached;
  }

  const records: CarRecord[] = [];
  let offset = 0;
  const maxRecords = 5000;

  try {
    while (records.length < maxRecords) {
      const url = `${API_BASE}?_limit=${limit}&_offset=${offset}`;
      const res = await retryFetch(url);
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

      if (onChunk && chunk.length) onChunk(chunk);

      if (data.results.length < limit) break;
      offset += limit;
    }

    if (records.length > 0) {
      setCachedData(CAR_CACHE_KEY, records);
    }

    return records;
  } catch (error) {
    const fallback = getCachedData<CarRecord[]>(CAR_CACHE_KEY);
    if (fallback && fallback.length > 0) {
      if (onChunk) onChunk(fallback);
      return fallback;
    }
    throw error;
  }
}

// Parse API record to typed CarRecord
function parseCarRecord(record: ApiRecord): CarRecord | null {
  try {
    const brand = record.marke?.trim();
    const model = record.modell?.trim();
    const modelYear = toNumber(record.tillverkningsar);
    const nybilspris = toNumber(record.nybilspris);
    const fordonsskatt = toNumber(record.fordonsskatt);
    const co2 = 0;
    const drivmedel = record.bransletyp?.trim() || '';

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

// Get unique years from records
export function getYears(records: CarRecord[]): number[] {
  const years = new Set(records.map(r => r.modelYear));
  return Array.from(years).filter(y => y > 0).sort((a, b) => b - a);
}

// Get brands for a specific year
export function getBrandsForYear(records: CarRecord[], year: number): string[] {
  const brands = new Set(
    records
      .filter(r => r.modelYear === year)
      .map(r => r.brand)
  );
  return Array.from(brands).sort();
}

// Get models for a specific year and brand
export function getModelsForYearAndBrand(records: CarRecord[], year: number, brand: string): string[] {
  const models = new Set(
    records
      .filter(r => r.modelYear === year && r.brand === brand)
      .map(r => r.model)
  );
  return Array.from(models).sort();
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
  return Array.from(years).filter(y => y > 0).sort((a, b) => b - a);
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
