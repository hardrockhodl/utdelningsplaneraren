import { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { GlobalSettings, YearCalculation } from '../types';
import { exportToCSV } from '../lib/calculations';

interface DebugViewProps {
  settings: GlobalSettings;
  years: YearCalculation[];
}

export function DebugView({ settings, years }: DebugViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExportCSV = () => {
    const csv = exportToCSVTransposed(settings, years);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = `utdelningsplan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  
    URL.revokeObjectURL(url);
  };

  const data = { settings, years };

  return (
    <div className="debug-view">
      <div className="debug-header">
        <button onClick={() => setIsExpanded(!isExpanded)} className="debug-toggle">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <span>Debug / Beräkningar (JSON)</span>
        </button>
        <button onClick={handleExportCSV} className="export-button">
          <Download size={18} />
          <span>Exportera CSV</span>
        </button>
      </div>

      {isExpanded && (
        <pre className="debug-content">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
