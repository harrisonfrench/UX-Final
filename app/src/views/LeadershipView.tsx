import { Link } from 'react-router-dom';
import { KPIS, KPI_GROUPS, KPI_ORDER } from '../data/kpis';
import { attentionItems, latestValue, orgMedianLatest, shortValue, statusOf, valueParts } from '../data/metrics';
import { TEAMS, teamName } from '../data/teams';
import { pathFor, useNav } from '../hooks/useNav';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { StatusChip } from '../components/StatusChip';

export function LeadershipView() {
  const { period } = useNav();
  const items = attentionItems();

  return (
    <>
      <PageHeader
        title="Leadership overview"
        subtitle="Status of every team on all 9 KPIs. Select a team to see its trends."
        exportButton="primary"
      />

      {/* L4: Needs attention first (leads' top decision: spot problems early). */}
      <section className="card" aria-labelledby="attn">
        <div className="card-head-text">
          <h2 className="card-title" id="attn">Needs attention</h2>
          <p className="card-sub">KPIs off target or on watch, worst first. Select one to open the team’s drill-down.</p>
        </div>
        <ul className="attention-list">
          {items.map((it) => {
            const k = KPIS[it.kpi];
            const [num, unit] = valueParts(it.kpi, it.team);
            return (
              <li key={it.team + it.kpi}>
                <Link className="attention-row" to={pathFor(k.view, it.team, period)}>
                  <StatusChip status={it.status} />
                  <span className="what">{teamName(it.team)} · {k.name}</span>
                  <span className="detail">{num}{unit ? ` ${unit}` : ''} (target {k.targetLabel.toLowerCase()})</span>
                  <Icon name="arrow" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* L1: teams A–Z, no ranking. L2: icon + word + color. L3: org median row. */}
      <section className="card" aria-labelledby="grid">
        <div className="card-head-text">
          <h2 className="card-title" id="grid">All teams at a glance</h2>
          <p className="card-sub">Latest value and status. Teams are listed A–Z. This is not a ranking.</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table status-grid">
            <thead>
              <tr className="group-row">
                <th scope="col" aria-hidden />
                {KPI_GROUPS.map((g) => <th key={g.group} colSpan={g.kpis.length} scope="colgroup">{g.group}</th>)}
              </tr>
              <tr>
                <th scope="col">Team</th>
                {KPI_ORDER.map((k) => <th key={k} scope="col">{KPIS[k].name}</th>)}
              </tr>
            </thead>
            <tbody>
              {TEAMS.map((t) => (
                <tr key={t.id}>
                  <th scope="row" className="team-cell" style={{ background: 'none', fontSize: 14 }}>
                    <Link to={pathFor('overview', t.id, period)}>{t.name}<Icon name="arrow" size={14} /></Link>
                  </th>
                  {KPI_ORDER.map((k) => (
                    <td key={k}>
                      <span className="cell-value">{shortValue(k, latestValue(k, t.id))}</span>
                      <StatusChip status={statusOf(k, t.id)} small />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="median-row">
                <th scope="row" style={{ background: 'var(--subtle)', fontSize: 13 }}>Org median</th>
                {KPI_ORDER.map((k) => <td key={k}>{shortValue(k, orgMedianLatest(k))}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="legend-row">
          <StatusChip status={0} small /><StatusChip status={1} small /><StatusChip status={2} small />
          <span className="footnote">Status is always shown with an icon and a word, never color alone.</span>
        </div>
      </section>
    </>
  );
}
