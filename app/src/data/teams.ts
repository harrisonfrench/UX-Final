// SAMPLE DATA ONLY. Team names and numbers are made up for the class prototype.
// The same numbers are used in the Figma prototype, so the two stay in sync.
// When real data arrives, replace this file with adapters (see src/data/README.md).

export type TeamId = 'ai' | 'mp' | 'ts';

export interface Team {
  id: TeamId;
  name: string;
}

/** Listed A–Z on purpose: the dashboard never ranks teams. */
export const TEAMS: Team[] = [
  { id: 'ai', name: 'Avionics Integration' },
  { id: 'mp', name: 'Mission Planning' },
  { id: 'ts', name: 'Test & Simulation' },
];

export const DATA_AS_OF = 'Nov 13, 2026';
export const DATA_SOURCES = ['Jira', 'GitLab', 'SonarQube'];
export const CURRENT_SPRINT = { name: 'Sprint 24', dates: 'Nov 9–20', day: 5, length: 10 };

/** 12 completed two-week sprints, oldest first. */
export const SPRINTS = ['S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19', 'S20', 'S21', 'S22', 'S23'];
/** 6 complete calendar months, oldest first (monthly KPIs). */
export const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
/** Quarterly pulse survey months (2026). */
export const SURVEYS = ['Feb', 'May', 'Aug', 'Nov'];

export const UNPLANNED_SOURCES = ['Urgent fixes', 'Meetings & demos', 'Training', 'Admin requests'];
export const PULSE_QUESTIONS = ['Workload', 'Collaboration', 'Tools & environment', 'Clarity of goals'];
export const STORY_SIZES = ['Small', 'Medium', 'Large', 'Extra large'];

export interface AgingItem {
  id: string;
  title: string;
  status: string;
  days: number;
}

export interface TeamMetrics {
  /** % of committed work items done, per sprint (12). */
  commit: number[];
  /** Median cycle time in days, per sprint (12). */
  cycle: number[];
  /** CI/CD pipeline pass rate %, per sprint (12). */
  pipe: number[];
  /** Unit test coverage % on new code, per sprint (12). */
  cov: number[];
  /** Escaped defects per month (6). */
  esc: number[];
  /** Change failure rate %, per month (6). */
  cfr: number[];
  /** Pulse score 1–5, per quarterly survey (4). */
  pulse: number[];
  /** Pulse score per question, latest survey (4). */
  pulseByQuestion: number[];
  /** Responses to the latest pulse survey. */
  pulseResponses: number;
  /** Unplanned work % of sprint, per sprint (12). */
  unpl: number[];
  /** Unplanned work by source, latest sprint, % of sprint (4). */
  unplBySource: number[];
  /** Current sprint burndown: scope and remaining points per day so far. */
  burn: { scope: number; remaining: number[] };
  /** Average cycle time in days by story size (S, M, L, XL). */
  cycleBySize: number[];
  /** Items stuck more than 5 days in one status. No assignee on purpose. */
  aging: AgingItem[];
}

export const TEAM_DATA: Record<TeamId, TeamMetrics> = {
  // Story: delivery is fine, quality is declining.
  ai: {
    commit: [88, 90, 86, 91, 89, 92, 90, 88, 91, 89, 90, 88],
    cycle: [4.4, 4.1, 4.3, 3.9, 4.2, 4.0, 4.1, 3.8, 4.2, 4.0, 4.3, 4.1],
    pipe: [95, 94, 95, 93, 94, 94, 93, 91, 89, 86, 84, 81],
    cov: [83, 83, 82, 82, 82, 82, 81, 80, 79, 77, 76, 74],
    esc: [1, 1, 2, 2, 3, 4],
    cfr: [8, 9, 10, 12, 15, 18],
    pulse: [4.1, 4.0, 4.0, 3.9],
    pulseByQuestion: [3.8, 4.2, 3.6, 4.0],
    pulseResponses: 9,
    unpl: [14, 15, 16, 13, 15, 14, 16, 15, 14, 16, 15, 15],
    unplBySource: [8, 3, 2, 2],
    burn: { scope: 42, remaining: [42, 39, 35, 30, 26, 22] },
    cycleBySize: [2.1, 3.8, 6.2, 9.5],
    aging: [
      { id: 'AVI-412', title: 'Update nav database parser for new file format', status: 'In Review', days: 6 },
      { id: 'AVI-398', title: 'Fix flaky display render test', status: 'In Progress', days: 7 },
    ],
  },
  // Story: delivery problems, work stuck in Code Review, lots of unplanned work.
  mp: {
    commit: [82, 80, 78, 76, 74, 73, 71, 70, 68, 69, 67, 68],
    cycle: [5.2, 5.6, 5.9, 6.3, 6.8, 7.0, 7.4, 7.9, 8.1, 8.4, 8.3, 8.6],
    pipe: [90, 91, 89, 92, 91, 90, 92, 91, 93, 92, 91, 92],
    cov: [78, 78, 79, 79, 80, 80, 80, 81, 80, 81, 81, 81],
    esc: [2, 2, 1, 2, 2, 2],
    cfr: [12, 11, 13, 12, 12, 13],
    pulse: [3.9, 3.7, 3.5, 3.4],
    pulseByQuestion: [2.9, 3.8, 3.6, 3.3],
    pulseResponses: 8,
    unpl: [20, 22, 21, 24, 25, 26, 27, 28, 29, 30, 32, 31],
    unplBySource: [6, 12, 9, 4],
    burn: { scope: 48, remaining: [48, 48, 46, 45, 42, 38] },
    cycleBySize: [3.9, 7.6, 11.8, 16.0],
    aging: [
      { id: 'MPL-221', title: 'Route planner: add fuel constraint', status: 'Code Review', days: 9 },
      { id: 'MPL-230', title: 'Export mission plan to PDF', status: 'Code Review', days: 8 },
      { id: 'MPL-214', title: 'Refresh weather overlay', status: 'Code Review', days: 7 },
      { id: 'MPL-233', title: 'Import crew schedule file', status: 'In Progress', days: 6 },
    ],
  },
  // Story: healthy and improving.
  ts: {
    commit: [80, 82, 84, 83, 86, 85, 87, 88, 89, 90, 91, 90],
    cycle: [5.1, 4.9, 4.6, 4.5, 4.4, 4.2, 4.1, 4.0, 3.9, 3.9, 3.8, 3.8],
    pipe: [91, 92, 92, 93, 94, 93, 95, 94, 95, 96, 95, 96],
    cov: [80, 81, 81, 82, 83, 83, 84, 84, 85, 85, 86, 86],
    esc: [3, 2, 2, 1, 1, 1],
    cfr: [12, 11, 10, 9, 8, 8],
    pulse: [4.0, 4.1, 4.2, 4.3],
    pulseByQuestion: [4.2, 4.5, 4.1, 4.4],
    pulseResponses: 7,
    unpl: [16, 15, 15, 14, 14, 13, 13, 12, 13, 12, 12, 12],
    unplBySource: [5, 4, 2, 1],
    burn: { scope: 40, remaining: [40, 36, 33, 28, 24, 19] },
    cycleBySize: [1.9, 3.4, 5.8, 8.7],
    aging: [{ id: 'TSM-155', title: 'Handle timeouts in simulation harness', status: 'In Review', days: 6 }],
  },
};

export function teamName(id: TeamId): string {
  return TEAMS.find((t) => t.id === id)?.name ?? id;
}

export function isTeamId(v: string | undefined): v is TeamId {
  return v === 'ai' || v === 'mp' || v === 'ts';
}
