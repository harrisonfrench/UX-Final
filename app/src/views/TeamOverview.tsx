import { Link } from 'react-router-dom';
import { KPIS, type KpiId } from '../data/kpis';
import { attentionItems, valueParts } from '../data/metrics';
import { teamName, type TeamId } from '../data/teams';
import { pathFor, useNav } from '../hooks/useNav';
import { Icon } from '../components/Icon';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import { StatusChip } from '../components/StatusChip';

const VIEW_NAME = { delivery: 'delivery', quality: 'quality & stability', health: 'team health' } as const;

function Group({ label, kpis, team }: { label: string; kpis: KpiId[]; team: TeamId }) {
  return (
    <div>
      <h2 className="group-label">{label}</h2>
      <div className={kpis.length === 1 ? '' : kpis.length === 2 ? 'grid-2' : 'grid-3'}>
        {kpis.map((k) => <KpiCard key={k} kpi={k} team={team} />)}
      </div>
    </div>
  );
}

export function TeamOverview({ team }: { team: TeamId }) {
  const { period } = useNav();
  const items = attentionItems([team]);

  return (
    <>
      <PageHeader
        title={teamName(team)}
        subtitle="Team overview · current status of all 9 KPIs. Select a card to see its trend."
        teamTabs
        exportButton="secondary"
      />
      <div className="overview">
        {/* T2: four balanced KPI groups */}
        <div className="overview-groups">
          <Group label="Delivery" kpis={['commit', 'burn', 'cycle']} team={team} />
          <Group label="Quality" kpis={['pipe', 'cov', 'esc']} team={team} />
          <div className="overview-row-split">
            <Group label="Stability" kpis={['cfr']} team={team} />
            <Group label="Team health" kpis={['pulse', 'unpl']} team={team} />
          </div>
        </div>
        <aside className="card" aria-labelledby="attn-team">
          <div className="card-head-text">
            <h2 className="card-title" id="attn-team">Needs attention</h2>
            <p className="card-sub">Off target or on watch.</p>
          </div>
          {items.length === 0 && <p style={{ margin: 0, color: 'var(--ink-2)' }}>All 9 KPIs are on target this period.</p>}
          <ul className="attention-list">
            {items.map((it) => {
              const k = KPIS[it.kpi];
              const [num, unit] = valueParts(it.kpi, team);
              return (
                <li key={it.kpi}>
                  <div className="attention-stack">
                    <StatusChip status={it.status} />
                    <strong>{k.name}: {num}{unit ? ` ${unit}` : ''}</strong>
                    <Link className="link" to={pathFor(k.view, team, period)}>View {VIEW_NAME[k.view]} <Icon name="arrow" size={14} /></Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="footnote">Change is measured from the first sprint or month in the selected period.</p>
        </aside>
      </div>
    </>
  );
}
