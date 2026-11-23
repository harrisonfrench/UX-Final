# Project brief

Source: *CBIS 4230 / 5230 Fall 2026 Final Project Instructions* (GeorgiaView; copy in `docs/course/`).

## The client and problem
402 SWEG wants a central dashboard that shows leadership how its software teams perform and how that changes over time.
Product Owner's words: quick-glance data on measurable benchmarks and KPIs for project managers and team leaders to
assess **team** performance (not individual), revealing trends and informing changes in productivity and efficiency.
His main problem is choosing KPIs: lines of code is easy to count but says nothing about quality. Metrics he named:
burndown charts, CI/CD pipeline pass/fail rates, unit test coverage.

## Rules
- The metrics are the hardest part. A beautiful dashboard with the wrong numbers will not win.
- Team level only. No rankings, leaderboards or per-person views.
- Avoid vanity metrics. Every KPI explains the decision it supports.
- Quick glance, then trends.
- Two audiences: PMs and team leaders assess teams; leadership gets visibility across teams.

## Required scope
| Item | Amount |
|---|---|
| Comparable dashboards reviewed | 3 (done: GitLab Value Streams, Azure DevOps, Swarmia) |
| KPI framework | 6–10 team-level KPIs (we have 9) with KPI, formula, data source, question it answers, benchmark/target, risk of gaming |
| Personas / journey maps | 2 / 1 |
| Wireframes | 4–6 dashboard views (we have 6) |
| Prototype | Fully functional in Figma, all KPIs, sample data, every view/filter/drill-down works, WCAG 2.2 AA |
| Guerrilla usability tests | 5, 10–15 min, 3 tasks from personas |
| Final report | 15–20 pages + appendices |
| Final presentation | 15 min + 5 min Q&A, Thu Dec 3, every member presents, live demo |

## Sprints and due dates (Sundays 11:59 PM in GeorgiaView, one submission per team)
| Due | Deliverables | Status |
|---|---|---|
| Sun Nov 1 | Charter (roles, rotation, agreement, schedule, top 5 risks), questions for Dexter, 8–10 survey questions | Done (`deliverables/`) |
| Sun Nov 8 | Kickoff summary, current-practice analysis, 3 comparable dashboards, 12–15 candidate KPIs, Trello backlog, peer eval | Done (`deliverables/`) |
| Sun Nov 15 | Survey analysis, 2 personas, 1 journey map, KPI framework v1 | Confirm with team |
| Sun Nov 22 | Structure, annotated wireframes, design system, Figma prototype, guerrilla test plan, updated backlog, peer eval | Built Nov 17 (Figma + Google Doc) |
| Mon Nov 23 / Tue Nov 24 | Sprint 2 review with Dexter: walk through prototype | |
| Thu Dec 3 (before class) | Testing report, refined prototype, final KPI framework, implementation plan, final report, slides, final backlog, peer eval | |

## Final report outline
1. Executive summary (1 p) · 2. Introduction (1–2) · 3. Research (3–4) · 4. KPI framework (3–4) ·
5. Dashboard design (3–4) · 6. Usability testing (1–2) · 7. Implementation plan (1–2) · 8. Agile reflection (1) · Appendices.

## Our charter risks
1. Picking the wrong KPIs · 2. Time constraints · 3. Delegation · 4. Not enough time to analyze the survey ·
5. KPIs can't fully show product quality.
