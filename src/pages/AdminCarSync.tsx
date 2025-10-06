import { useState, useEffect } from 'react';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { syncCarDataFromSkatteverket, checkIfDataExists } from '../lib/syncCarData';
import { getCarCount, getLastSyncInfo } from '../lib/carsDatabase';

export function AdminCarSync() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; totalSynced: number; error?: string } | null>(null);
  const [carCount, setCarCount] = useState<number>(0);
  const [lastSync, setLastSync] = useState<{ lastSynced: string | null; totalRecords: number; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const count = await getCarCount();
      setCarCount(count);

      const syncInfo = await getLastSyncInfo();
      setLastSync(syncInfo);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const result = await syncCarDataFromSkatteverket(1000);
      setSyncResult(result);

      if (result.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncResult({
        success: false,
        totalSynced: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Car Data Management</h1>
            <p className="subtitle">Sync and manage car data from Skatteverket</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="settings-panel">
          <div className="panel-header">
            <Database size={20} />
            <h2>Database Status</h2>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Total car records:</span>
                    <strong>{carCount.toLocaleString('sv-SE')}</strong>
                  </div>

                  {lastSync && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Last synced:</span>
                        <strong>
                          {lastSync.lastSynced
                            ? new Date(lastSync.lastSynced).toLocaleString('sv-SE')
                            : 'Never'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Sync status:</span>
                        <strong style={{ color: lastSync.status === 'success' ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                          {lastSync.status}
                        </strong>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: syncing ? 'var(--border-color)' : 'var(--accent-blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: syncing ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  <RefreshCw size={16} className={syncing ? 'spinner' : ''} />
                  {syncing ? 'Syncing...' : 'Sync Car Data'}
                </button>

                {syncResult && (
                  <div
                    style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: syncResult.success ? 'rgba(39, 180, 35, 0.1)' : 'rgba(215, 38, 56, 0.1)',
                      border: `1px solid ${syncResult.success ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    {syncResult.success ? (
                      <CheckCircle size={20} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                    ) : (
                      <AlertCircle size={20} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                        {syncResult.success ? 'Sync Successful' : 'Sync Failed'}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        {syncResult.success
                          ? `Successfully synced ${syncResult.totalSynced.toLocaleString('sv-SE')} car records`
                          : syncResult.error || 'An unknown error occurred'}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="settings-panel">
          <div className="panel-header">
            <Database size={20} />
            <h2>About Car Data</h2>
          </div>

          <div style={{ padding: '1.5rem', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '1rem' }}>
              Car data is sourced from Skatteverket's public API and includes information about:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Car brands and models</li>
              <li>Model years</li>
              <li>New car prices (excluding VAT)</li>
              <li>Vehicle tax amounts</li>
              <li>CO2 emissions</li>
              <li>Fuel types</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              The sync process fetches up to 1000 car records from Skatteverket and stores them in the database for fast access.
              This data is used in the Förmånsbil Calculator to help users calculate company car benefits.
            </p>
            <p>
              <strong>Note:</strong> The first sync will take 10-30 seconds depending on network speed and API response time.
              Subsequent syncs will update existing records efficiently.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
