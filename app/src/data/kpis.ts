// The 9 team-level KPIs. Definitions, targets and gaming guards match the
// KPI guide in Figma and docs/kpi-framework.md. Change them in one place: here.

export type KpiId = 'commit' | 'burn' | 'cycle' | 'pipe' | 'cov' | 'esc' | 'cfr' | 'pulse' | 'unpl';
export type KpiGroup = 'Delivery' | 'Quality' | 'Stability' | 'Team health';
export type DrillView = 'delivery' | 'quality' | 'health';

export interface Kpi {
  id: KpiId;
  name: string;
  group: KpiGroup;
  /** Drill-down view that shows this KPI's trend. */
  view: DrillView;
  /** Unit shown after the value. */
  unit: string;
  /** 1 = higher is better, -1 = lower is better. */
  direction: 1 | -1;
  /** On target at or better than this. */
  target: number;
  /** Watch zone up to this; worse is Off target. */
  watch: number;
  targetLabel: string;
  /** Which series holds the trend, and whether it is per sprint or per month. */
  series?: 'commit' | 'cycle' | 'pipe' | 'cov' | 'esc' | 'cfr' | 'unpl';
  per?: 'sprint' | 'month';
  definition: string;
  formula: string;
  source: string;
  question: string;
  gaming: string;
}

export const KPIS: Record<KpiId, Kpi> = {
  commit: {
    id: 'commit', name: 'Sprint commitment met', group: 'Delivery', view: 'delivery', unit: '%', direction: 1,
    target: 85, watch: 75, targetLabel: '≥85%', series: 'commit', per: 'sprint',
    definition: 'Share of work items committed at sprint planning that are done by the end of the sprint.',
    formula: 'Committed items completed ÷ committed items at sprint start × 100. Counts items, not story points.',
    source: 'Jira sprint report',
    question: 'Is the team planning realistically and meeting its sprint deadlines?',
    gaming: 'Committing to less work to hit 100%. Guard: show alongside scope trend and unplanned work; review in retros, never compare teams.',
  },
  burn: {
    id: 'burn', name: 'Sprint burndown', group: 'Delivery', view: 'delivery', unit: ' pts', direction: -1,
    target: 0.1, watch: 0.2, targetLabel: 'Within 10% of ideal',
    definition: 'Remaining story points in the current sprint compared with an ideal straight-line burn.',
    formula: 'Remaining points − ideal remaining points for today. On track when the gap is within 10% of sprint scope.',
    source: 'Jira sprint board',
    question: 'Will the team finish this sprint, and should we cut scope or remove a blocker now?',
    gaming: 'Closing tickets early or splitting them late to make the line look good. Guard: pair with commitment met % and escaped defects.',
  },
  cycle: {
    id: 'cycle', name: 'Cycle time', group: 'Delivery', view: 'delivery', unit: ' days', direction: -1,
    target: 5, watch: 7, targetLabel: '≤5 days', series: 'cycle', per: 'sprint',
    definition: 'Median number of days a work item takes from In Progress to Done.',
    formula: 'Median(Done date − In Progress date) for items finished in the sprint, in days.',
    source: 'Jira status history',
    question: 'Where is work slowing down, and is our process getting faster or slower?',
    gaming: 'Splitting work into tiny items or moving items to Done before review. Guard: show cycle time by story size and pair with escaped defects.',
  },
  pipe: {
    id: 'pipe', name: 'CI/CD pipeline pass rate', group: 'Quality', view: 'quality', unit: '%', direction: 1,
    target: 90, watch: 85, targetLabel: '≥90%', series: 'pipe', per: 'sprint',
    definition: 'Share of pipeline runs on the main branch that pass all build and test stages.',
    formula: 'Passed pipeline runs ÷ total pipeline runs on main × 100.',
    source: 'GitLab CI/CD',
    question: 'Is the build healthy, or is broken code slowing everyone down?',
    gaming: 'Disabling or skipping failing tests. Guard: show unit test coverage and test count next to it.',
  },
  cov: {
    id: 'cov', name: 'Unit test coverage', group: 'Quality', view: 'quality', unit: '%', direction: 1,
    target: 80, watch: 75, targetLabel: '≥80% (new code)', series: 'cov', per: 'sprint',
    definition: 'Share of new or changed code lines run by unit tests.',
    formula: 'Covered lines ÷ coverable lines on new code × 100.',
    source: 'SonarQube',
    question: 'Are we adding tests as we change code, so defects are caught early?',
    gaming: 'Tests that run code without checking results. Guard: watch escaped defects; review test quality in merge requests.',
  },
  esc: {
    id: 'esc', name: 'Escaped defects', group: 'Quality', view: 'quality', unit: '', direction: -1,
    target: 2, watch: 3, targetLabel: '≤2 per month', series: 'esc', per: 'month',
    definition: 'Bugs found after a release, by users, testers or other teams, per month.',
    formula: 'Count of bug tickets linked to a released version, per calendar month.',
    source: 'Jira (bug type + affected version)',
    question: 'Is software quality reaching the people who use it?',
    gaming: 'Logging bugs as features or not logging them. Guard: clear bug definition; trend reviewed with test team.',
  },
  cfr: {
    id: 'cfr', name: 'Change failure rate', group: 'Stability', view: 'quality', unit: '%', direction: -1,
    target: 15, watch: 20, targetLabel: '≤15%', series: 'cfr', per: 'month',
    definition: 'Share of deployments that cause a failure and need a hotfix, rollback or patch (DORA).',
    formula: 'Failed deployments ÷ total deployments × 100, per month.',
    source: 'GitLab deployments + Jira incidents',
    question: 'Are we shipping safely, or is speed breaking things?',
    gaming: 'Deploying less often or batching changes. Guard: read together with cycle time.',
  },
  pulse: {
    id: 'pulse', name: 'Team pulse score', group: 'Team health', view: 'health', unit: ' / 5', direction: 1,
    target: 4.0, watch: 3.5, targetLabel: '≥4.0',
    definition: 'Average of a 4-question anonymous survey on workload, collaboration, tools and clarity of goals (SPACE).',
    formula: 'Mean of all answers on a 1–5 scale. Shown only with 5 or more responses.',
    source: 'Quarterly anonymous survey',
    question: 'Is the team sustainable, or are we heading toward burnout?',
    gaming: 'Pressure to answer positively. Guard: anonymous, team-level only, never tied to appraisals.',
  },
  unpl: {
    id: 'unpl', name: 'Unplanned work', group: 'Team health', view: 'health', unit: '%', direction: -1,
    target: 20, watch: 25, targetLabel: '≤20%', series: 'unpl', per: 'sprint',
    definition: 'Share of sprint work that was added after sprint planning, by source.',
    formula: 'Points added after sprint start ÷ total sprint points × 100.',
    source: 'Jira sprint scope change + labels',
    question: 'How much time do meetings, training and urgent requests take from planned work?',
    gaming: 'Not logging interruptions. Guard: quick label on every added item; reviewed in retros.',
  },
};

export const KPI_ORDER: KpiId[] = ['commit', 'burn', 'cycle', 'pipe', 'cov', 'esc', 'cfr', 'pulse', 'unpl'];

export const KPI_GROUPS: { group: KpiGroup; kpis: KpiId[] }[] = [
  { group: 'Delivery', kpis: ['commit', 'burn', 'cycle'] },
  { group: 'Quality', kpis: ['pipe', 'cov', 'esc'] },
  { group: 'Stability', kpis: ['cfr'] },
  { group: 'Team health', kpis: ['pulse', 'unpl'] },
];

/** Metrics we considered and rejected, shown in the KPI guide. */
export const REJECTED_METRICS: { name: string; reason: string }[] = [
  { name: 'Lines of code', reason: 'Easy to count but says nothing about quality or usefulness (the Product Owner’s own example).' },
  { name: 'Commits or tickets per person', reason: 'Individual data is out of scope and pushes people to game the number.' },
  { name: 'Velocity or story points compared across teams', reason: 'Points are sized differently by each team; a developer named story points as misleading.' },
  { name: 'Individual performance trends', reason: 'Requested by one team lead, but the dashboard is team-level only by design.' },
  { name: 'Deployment frequency and lead time as headline KPIs', reason: '0 and 1 of 11 survey votes. Kept as possible secondary metrics for a later phase.' },
];
