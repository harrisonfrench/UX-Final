import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DATA_AS_OF, DATA_SOURCES, TEAMS } from '../data/teams';
import { pathFor, useNav } from '../hooks/useNav';
import { useDialogs } from './DialogContext';
import { Icon } from './Icon';

interface Props {
  title: string;
  subtitle: string;
  /** Show the team tabs (team-level views only). */
  teamTabs?: boolean;
  /** Show the period toggle (hidden on the KPI guide). */
  periodToggle?: boolean;
  /** Show the Export for leadership review button. */
  exportButton?: 'primary' | 'secondary';
  extra?: ReactNode;
}

/** Title, then filters in one row in the same place on every screen (annotation T1). */
export function PageHeader({ title, subtitle, teamTabs = false, periodToggle = true, exportButton }: Props) {
  const { view, team, period, lastTeam } = useNav();
  const { openExport } = useDialogs();
  const current = team ?? lastTeam;

  return (
    <header className="page-head">
      <div className="page-head-top">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
        {exportButton && (
          <button className={`btn${exportButton === 'primary' ? ' btn-primary' : ''}`} onClick={() => openExport(period)}>
            <Icon name="download" />Export for leadership review
          </button>
        )}
      </div>
      {(teamTabs || periodToggle) && (
        <div className="filters">
          {teamTabs && (
            <div className="filter">
              <span className="filter-label" id="team-label">Team</span>
              <div className="seg" role="group" aria-labelledby="team-label">
                {TEAMS.map((t) => (
                  <Link key={t.id} to={pathFor(view, t.id, period)} aria-current={t.id === current ? 'page' : undefined}>{t.name}</Link>
                ))}
              </div>
            </div>
          )}
          {periodToggle && (
            <div className="filter">
              <span className="filter-label" id="period-label">Period</span>
              <div className="seg" role="group" aria-labelledby="period-label">
                {([6, 12] as const).map((p) => (
                  <Link key={p} to={pathFor(view, current, p)} aria-current={p === period ? 'page' : undefined}>Last {p} sprints</Link>
                ))}
              </div>
            </div>
          )}
          <span className="freshness">Data as of {DATA_AS_OF} · {DATA_SOURCES.join(' · ')}</span>
        </div>
      )}
    </header>
  );
}
