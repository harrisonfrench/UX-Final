import { useId, useState, type ReactNode } from 'react';
import { KPIS, type KpiId } from '../data/kpis';
import { Legend, type LegendItem } from './Charts';
import { useDialogs } from './DialogContext';
import { Icon } from './Icon';

interface Props {
  title: string;
  subtitle: string;
  kpi?: KpiId;
  legend?: LegendItem[];
  children: ReactNode;
  /** Same data as a table, for screen readers and anyone who prefers numbers. */
  table?: ReactNode;
}

export function ChartCard({ title, subtitle, kpi, legend, children, table }: Props) {
  const { openKpi } = useDialogs();
  const [showTable, setShowTable] = useState(false);
  const id = useId();
  return (
    <section className="card" aria-labelledby={id}>
      <div className="card-head">
        <div className="card-head-text">
          <h2 className="card-title" id={id}>{title}</h2>
          <p className="card-sub">{subtitle}</p>
        </div>
        {table && (
          <button className="chart-toggle" onClick={() => setShowTable((s) => !s)} aria-pressed={showTable}>
            {showTable ? 'Show chart' : 'Show table'}
          </button>
        )}
        {kpi && (
          <button className="icon-btn" onClick={() => openKpi(kpi)} aria-label={`What is ${KPIS[kpi].name}?`}>
            <Icon name="info" />
          </button>
        )}
      </div>
      {legend && !showTable && <Legend items={legend} />}
      {showTable && table ? table : children}
    </section>
  );
}
