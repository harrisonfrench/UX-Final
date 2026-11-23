import { Link } from 'react-router-dom';
import { KPIS, type KpiId } from '../data/kpis';
import { deltaOf, seriesFor, statusOf, valueParts } from '../data/metrics';
import type { TeamId } from '../data/teams';
import { pathFor, useNav } from '../hooks/useNav';
import { Sparkline } from './Charts';
import { useDialogs } from './DialogContext';
import { Icon } from './Icon';
import { StatusChip } from './StatusChip';

/**
 * Card anatomy (annotation T3): name + ⓘ, value, change since start of period,
 * sparkline with target, status chip and target. The whole card opens the
 * drill-down (T5); ⓘ opens the definition (T4).
 */
export function KpiCard({ kpi, team }: { kpi: KpiId; team: TeamId }) {
  const { period } = useNav();
  const { openKpi } = useDialogs();
  const k = KPIS[kpi];
  const [num, unit] = valueParts(kpi, team);
  const delta = deltaOf(kpi, team, period);
  const status = statusOf(kpi, team);
  const tone = delta.tone === 1 ? ' better' : delta.tone === 2 ? ' worse' : '';

  return (
    <article className="card kpi-card">
      <Link className="kpi-card-link" to={pathFor(k.view, team, period)} aria-label={`${k.name}: ${num} ${unit}. ${delta.text}. Open trend.`} />
      <div className="card-head" style={{ alignItems: 'center' }}>
        <span className="kpi-name">{k.name}</span>
        <button className="icon-btn" onClick={() => openKpi(kpi)} aria-label={`What is ${k.name}?`}>
          <Icon name="info" />
        </button>
      </div>
      <div className="kpi-value">
        <span className="kpi-number">{num}</span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      <span className={`delta${tone}`}>{delta.text}</span>
      <Sparkline values={seriesFor(kpi, team, period)} target={kpi === 'burn' ? undefined : k.target} />
      <div className="kpi-foot">
        <StatusChip status={status} />
        <span className="kpi-target">{k.targetLabel}</span>
      </div>
    </article>
  );
}
