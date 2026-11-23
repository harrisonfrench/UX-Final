import { KPIS, type KpiId } from '../data/kpis';
import { Icon } from './Icon';

export function KpiDialog({ kpi, onClose }: { kpi: KpiId; onClose: () => void }) {
  const k = KPIS[kpi];
  const rows: [string, string][] = [
    ['What it measures', k.definition],
    ['How it is calculated', k.formula],
    ['Data source', k.source],
    ['Question it answers', k.question],
    ['Target', kpi === 'burn' ? k.targetLabel : `${k.targetLabel} · Watch zone shown in amber`],
    ['How it could be gamed', k.gaming],
  ];
  return (
    <div className="dialog-body">
      <div className="dialog-head">
        <div style={{ flex: 1 }}>
          <p className="group-label" style={{ margin: 0 }}>{k.group}</p>
          <h2 className="dialog-title" id="dialog-title">{k.name}</h2>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
      </div>
      <dl>
        {rows.map(([dt, dd]) => (
          <div className="dialog-field" key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>
        ))}
      </dl>
      <div className="dialog-foot"><button className="btn btn-primary" onClick={onClose} autoFocus>Close</button></div>
    </div>
  );
}
