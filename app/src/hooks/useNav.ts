import { useLocation, useSearchParams } from 'react-router-dom';
import type { Period } from '../data/metrics';
import { isTeamId, type TeamId } from '../data/teams';

export type View = 'leader' | 'overview' | 'delivery' | 'quality' | 'health' | 'guide';

let lastTeam: TeamId = 'ai';

/**
 * Reads where we are from the URL so every screen is linkable:
 *   #/                         Leadership overview
 *   #/team/mp                  Team overview
 *   #/team/mp/delivery         Delivery drill-down (also quality, health)
 *   #/guide                    KPI guide
 * and ?period=12 for the last 12 sprints (default is 6).
 */
export function useNav() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const period: Period = params.get('period') === '12' ? 12 : 6;
  const parts = pathname.split('/').filter(Boolean);
  let view: View = 'leader';
  let team: TeamId | null = null;
  if (parts[0] === 'guide') view = 'guide';
  else if (parts[0] === 'team' && isTeamId(parts[1])) {
    team = parts[1];
    lastTeam = team;
    const v = parts[2];
    view = v === 'delivery' || v === 'quality' || v === 'health' ? v : 'overview';
  }
  return { view, team, period, lastTeam };
}

export function pathFor(view: View, team: TeamId, period: Period): string {
  const q = period === 12 ? '?period=12' : '';
  if (view === 'leader') return `/${q}`;
  if (view === 'guide') return `/guide${q}`;
  if (view === 'overview') return `/team/${team}${q}`;
  return `/team/${team}/${view}${q}`;
}
