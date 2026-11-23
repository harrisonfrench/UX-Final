# Survey results

Two Google Forms built from all three teams' questions and sent by the Product Owner. Pulled Nov 17, 2026.
**Developers: n = 7. Team Leaders / Project Managers: n = 4.** Small samples, so treat as direction, not proof.

## Combined (n = 11)
| Question | Result |
|---|---|
| Main device | Laptop 7, desktop 4, tablet 0, phone 0 |
| Most useful format | Summary cards + interactive charts 8 (all 4 leads, 4 of 7 devs); summary cards only 2; line charts 1; bar charts 0; tables 0 |
| Expected load time | Under 1 s: 2 · 1–3 s: 7 · 3–5 s: 1 · over 5 s: 1 |
| Top KPIs (pick up to 3) | Meeting deadlines 8 · Team collaboration and well-being 8 · Sprint progress/burndown 7 · Defect rates/software quality 3 · Unit test coverage 2 · Lead time 1 · CI/CD pass rate 1 · Stability/recovery 1 · Deployment frequency 0 |
| Concern that metrics get misread or gamed (1–5) | Mean 3.27 (devs 3.29, leads 3.25). 1: 2 · 2: 0 · 3: 4 · 4: 3 · 5: 2 |

## Developers (n = 7)
| Question | Result |
|---|---|
| How often they review performance | Daily 1 · several times a week 2 · weekly 3 · monthly 0 · less often 1 |
| Top KPIs | Burndown 6 · meeting deadlines 5 · team well-being 5 · unit test coverage 2 · lead time 1 · CI/CD 1 · stability 1 · deployment frequency 0 · defect rates 0 |
| Usefulness of comparing time periods (1–5) | 3: 2 · 4: 3 · 5: 2 → mean 4.0 |

Open answers (verbatim):
- **Unproductive or misleading KPIs:** "Story Points"; "Quality Checks: act as gatekeepers to ensure software quality."
- **What they use instead of KPIs:** "N/A"; "We use KIPs"; "The dashboard"
- **How they measure success:** "if the story gets done in quick manner and meets the standards of the team"; "ADO Dashboards"; "learning, understanding, progressing and completing tasks in reasonable time."; "product backlog"
- **How they notice work falling behind:** "if you aren't meeting sprint deadlines"; "User Story burn down and User Story's not being at a certain state by a certain time."; "When tasks are not getting finished during sprints"; resolve by finding the hold-up, getting help, searching online.
- **When they need KPIs:** "need them for appraisals"; "when working and not working"; "When I am testing code"
- **Questions the dashboard should answer:** nothing usable ("very vague", "no comment now", "I do not know").

## Team Leaders / PMs (n = 4)
| Question | Result |
|---|---|
| Role | Team leader 3 · supervisor 1 · PM 0 |
| Device | Desktop 2 · laptop 2 |
| Review frequency | Several times a week 2 · weekly 1 · less often 1 |
| Biggest challenge | Info spread across systems 1 · metrics don't represent performance 1 · trends hard to see 1 · "metrics don't represent performance & data incomplete (we don't have a standard method to determine performance)" 1 |
| Share results with | Senior leadership 4 · own team 2 · clients 1 · other PMs/leads 0 |
| Top KPIs | Meeting deadlines 3 · defect rates/quality 3 · team well-being 3 · burndown 1 |
| Decisions to support | Spot problems before they get serious 3 · bottlenecks 2 · software quality 2 · resource allocation 1 · process improvement 1 · sprint progress 0 · trends over time 0 |
| Format | Summary cards + interactive charts 4 of 4 |
| Load time | 1–3 s: 3 · over 5 s: 1 |
| Years in software | 3–5: 1 · 6–10: 3 |
| Years leading | 1–3: 2 · 4–6: 2 |
| Background | Software developer 3 · DevSecOps 1 |
| Position / work mode | Civilian 4 · on-site 4 |
| People led | 1–5: 2 · 6–10: 1 · 11–20: 1 |
| Hours a week on performance tracking | Under 1: 1 · 1–3: 1 · 3–5: 2 |
| Comfort with data and dashboards (1–5) | 5 for all 4 |
| Age / gender (optional) | 25–34: 3, 35–44: 1 · man 2, woman 1 |

Open answers (verbatim or close):
- **Tools:** GitLab (version control, merge requests, code progress, test and pipeline pass/fail); Jira (stories, sprints, features, epics, story points, velocity, capacity, task complexity and time); SonarQube (code quality, code smells).
- **Reporting today:** "Without a current dashboard, I discuss team performance with my project leads… minimal for high level overview, but can become extensive if I need to get 'into the weeds'"; "Look at sprint board and completed tasks, look at backlog"; "jira dashboards"; monthly report to leadership on major task completion, blockers, risks, funding, headcount — "we report the progress of the project, not the performance of individuals."
- **Successful cycle:** accurate estimates and finishing committed points "without cramming or finishing very early… a burndown chart would be effective for a quick glance"; % completion for milestones; "All tasks on sprint board are complete"; merge requests reviewed by multiple people, formatting and code-quality standards, unit tests added.
- **Goals:** remove bottlenecks and allocate resources; manage scope and team performance; design technical solutions; meet customer requirements.
- **Questions the dashboard should answer:** current % complete of the project; noticeable bottlenecks; where to improve the process; "individual performance trends and clearer team performance trends"; which non-project tasks (training, admin, meetings, demos) hurt development and how much time they take; "average development time of a task with X complexity".

## What we did with it
See the table in the Sprint 2 deliverable (Google Doc) and annotations L1–G2 on the Figma lo-fi wireframes.
Individual performance trends were **rejected**: the brief allows team-level data only.
