import { BarChart, DataTable, HBarChart, LineChart } from '../components/Charts';
import { ChartCard } from '../components/ChartCard';
import { Icon } from '../components/Icon';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import { windowed, windowLabels } from '../data/metrics';
import { PULSE_QUESTIONS, SURVEYS, TEAM_DATA, UNPLANNED_SOURCES, teamName, type TeamId } from '../data/teams';
import { useNav } from '../hooks/useNav';

export function HealthView({ team }: { team: TeamId }) {
  const { period } = useNav();
  const d = TEAM_DATA[team];
  const surveys = SURVEYS.map((s) => `${s} ’26`);
  const pulseLast = d.pulse[d.pulse.length - 1];
  const sprints = windowLabels('sprint', period);
  const unpl = windowed(d.unpl, 'sprint', period);
  const bySource = UNPLANNED_SOURCES.map((s, i) => ({ label: s, value: d.unplBySource[i] })).sort((a, b) => b.value - a.value);

  return (
    <>
      <PageHeader title={`Team health · ${teamName(team)}`} subtitle="Is the team’s workload sustainable, and what is pulling time away from planned work?" teamTabs />
      <div className="grid-3">
        <KpiCard kpi="pulse" team={team} />
        <KpiCard kpi="unpl" team={team} />
        {/* H1: anonymous, 5+ responses, never used for appraisals */}
        <section className="card" style={{ padding: 16, gap: 8 }} aria-labelledby="privacy">
          <h2 className="card-title" id="privacy" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="lock" />How pulse data is protected
          </h2>
          <p style={{ margin: 0, fontSize: 13, lineHeight: '18px', color: 'var(--ink-2)' }}>
            Anonymous, quarterly, 4 questions. Results appear only when 5 or more people answer ({d.pulseResponses} answered in Nov). Never used for appraisals.
          </p>
        </section>
      </div>
      <div className="grid-2">
        <ChartCard title="Team pulse score" subtitle="Average of 4 questions, 1–5, per quarterly survey" kpi="pulse" legend={[{ label: 'Target', color: 'var(--target)', dashed: true }]}
          table={<DataTable columns={['Survey', 'Pulse score']} rows={surveys.map((s, i) => [s, d.pulse[i].toFixed(1)])} />}>
          <LineChart labels={surveys} min={1} max={5} ticks={[1, 3, 5]} format={(v) => v.toFixed(1)} target={{ value: 4, label: 'Target 4.0' }}
            ariaLabel={`Pulse score per survey, latest ${pulseLast.toFixed(1)} of 5. Target 4.0.`}
            series={[{ name: 'Pulse score', values: d.pulse, color: 'var(--series)', endLabel: pulseLast.toFixed(1), endBelow: pulseLast < 4 }]} />
        </ChartCard>
        <ChartCard title="Pulse by question" subtitle="Nov 2026 survey, 1–5 scale">
          <HBarChart items={PULSE_QUESTIONS.map((q, i) => ({ label: q, value: d.pulseByQuestion[i] }))} max={5} format={(v) => v.toFixed(1)}
            ariaLabel={`Pulse by question: ${PULSE_QUESTIONS.map((q, i) => `${q} ${d.pulseByQuestion[i]}`).join(', ')}.`} />
        </ChartCard>
      </div>
      <div className="grid-2">
        <ChartCard title="Unplanned work" subtitle="Work added after sprint planning, % of sprint, per sprint" kpi="unpl" legend={[{ label: 'Target', color: 'var(--target)', dashed: true }]}
          table={<DataTable columns={['Sprint', 'Unplanned work']} rows={sprints.map((s, i) => [s, `${unpl[i]}%`])} />}>
          <BarChart labels={sprints} values={unpl} max={40} ticks={[0, 20, 40]} format={(v) => `${v}%`} target={{ value: 20, label: 'Target ≤20%' }}
            ariaLabel={`Unplanned work per sprint, latest ${unpl[unpl.length - 1]}%. Target 20% or lower.`} />
        </ChartCard>
        {/* H2: unplanned work by source */}
        <ChartCard title="Where unplanned work came from" subtitle="Sprint 23, % of sprint by source">
          <HBarChart items={bySource} max={15} format={(v) => `${v}%`}
            ariaLabel={`Unplanned work by source: ${bySource.map((s) => `${s.label} ${s.value}%`).join(', ')}.`} />
        </ChartCard>
      </div>
    </>
  );
}
