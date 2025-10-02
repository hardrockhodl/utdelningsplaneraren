import { useState, useEffect } from 'react';
import { GlobalSettings } from '../types';
import { labels } from '../lib/labels';
import { fetchKommunTaxData, KommunOption } from '../lib/skatteverket';
import { Settings, Loader } from 'lucide-react';

interface SettingsPanelProps {
  settings: GlobalSettings;
  onChange: (settings: GlobalSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const [kommuner, setKommuner] = useState<KommunOption[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchKommunTaxData().then((data) => {
      setKommuner(data);
      setLoading(false);
  
      // sätt default om ingen kommun är vald
      if (!settings.kommun) {
        const stockholm = data.find((k) => k.name === 'Stockholm');
        if (stockholm) {
          onChange({
            ...settings,
            kommun: stockholm.name,
            municipalTax: settings.churchMember ? stockholm.totalWithChurch : stockholm.totalWithoutChurch,
            churchTax: stockholm.churchTax,
          });
        }
      }
    });
  }, []);

  const updateSetting = (key: keyof GlobalSettings, value: number | boolean | string | null) => {
    onChange({ ...settings, [key]: value });
  };

  const handleKommunChange = (kommunName: string) => {
    if (!kommunName) {
      updateSetting('kommun', null);
      return;
    }

    const kommun = kommuner.find((k) => k.name === kommunName);
    if (kommun) {
      onChange({
        ...settings,
        kommun: kommunName,
        municipalTax: settings.churchMember ? kommun.totalWithChurch : kommun.totalWithoutChurch,
        churchTax: kommun.churchTax,
      });
    }
  };

  const handleChurchMemberChange = (checked: boolean) => {
    if (!settings.kommun) {
      updateSetting('churchMember', checked);
      return;
    }

    const kommun = kommuner.find((k) => k.name === settings.kommun);
    if (kommun) {
      onChange({
        ...settings,
        churchMember: checked,
        municipalTax: checked ? kommun.totalWithChurch : kommun.totalWithoutChurch,
      });
    } else {
      updateSetting('churchMember', checked);
    }
  };

  const handleRegionalSupportChange = (checked: boolean) => {
    updateSetting('regionalSupport', checked);
  };

  return (
    <div className="settings-panel">
      <div className="panel-header">
        <Settings size={18} />
        <h2>Inställningar</h2>
      </div>

      <div className="settings-grid">
        <div className="setting-item kommun-selector">
          <label className="setting-label">
            Kommun
          </label>
          {loading ? (
            <div className="loading-container">
              <Loader size={16} className="spinner" />
              <span>Laddar kommuner...</span>
            </div>
          ) : (
            <select
              value={settings.kommun || ''}
              onChange={(e) => handleKommunChange(e.target.value)}
            >
              <option value="">Välj kommun eller ange manuellt</option>
              {kommuner.map((kommun) => (
                <option key={kommun.name} value={kommun.name}>
                  {kommun.name} ({kommun.totalWithoutChurch.toFixed(2)}%)
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="setting-item">
          <label className="setting-label" title={labels.terms.municipalTax.desc.sv}>
            Total kommunalskatt
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={settings.municipalTax.toFixed(2)}
              onChange={(e) => updateSetting('municipalTax', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              max="100"
              disabled={!!settings.kommun}
            />
            <span className="suffix">%</span>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.churchMember}
              onChange={(e) => handleChurchMemberChange(e.target.checked)}
            />
            <span>Medlem i kyrkan{settings.kommun ? ` (+ ${settings.churchTax.toFixed(2)}%)` : ''}</span>
          </label>
        </div>

        <div className="setting-item">
          <label className="setting-label" title={labels.terms.marginalTaxRate.desc.sv}>
            {labels.terms.marginalTaxRate.sv}
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={settings.marginalTaxRate}
              onChange={(e) => updateSetting('marginalTaxRate', parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="100"
            />
            <span className="suffix">%</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label" title={labels.terms.employerContribution.desc.sv}>
            {labels.terms.employerContribution.sv}
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={(settings.regionalSupport ? settings.employerContribution - 10 : settings.employerContribution).toFixed(2)}
              onChange={(e) => {
                const displayValue = parseFloat(e.target.value) || 0;
                const actualValue = settings.regionalSupport ? displayValue + 10 : displayValue;
                updateSetting('employerContribution', actualValue);
              }}
              step="0.01"
              min="0"
              max="100"
            />
            <span className="suffix">%</span>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.regionalSupport}
              onChange={(e) => handleRegionalSupportChange(e.target.checked)}
            />
            <span title={labels.terms.regionalSupport.desc.sv}>Regionalt stöd</span>
          </label>
        </div>

        <div className="setting-item">
          <label className="setting-label" title={labels.terms.ibb.desc.sv}>
            {labels.terms.ibb.sv}
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={settings.ibb}
              onChange={(e) => updateSetting('ibb', parseFloat(e.target.value) || 0)}
              step="1000"
              min="0"
            />
            <span className="suffix">kr</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            Bolagsskatt
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={settings.corporateTax}
              onChange={(e) => updateSetting('corporateTax', parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="100"
            />
            <span className="suffix">%</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            Aktiernas anskaffningsvärde
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={settings.shareAcquisitionValue}
              onChange={(e) => updateSetting('shareAcquisitionValue', parseFloat(e.target.value) || 0)}
              step="5000"
              min="0"
            />
            <span className="suffix">kr</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label" title={labels.terms.equityOpening.desc.sv}>
            {labels.terms.equityOpening.sv} (år 1)
          </label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={settings.openingFreeEquity}
              onChange={(e) => updateSetting('openingFreeEquity', parseFloat(e.target.value) || 0)}
              step="10000"
              min="0"
            />
            <span className="suffix">kr</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">
            Antal år att simulera
          </label>
          <select
            value={settings.numberOfYears}
            onChange={(e) => updateSetting('numberOfYears', parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} år
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
