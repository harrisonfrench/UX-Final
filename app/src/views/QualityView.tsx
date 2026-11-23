import { BarChart, DataTable, LineChart, type LegendItem } from '../components/Charts';
import { ChartCard } from '../components/ChartCard';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import { orgMedianSeries, windowed, windowLabels } from '../data/metrics';
import { TEAM_DATA, teamName, type TeamId } from '../data/teams';
import { useNav } from '../hooks/useNav';

const TRIO: LegendItem[] = [
  { label: 'This team', color: 'var(--series)' },
  { label: 'Org median', color: 'var(--median)', dashed: true },
  { label: 'Target', color: 'var(--target)', dashed: true },
];

export function QualityView({ team }: { team: TeamId }) {
  const { period } = useNav();
  const d = TEAM_DATA[team];
  const sprints = windowLabels('sprint', period);
  const months = windowLabels('month', period);
  const pipe = windowed(d.pipe, 'sprint', period);
  const cov = windowed(d.cov, 'sprint', period);
  const esc = windowed(d.esc, 'month', period);
  const cfr = windowed(d.cfr, 'month', period);
  const pct = (v: number) => `${v}%`;
  const last = (a: number[]) => a[a.length - 1];

  return (
    <>
      <PageHeader title={`Quality & stability · ${teamName(team)}`} subtitle="Is quality getting better or worse, and are changes shipping safely?" teamTabs />
      <div className="grid-4">
        <KpiCard kpi="pipe" team={team} /><KpiCard kpi="cov" team={team} /><KpiCard kpi="esc" team={team} /><KpiCard kpi="cfr" team={team} />
      </div>
      <div className="grid-2">
        {/* Q1: Dexter-named metrics with targets */}
        <ChartCard title="CI/CD pipeline pass rate" subtitle="Passed runs on main, per sprint" kpi="pipe" legend={TRIO}
          table={<DataTable columns={['Sprint', 'This team', 'Org median']} rows={sprints.map((s, i) => [s, pct(pipe[i]), pct(orgMedianSeries('pipe', period)[i])])} />}>
          <LineChart labels={sprints} min={70} max={100} ticks={[70, 85, 100]} format={pct} target={{ value: 90, label: 'Target 90%' }}
            ariaLabel={`Pipeline pass rate per sprint, from ${pipe[0]}% to ${last(pipe)}%. Target 90%.`}
            series={[
              { name: 'Org median', values: orgMedianSeries('pipe', period), color: 'var(--median)', dash: '2 3' },
              { name: 'This team', values: pipe, color: 'var(--series)', endLabel: pct(last(pipe)), endBelow: last(pipe) < 90 },
            ]} />
        </ChartCard>
        <ChartCard title="Unit test coverage" subtitle="Coverage on new code, per sprint" kpi="cov" legend={TRIO}
          table={<DataTable columns={['Sprint', 'This team', 'Org median']} rows={sprints.map((s, i) => [s, pct(cov[i]), pct(orgMedianSeries('cov', period)[i])])} />}>
          <LineChart labels={sprints} min={60} max={100} ticks={[60, 80, 100]} format={pct} target={{ value: 80, label: 'Target 80%' }}
            ariaLabel={`Unit test coverage per sprint, from ${cov[0]}% to ${last(cov)}%. Target 80%.`}
            series={[
              { name: 'Org median', values: orgMedianSeries('cov', period), color: 'var(--median)', dash: '2 3' },
              { name: 'This team', values: cov, color: 'var(--series)', endLabel: pct(last(cov)), endBelow: last(cov) < 80 },
            ]} />
        </ChartCard>
      </div>
      <div className="grid-2">
        {/* Q2: escaped defects */}
        <ChartCard title="Escaped defects" subtitle="Bugs found after release, per month" kpi="esc" legend={[{ label: 'Target', color: 'var(--target)', dashed: true }]}
          table={<DataTable columns={['Month', 'Escaped defects']} rows={months.map((m, i) => [m, esc[i]])} />}>
          <BarChart labels={months} values={esc} max={6} ticks={[0, 3, 6]} target={{ value: 2, label: 'Target ≤2' }} barMax={40}
            ariaLabel={`Escaped defects per month, latest ${last(esc)}. Target 2 or fewer.`} />
        </ChartCard>
        {/* Q3: change failure rate keeps speed honest */}
        <ChartCard title="Change failure rate" subtitle="Deployments needing a hotfix or rollback, per month" kpi="cfr" legend={TRIO}
          table={<DataTable columns={['Month', 'This team', 'Org median']} rows={months.map((m, i) => [m, pct(cfr[i]), pct(orgMedianSeries('cfr', period)[i])])} />}>
          <LineChart labels={months} min={0} max={30} ticks={[0, 15, 30]} format={pct} target={{ value: 15, label: 'Target 15%' }}
            ariaLabel={`Change failure rate per month, latest ${last(cfr)}%. Target 15% or lower.`}
            series={[
              { name: 'Org median', values: orgMedianSeries('cfr', period), color: 'var(--median)', dash: '2 3' },
              { name: 'This team', values: cfr, color: 'var(--series)', endLabel: pct(last(cfr)) },
            ]} />
        </ChartCard>
      </div>
    </>
  );
}
