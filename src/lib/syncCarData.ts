import { supabase } from './supabase';

const API_BASE = 'https://skatteverket.entryscape.net/rowstore/dataset/fad86bf9-67e3-4d68-829c-7b9a23bc5e42/json';

const toNumber = (v?: string) => Number(String(v ?? '').replace(/[^\d.-]/g, '')) || 0;

interface ApiRecord {
  Fabrikat?: string;
  Modell?: string;
  Modellår?: string;
  'Nybilspris exkl moms'?: string;
  Fordonsskatt?: string;
  'CO2-utsläpp'?: string;
  Drivmedel?: string;
}

interface ApiResponse {
  results: ApiRecord[];
  limit: number;
  offset: number;
}

export async function syncCarDataFromSkatteverket(maxRecords = 1000): Promise<{ success: boolean; totalSynced: number; error?: string }> {
  try {
    console.log('Starting car data sync from Skatteverket...');

    const carsToInsert = [];
    let offset = 0;
    const limit = 100;
    let totalFetched = 0;

    while (totalFetched < maxRecords) {
      const url = `${API_BASE}?_limit=${limit}&_offset=${offset}`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch cars:', response.status);
        break;
      }

      const data: ApiResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        break;
      }

      data.results.forEach(record => {
        const brand = record.Fabrikat?.trim();
        const model = record.Modell?.trim();
        const modelYear = toNumber(record.Modellår);
        const nybilspris = toNumber(record['Nybilspris exkl moms']);
        const fordonsskatt = toNumber(record.Fordonsskatt);
        const co2 = toNumber(record['CO2-utsläpp']);
        const drivmedel = record.Drivmedel?.trim() || '';

        if (brand && model && modelYear && nybilspris) {
          carsToInsert.push({
            brand,
            model,
            model_year: modelYear,
            nybilspris,
            fordonsskatt,
            co2,
            drivmedel
          });
        }
      });

      totalFetched += data.results.length;

      if (data.results.length < limit) {
        break;
      }

      offset += limit;
    }

    if (carsToInsert.length === 0) {
      return { success: false, totalSynced: 0, error: 'No car records found' };
    }

    console.log(`Fetched ${carsToInsert.length} car records, inserting into database...`);

    const { error: insertError } = await supabase
      .from('car_records')
      .upsert(carsToInsert, {
        onConflict: 'brand,model,model_year',
        ignoreDuplicates: false
      });

    if (insertError) {
      console.error('Error inserting car records:', insertError);
      return { success: false, totalSynced: 0, error: insertError.message };
    }

    const { error: metadataError } = await supabase
      .from('car_data_metadata')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        last_synced_at: new Date().toISOString(),
        total_records: carsToInsert.length,
        sync_status: 'success',
        updated_at: new Date().toISOString()
      });

    if (metadataError) {
      console.error('Error updating metadata:', metadataError);
    }

    console.log(`Successfully synced ${carsToInsert.length} car records`);
    return { success: true, totalSynced: carsToInsert.length };

  } catch (error) {
    console.error('Error syncing car data:', error);
    return {
      success: false,
      totalSynced: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function checkIfDataExists(): Promise<boolean> {
  const { count, error } = await supabase
    .from('car_records')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error checking car records:', error);
    return false;
  }

  return (count ?? 0) > 0;
}
