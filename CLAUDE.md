# CLAUDE.md — 402 SWEG Team Metrics Dashboard

Context for Claude Code (and any agent in Antigravity). Read this first, then `docs/project-brief.md`.

## What this is
CBIS 4230 (UX & Project Management, GCSU, Fall 2026) final project. Three student teams compete to design the best
software-development metrics dashboard for the **402nd Software Engineering Group (402 SWEG), Robins AFB**.
Product Owner: **Dexter Buschor**. He picks the winner at the final presentation on **Thu Dec 3, 2026**.

Team: Adam Lively (Scrum Master, Sprints 1 & 3), Harrison French (Scrum Master, Sprint 2), Jake Stine, Anna Nguyen.

The required prototype is in **Figma** (https://www.figma.com/design/BcuKePDNVmBjOnjeKcs81o). This repo is the
**coded version** of the same design, for a live demo and to show 402 SWEG how it could actually be built.
Keep the two in sync: same views, same KPIs, same sample data, same design tokens.

## Hard rules (from the brief — do not break)
1. **Team level only.** Never show individual developer data, per-person columns, rankings or leaderboards.
   Teams are always listed A–Z. The "Needs attention" list is triage (worst status first), not a ranking.
2. **No vanity metrics.** Lines of code, commits per person and cross-team story points/velocity are rejected.
3. **Every KPI states the decision it supports** and how it could be gamed (`src/data/kpis.ts`).
4. **Quick glance, then trends.** Overview cards first, one click to the trend.
5. **Accessibility: WCAG 2.2 AA.** Text ≥ 4.5:1. Status is always **icon + word + color**, never color alone.
   Charts have an aria-label summary and a "Show table" view. Keyboard and focus states must work.
6. **Sample data is labeled as sample data.** Never present the numbers as real 402 SWEG data.
7. Desktop-first (100% of survey respondents use a laptop or desktop). Load fast (most expect 1–3 s).

## Stack and commands
- React 18 + TypeScript + Vite 5, react-router (hash routing), no chart library (hand-built SVG in `Charts.tsx`).
- Fonts: IBM Plex Sans / Mono via @fontsource (works offline).
- `cd app && npm install` then `npm run dev` (http://localhost:5173), `npm run build`, `npm run typecheck`.

## Where things live
```
app/src/
  data/teams.ts      sample data for 3 fictional teams (the "stories" each team tells)
  data/kpis.ts       the 9 KPIs: definition, formula, source, target/watch, gaming risk
  data/metrics.ts    pure logic: status, change since start of period, org median, needs-attention order
  components/        Layout (sidebar), PageHeader (team tabs + period toggle), KpiCard, StatusChip,
                     Charts (LineChart, BarChart, HBarChart, Sparkline, Legend, DataTable), ChartCard,
                     DialogContext + KpiDialog + ExportDialog (one native <dialog>)
  views/             LeadershipView, TeamOverview, DeliveryView, QualityView, HealthView, GuideView
  styles/tokens.css  design tokens (same as Figma page "3 · Design system")
  hooks/useNav.ts    URL is the state: #/team/mp/delivery?period=12
docs/                brief, survey results, KPI framework, design system, links to Figma and deliverables
```

## Routes
`#/` Leadership overview · `#/team/:team` Team overview · `#/team/:team/delivery|quality|health` drill-downs ·
`#/guide` KPI guide · `?period=12` for last 12 sprints (default 6). Team ids: `ai`, `mp`, `ts`.

## The 9 KPIs (targets are drafts for Dexter to confirm)
| Group | KPI | On target | Watch |
|---|---|---|---|
| Delivery | Sprint commitment met (items, not points) | ≥85% | 75–84% |
| Delivery | Sprint burndown gap vs ideal | within 10% of scope | 10–20% |
| Delivery | Cycle time (median days) | ≤5 | 5–7 |
| Quality | CI/CD pipeline pass rate | ≥90% | 85–89% |
| Quality | Unit test coverage (new code) | ≥80% | 75–79% |
| Quality | Escaped defects per month | ≤2 | 3 |
| Stability | Change failure rate | ≤15% | 16–20% |
| Team health | Team pulse score (anonymous, ≥5 responses) | ≥4.0 | 3.5–3.9 |
| Team health | Unplanned work | ≤20% | 21–25% |

## Sample-data stories (used by the usability test tasks — keep them true)
- **Avionics Integration:** delivery fine, quality declining (pipeline 93%→81%, coverage 81%→74% over 6 sprints).
- **Mission Planning:** delivery problems (68% commitment, 14 pts behind, 8.6-day cycle time, work stuck in
  Code Review, 31% unplanned work mostly meetings/demos + training, pulse 3.4). Listed first in Needs attention.
- **Test & Simulation:** healthy and improving.

## Conventions
- Add or change a KPI only in `data/kpis.ts` + `data/teams.ts`; views read from there. Update Figma and
  `docs/kpi-framework.md` too.
- Colors only through CSS variables in `tokens.css`. Status colors are reserved for status.
- Chart rules: one y-axis, 2px lines, bars ≤28px with 4px rounded tops, dashed labeled target line,
  direct label on the latest value only, legend when 2+ series, hover tooltip on every chart.
- Plain, short UI copy in the users' words (team leaders, PMs). No jargon, no emoji.
- Run `npm run build` before committing; it type-checks.

## Sprint 3 backlog for this code (Nov 23 – Dec 3)
1. Apply Dexter's feedback from the Sprint 2 review (Nov 23/24).
2. Fix the top problems from the 5 guerrilla usability tests (see docs/deliverables).
3. Optional: deploy to GitHub Pages for a shareable demo link (`.github/workflows/deploy.yml` is ready).
4. Optional stretch: data adapters for Jira / GitLab / SonarQube (see `app/src/data/README.md`). Not needed for the grade.
