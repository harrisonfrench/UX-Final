# KPI framework (v1, Sprint 2)

9 team-level KPIs balanced across delivery, quality, stability and team health. Generated from `app/src/data/kpis.ts` — edit there, then regenerate or update this file. Targets are drafts for Dexter to confirm at the Sprint 2 review; final version due Dec 3.

| KPI | Group | Definition | Formula | Data source | Question it answers | Target | Watch zone | Gaming risk and guard |
|---|---|---|---|---|---|---|---|---|
| Sprint commitment met | Delivery | Share of work items committed at sprint planning that are done by the end of the sprint. | Committed items completed ÷ committed items at sprint start × 100. Counts items, not story points. | Jira sprint report | Is the team planning realistically and meeting its sprint deadlines? | ≥85% | 75% to just under 85% | Committing to less work to hit 100%. Guard: show alongside scope trend and unplanned work; review in retros, never compare teams. |
| Sprint burndown | Delivery | Remaining story points in the current sprint compared with an ideal straight-line burn. | Remaining points − ideal remaining points for today. On track when the gap is within 10% of sprint scope. | Jira sprint board | Will the team finish this sprint, and should we cut scope or remove a blocker now? | Within 10% of ideal | 10–20% of scope behind | Closing tickets early or splitting them late to make the line look good. Guard: pair with commitment met % and escaped defects. |
| Cycle time | Delivery | Median number of days a work item takes from In Progress to Done. | Median(Done date − In Progress date) for items finished in the sprint, in days. | Jira status history | Where is work slowing down, and is our process getting faster or slower? | ≤5 days | above 5 up to 7 | Splitting work into tiny items or moving items to Done before review. Guard: show cycle time by story size and pair with escaped defects. |
| CI/CD pipeline pass rate | Quality | Share of pipeline runs on the main branch that pass all build and test stages. | Passed pipeline runs ÷ total pipeline runs on main × 100. | GitLab CI/CD | Is the build healthy, or is broken code slowing everyone down? | ≥90% | 85% to just under 90% | Disabling or skipping failing tests. Guard: show unit test coverage and test count next to it. |
| Unit test coverage | Quality | Share of new or changed code lines run by unit tests. | Covered lines ÷ coverable lines on new code × 100. | SonarQube | Are we adding tests as we change code, so defects are caught early? | ≥80% (new code) | 75% to just under 80% | Tests that run code without checking results. Guard: watch escaped defects; review test quality in merge requests. |
| Escaped defects | Quality | Bugs found after a release, by users, testers or other teams, per month. | Count of bug tickets linked to a released version, per calendar month. | Jira (bug type + affected version) | Is software quality reaching the people who use it? | ≤2 per month | above 2 up to 3 | Logging bugs as features or not logging them. Guard: clear bug definition; trend reviewed with test team. |
| Change failure rate | Stability | Share of deployments that cause a failure and need a hotfix, rollback or patch (DORA). | Failed deployments ÷ total deployments × 100, per month. | GitLab deployments + Jira incidents | Are we shipping safely, or is speed breaking things? | ≤15% | above 15 up to 20% | Deploying less often or batching changes. Guard: read together with cycle time. |
| Team pulse score | Team health | Average of a 4-question anonymous survey on workload, collaboration, tools and clarity of goals (SPACE). | Mean of all answers on a 1–5 scale. Shown only with 5 or more responses. | Quarterly anonymous survey | Is the team sustainable, or are we heading toward burnout? | ≥4.0 | 3.5 to just under 4 | Pressure to answer positively. Guard: anonymous, team-level only, never tied to appraisals. |
| Unplanned work | Team health | Share of sprint work that was added after sprint planning, by source. | Points added after sprint start ÷ total sprint points × 100. | Jira sprint scope change + labels | How much time do meetings, training and urgent requests take from planned work? | ≤20% | above 20 up to 25% | Not logging interruptions. Guard: quick label on every added item; reviewed in retros. |

## Rejected metrics

- **Lines of code:** Easy to count but says nothing about quality or usefulness (the Product Owner’s own example).
- **Commits or tickets per person:** Individual data is out of scope and pushes people to game the number.
- **Velocity or story points compared across teams:** Points are sized differently by each team; a developer named story points as misleading.
- **Individual performance trends:** Requested by one team lead, but the dashboard is team-level only by design.
- **Deployment frequency and lead time as headline KPIs:** 0 and 1 of 11 survey votes. Kept as possible secondary metrics for a later phase.

## Frameworks used

- DORA (change failure rate kept for stability; deployment frequency and lead time held back for a later phase): https://dora.dev/guides/dora-metrics/
- SPACE (satisfaction and well-being → team pulse score; efficiency and flow → cycle time, unplanned work): https://queue.acm.org/detail.cfm?id=3454124
- Product Owner-named metrics: burndown, CI/CD pass/fail rate, unit test coverage (all included).

