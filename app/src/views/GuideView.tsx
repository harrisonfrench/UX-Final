import { KPIS, KPI_ORDER, REJECTED_METRICS } from '../data/kpis';
import { PageHeader } from '../components/PageHeader';

/** G1: every KPI documented. G2: rejected metrics and why. */
export function GuideView() {
  return (
    <>
      <PageHeader title="KPI guide" subtitle="What each KPI means, how it is calculated, and how it could be gamed. Every KPI is team-level only." periodToggle={false} />
      <section className="card" style={{ padding: 8 }} aria-label="KPI definitions">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '15%' }}>KPI</th>
              <th scope="col" style={{ width: '27%' }}>Definition and formula</th>
              <th scope="col" style={{ width: '12%' }}>Source</th>
              <th scope="col" style={{ width: '19%' }}>Decision it supports</th>
              <th scope="col" style={{ width: '9%' }}>Target</th>
              <th scope="col">Gaming risk and guard</th>
            </tr>
          </thead>
          <tbody>
            {KPI_ORDER.map((id) => {
              const k = KPIS[id];
              return (
                <tr key={id}>
                  <th scope="row" style={{ background: 'none', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{k.name}</div>
                    <div style={{ fontWeight: 400, fontSize: 12, color: 'var(--ink-2)' }}>{k.group}</div>
                  </th>
                  <td><div style={{ fontSize: 13 }}>{k.definition}</div><div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>{k.formula}</div></td>
                  <td style={{ fontSize: 13 }}>{k.source}</td>
                  <td style={{ fontSize: 13 }}>{k.question}</td>
                  <td style={{ fontSize: 13 }}>{k.targetLabel}</td>
                  <td style={{ fontSize: 13 }}>{k.gaming}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="card" aria-labelledby="rejected">
        <div className="card-head-text">
          <h2 className="card-title" id="rejected">Metrics we chose not to show</h2>
          <p className="card-sub">Each was considered and rejected for a reason.</p>
        </div>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '300px 1fr', rowGap: 12, columnGap: 12 }}>
          {REJECTED_METRICS.map((r) => (
            <div key={r.name} style={{ display: 'contents' }}>
              <dt style={{ fontWeight: 600 }}>{r.name}</dt>
              <dd style={{ margin: 0, color: 'var(--ink-2)' }}>{r.reason}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
