// Pure functions that turn raw team data into what the screens show:
// current value, status, change over the period, and windowed series.

import { KPIS, KPI_ORDER, type KpiId } from './kpis';
import { CURRENT_SPRINT, MONTHS, SPRINTS, SURVEYS, TEAMS, TEAM_DATA, type TeamId } from './teams';

export type Period = 6 | 12;
/** 0 = On target, 1 = Watch, 2 = Off target. */
export type Status = 0 | 1 | 2;

export const STATUS_LABEL: Record<Status, string> = { 0: 'On target', 1: 'Watch', 2: 'Off target' };

/** Last 6 sprints = last 3 months; last 12 sprints = all 6 months. */
export function windowed<T>(values: T[], per: 'sprint' | 'month', period: Period): T[] {
  if (per === 'month') return period === 6 ? values.slice(-3) : values.slice();
  return period === 6 ? values.slice(-6) : values.slice();
}

export function windowLabels(per: 'sprint' | 'month', period: Period): string[] {
  return per === 'month' ? windowed(MONTHS, 'month', period) : windowed(SPRINTS, 'sprint', period);
}

export function seriesFor(kpi: KpiId, team: TeamId, period: Period): number[] {
  const k = KPIS[kpi];
  const d = TEAM_DATA[team];
  if (kpi === 'burn') return d.burn.remaining;
  if (kpi === 'pulse') return d.pulse;
  if (!k.series || !k.per) return [];
  return windowed(d[k.series], k.per, period);
}

export function idealRemaining(team: TeamId): number[] {
  const { scope } = TEAM_DATA[team].burn;
  return Array.from({ length: CURRENT_SPRINT.length + 1 }, (_, i) => scope - (scope * i) / CURRENT_SPRINT.length);
}

/** Remaining minus ideal for today. Positive = behind. */
export function burnGap(team: TeamId): number {
  const { scope, remaining } = TEAM_DATA[team].burn;
  const day = remaining.length - 1;
  return remaining[day] - (scope - (scope * day) / CURRENT_SPRINT.length);
}

export function latestValue(kpi: KpiId, team: TeamId): number {
  const d = TEAM_DATA[team];
  if (kpi === 'burn') return burnGap(team);
  if (kpi === 'pulse') return d.pulse[d.pulse.length - 1];
  const s = KPIS[kpi].series!;
  return d[s][d[s].length - 1];
}

export function statusOf(kpi: KpiId, team: TeamId): Status {
  const v = latestValue(kpi, team);
  const k = KPIS[kpi];
  if (kpi === 'burn') {
    const r = v / TEAM_DATA[team].burn.scope;
    return r <= k.target ? 0 : r <= k.watch ? 1 : 2;
  }
  if (k.direction > 0) return v >= k.target ? 0 : v >= k.watch ? 1 : 2;
  return v <= k.target ? 0 : v <= k.watch ? 1 : 2;
}

export function formatNumber(kpi: KpiId, v: number): string {
  if (kpi === 'cycle' || kpi === 'pulse') return v.toFixed(1);
  return String(Math.round(kpi === 'burn' ? Math.abs(v) : v));
}

/** [big number, small unit text] for a KPI card. */
export function valueParts(kpi: KpiId, team: TeamId): [string, string] {
  const v = latestValue(kpi, team);
  if (kpi === 'burn') {
    const a = Math.abs(Math.round(v));
    return [String(a), `${a === 1 ? 'pt' : 'pts'} ${v > 0 ? 'behind ideal' : 'ahead of ideal'}`];
  }
  const k = KPIS[kpi];
  if (k.unit === '%') return [`${formatNumber(kpi, v)}%`, ''];
  if (kpi === 'esc') return [formatNumber(kpi, v), `in ${MONTHS[MONTHS.length - 1]}`];
  return [formatNumber(kpi, v), k.unit.trim()];
}

/** Compact value for tables, e.g. "81%", "8.6 d", "14 behind". */
export function shortValue(kpi: KpiId, v: number): string {
  if (kpi === 'burn') return `${Math.abs(Math.round(v))} ${v > 0 ? 'behind' : 'ahead'}`;
  const k = KPIS[kpi];
  if (k.unit === '%') return `${formatNumber(kpi, v)}%`;
  if (kpi === 'cycle') return `${formatNumber(kpi, v)} d`;
  if (kpi === 'pulse') return `${formatNumber(kpi, v)} / 5`;
  return formatNumber(kpi, v);
}

export interface Delta {
  text: string;
  /** 0 = neutral, 1 = better, 2 = worse. */
  tone: 0 | 1 | 2;
}

/** Change from the start of the selected period to now. */
export function deltaOf(kpi: KpiId, team: TeamId, period: Period): Delta {
  if (kpi === 'burn') return { text: `${CURRENT_SPRINT.name} · day ${CURRENT_SPRINT.day} of ${CURRENT_SPRINT.length}`, tone: 0 };
  const d = TEAM_DATA[team];
  let first: number;
  let last: number;
  let since: string;
  if (kpi === 'pulse') {
    const startIdx = period === 6 ? d.pulse.length - 2 : d.pulse.length - 3;
    first = d.pulse[startIdx];
    last = d.pulse[d.pulse.length - 1];
    since = `since ${SURVEYS[startIdx]} survey`;
  } else {
    const k = KPIS[kpi];
    const w = windowed(d[k.series!], k.per!, period);
    first = w[0];
    last = w[w.length - 1];
    since = `since ${windowLabels(k.per!, period)[0]}`;
  }
  const decimals = kpi === 'cycle' || kpi === 'pulse';
  const diff = decimals ? Math.round((last - first) * 10) / 10 : Math.round(last - first);
  if (diff === 0) return { text: `No change ${since}`, tone: 0 };
  const better = Math.sign(diff) * KPIS[kpi].direction > 0;
  const abs = Math.abs(diff);
  const unit = KPIS[kpi].unit === '%' ? (abs === 1 ? ' pt' : ' pts') : kpi === 'cycle' ? (abs === 1 ? ' day' : ' days') : '';
  return { text: `${diff > 0 ? '▲' : '▼'} ${abs}${unit} ${since}`, tone: better ? 1 : 2 };
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Org median of the latest value, across all teams. A baseline, not a ranking. */
export function orgMedianLatest(kpi: KpiId): number {
  return median(TEAMS.map((t) => latestValue(kpi, t.id)));
}

/** Org median per point in time, for comparison lines on trend charts. */
export function orgMedianSeries(kpi: KpiId, period: Period): number[] {
  const all = TEAMS.map((t) => seriesFor(kpi, t.id, period));
  return all[0].map((_, i) => median(all.map((s) => s[i])));
}

export interface AttentionItem {
  team: TeamId;
  kpi: KpiId;
  status: Status;
}

/**
 * Off-target and watch items, worst first. Within a status, the team with
 * more off-target KPIs comes first (triage, not a ranking of performance).
 */
export function attentionItems(teams: TeamId[] = TEAMS.map((t) => t.id)): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const team of teams) for (const kpi of KPI_ORDER) {
    const status = statusOf(kpi, team);
    if (status > 0) items.push({ team, kpi, status });
  }
  const offCount: Partial<Record<TeamId, number>> = {};
  items.forEach((i) => { if (i.status === 2) offCount[i.team] = (offCount[i.team] ?? 0) + 1; });
  const order = TEAMS.map((t) => t.id);
  return items.sort((a, b) =>
    b.status - a.status ||
    (offCount[b.team] ?? 0) - (offCount[a.team] ?? 0) ||
    order.indexOf(a.team) - order.indexOf(b.team) ||
    KPI_ORDER.indexOf(a.kpi) - KPI_ORDER.indexOf(b.kpi));
}

export function lowerFirst(s: string): string {
  return s.startsWith('CI') ? s : s.charAt(0).toLowerCase() + s.slice(1);
}
