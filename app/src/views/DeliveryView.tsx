import { BarChart, DataTable, HBarChart, LineChart } from '../components/Charts';
import { ChartCard } from '../components/ChartCard';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { idealRemaining, windowed, windowLabels } from '../data/metrics';
import { CURRENT_SPRINT, STORY_SIZES, TEAM_DATA, teamName, type TeamId } from '../data/teams';
import { useNav } from '../hooks/useNav';

export function DeliveryView({ team }: { team: TeamId }) {
  const { period } = useNav();
  const d = TEAM_DATA[team];
  const days = Array.from({ length: CURRENT_SPRINT.length + 1 }, (_, i) => `D${i}`);
  const ideal = idealRemaining(team);
  const top = Math.ceil(d.burn.scope / 10) * 10;
  const sprints = windowLabels('sprint', period);
  const commit = windowed(d.commit, 'sprint', period);
  const cycle = windowed(d.cycle, 'sprint', period);
  const cycleTop = Math.max(10, Math.ceil(Math.max(...cycle) + 1));
  const sizes = d.cycleBySize.map((v) => Math.round(v * (period === 12 ? 0.97 : 1) * 10) / 10);
  const left = d.burn.remaining[d.burn.remaining.length - 1];
  const byStatus = d.aging.reduce<Record<string, number>>((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {});
  const [topStatus, topCount] = Object.entries(byStatus).sort((a, b) => b[1] - a[1])[0] ?? ['', 0];

  return (
    <>
      <PageHeader title={`Delivery · ${teamName(team)}`} subtitle="Is the team meeting its sprint commitments, and where is work slowing down?" teamTabs />
      <div className="grid-3">
        <KpiCard kpi="commit" team={team} /><KpiCard kpi="burn" team={team} /><KpiCard kpi="cycle" team={team} />
      </div>
      <div className="grid-2">
        {/* D1: burndown with ideal line */}
        <ChartCard title={`${CURRENT_SPRINT.name} burndown`} subtitle={`Remaining story points, day ${CURRENT_SPRINT.day} of ${CURRENT_SPRINT.length}`} kpi="burn"
          legend={[{ label: 'Remaining', color: 'var(--series)' }, { label: 'Ideal', color: 'var(--median)', dashed: true }]}
          table={<DataTable columns={['Day', 'Remaining', 'Ideal']} rows={days.map((dd, i) => [dd, d.burn.remaining[i] ?? '—', Math.round(ideal[i] * 10) / 10])} />}>
          <LineChart labels={days} min={0} max={top} ticks={[0, top / 2, top]} ariaLabel={`Burndown: ${left} points left on day ${CURRENT_SPRINT.day} of ${d.burn.scope}.`}
            series={[
              { name: 'Ideal', values: ideal, color: 'var(--median)', dash: '4 3' },
              { name: 'Remaining', values: d.burn.remaining, color: 'var(--series)', endLabel: `${left} pts left`, endRight: true },
            ]} />
        </ChartCard>
        {/* D2: commitment met vs 85% target */}
        <ChartCard title="Sprint commitment met" subtitle="% of committed work items done, per sprint" kpi="commit"
          legend={[{ label: 'Target', color: 'var(--target)', dashed: true }]}
          table={<DataTable columns={['Sprint', 'Commitment met']} rows={sprints.map((s, i) => [s, `${commit[i]}%`])} />}>
          <BarChart labels={sprints} values={commit} max={100} ticks={[0, 50, 100]} format={(v) => `${v}%`} target={{ value: 85, label: 'Target 85%' }}
            ariaLabel={`Commitment met per sprint, latest ${commit[commit.length - 1]}%. Target 85%.`} />
        </ChartCard>
      </div>
      <div className="grid-2">
        <ChartCard title="Cycle time trend" subtitle="Median days from In Progress to Done, per sprint" kpi="cycle"
          legend={[{ label: 'Team', color: 'var(--series)' }, { label: 'Target', color: 'var(--target)', dashed: true }]}
          table={<DataTable columns={['Sprint', 'Median days']} rows={sprints.map((s, i) => [s, cycle[i].toFixed(1)])} />}>
          <LineChart labels={sprints} min={0} max={cycleTop} ticks={[0, cycleTop / 2, cycleTop]} format={(v) => `${v} d`} target={{ value: 5, label: 'Target 5 d' }}
            ariaLabel={`Median cycle time per sprint, latest ${cycle[cycle.length - 1]} days. Target 5 days.`}
            series={[{ name: 'Median cycle time', values: cycle, color: 'var(--series)', endLabel: `${cycle[cycle.length - 1].toFixed(1)} d`, endBelow: cycle[cycle.length - 1] < 5 && cycle[cycle.length - 1] > 4 }]} />
        </ChartCard>
        {/* D3: cycle time by story size */}
        <ChartCard title="Cycle time by story size" subtitle={`Average days per item, last ${period} sprints. Use it to plan work of a given size.`}>
          <HBarChart items={STORY_SIZES.map((s, i) => ({ label: s, value: sizes[i] }))} max={Math.max(18, sizes[3])} format={(v) => `${v.toFixed(1)} d`}
            ariaLabel={`Average cycle time: ${STORY_SIZES.map((s, i) => `${s} ${sizes[i]} days`).join(', ')}.`} />
        </ChartCard>
      </div>
      {/* D4: aging work items, no assignee column */}
      <section className="card" aria-labelledby="aging">
        <div className="card-head-text">
          <h2 className="card-title" id="aging">Work items stuck more than 5 days</h2>
          <p className="card-sub">Possible bottlenecks in the current sprint. Team-level view: no assignee shown.</p>
        </div>
        <table className="table">
          <thead><tr><th scope="col">Item</th><th scope="col">Title</th><th scope="col">Status</th><th scope="col">Days in status</th></tr></thead>
          <tbody>
            {d.aging.map((a) => (
              <tr key={a.id}>
                <td className="mono">{a.id}</td>
                <td>{a.title}</td>
                <td>{a.status}</td>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {a.days >= 8 && <span style={{ color: 'var(--warn-fg)', display: 'inline-flex' }}><Icon name="warn" size={14} label="Over a week" /></span>}
                    {a.days} days
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>
          {topCount > 1 ? `${topCount} of ${d.aging.length} stuck items are waiting in ${topStatus}.` : 'No status has more than one stuck item.'}
        </p>
      </section>
    </>
  );
}
