# Data layer

Everything the screens show comes from three files:

- `teams.ts` — **sample data** for 3 fictional teams. Shape: `TeamMetrics`.
- `kpis.ts` — the 9 KPI definitions (targets, formulas, sources, gaming guards).
- `metrics.ts` — pure functions that turn data into status, change, org median and the Needs attention order.

## Moving to real data (implementation plan, phase 2+)
Replace `TEAM_DATA` with values computed from 402 SWEG's own tools. Each field maps to one source:

| Field | Source | How |
|---|---|---|
| `commit`, `burn`, `cycle`, `cycleBySize`, `aging`, `unpl`, `unplBySource` | Jira | Sprint reports, status history, scope-change events, labels on added items |
| `pipe`, `cfr` | GitLab | Pipeline runs on main; deployments + linked incident issues |
| `cov` | SonarQube | Coverage on new code per analysis |
| `esc` | Jira | Bugs with an affected released version, per month |
| `pulse`, `pulseByQuestion`, `pulseResponses` | Quarterly anonymous survey | Hide results under 5 responses |

Keep the same `TeamMetrics` shape so no view has to change. Never add per-person fields.
