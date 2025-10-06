import { supabase, CarRecord } from './supabase';

export async function getBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('car_records')
      .select('brand')
      .order('brand');

    if (error) {
      console.error('Error fetching brands:', error);
      return [];
    }

    const uniqueBrands = [...new Set(data.map(record => record.brand))];
    return uniqueBrands.sort();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export async function getModelsForBrand(brand: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('car_records')
      .select('model')
      .eq('brand', brand)
      .order('model');

    if (error) {
      console.error('Error fetching models:', error);
      return [];
    }

    const uniqueModels = [...new Set(data.map(record => record.model))];
    return uniqueModels.sort();
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export async function getYearsForModel(brand: string, model: string): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from('car_records')
      .select('model_year')
      .eq('brand', brand)
      .eq('model', model)
      .order('model_year', { ascending: false });

    if (error) {
      console.error('Error fetching years:', error);
      return [];
    }

    const uniqueYears = [...new Set(data.map(record => record.model_year))];
    return uniqueYears;
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
}

export async function findCarRecord(
  brand: string,
  model: string,
  year: number
): Promise<CarRecord | null> {
  try {
    const { data, error } = await supabase
      .from('car_records')
      .select('*')
      .eq('brand', brand)
      .eq('model', model)
      .eq('model_year', year)
      .maybeSingle();

    if (error) {
      console.error('Error fetching car record:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching car record:', error);
    return null;
  }
}

export async function getCarCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('car_records')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting car count:', error);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Error getting car count:', error);
    return 0;
  }
}

export async function getLastSyncInfo(): Promise<{ lastSynced: string | null; totalRecords: number; status: string } | null> {
  try {
    const { data, error } = await supabase
      .from('car_data_metadata')
      .select('*')
      .order('last_synced_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching sync info:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      lastSynced: data.last_synced_at,
      totalRecords: data.total_records,
      status: data.sync_status
    };
  } catch (error) {
    console.error('Error fetching sync info:', error);
    return null;
  }
}

export function calculateFormansvarde(params: {
  nybilspris: number;
  fordonsskatt: number;
  extrautrustning: number;
  milReducering: boolean;
  co2?: number;
  drivmedel?: string;
}): number {
  const totalPrice = params.nybilspris + params.extrautrustning;
  let monthlyForman = (totalPrice * 0.09) / 12 + params.fordonsskatt / 12;

  if (params.milReducering) {
    monthlyForman *= 0.75;
  }

  return Math.round(monthlyForman);
}
