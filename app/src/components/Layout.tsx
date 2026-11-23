import { Link, Outlet } from 'react-router-dom';
import { pathFor, useNav, type View } from '../hooks/useNav';
import { Icon, type IconName } from './Icon';
import { DialogProvider } from './DialogContext';

const NAV: { view: View; label: string; icon: IconName }[] = [
  { view: 'leader', label: 'Leadership overview', icon: 'grid' },
  { view: 'overview', label: 'Team overview', icon: 'users' },
  { view: 'delivery', label: 'Delivery', icon: 'flag' },
  { view: 'quality', label: 'Quality & stability', icon: 'shield' },
  { view: 'health', label: 'Team health', icon: 'heart' },
  { view: 'guide', label: 'KPI guide', icon: 'book' },
];

export function Layout() {
  const { view, period, lastTeam } = useNav();
  return (
    <DialogProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="app">
        <nav className="sidebar" aria-label="Dashboard views">
          <div className="brand">
            <span className="brand-mark" aria-hidden>402</span>
            <span>
              <span className="brand-org" style={{ display: 'block' }}>402 SWEG</span>
              <span className="brand-name">Team Metrics</span>
            </span>
          </div>
          {NAV.map((n) => (
            <Link key={n.view} className="nav-item" to={pathFor(n.view, lastTeam, period)} aria-current={view === n.view ? 'page' : undefined}>
              <Icon name={n.icon} size={18} />
              {n.label}
            </Link>
          ))}
          <div className="sidebar-note">
            <strong>Sample data</strong>
            Teams and numbers are made up for this prototype. Team-level data only.
          </div>
        </nav>
        <main className="main" id="main">
          <Outlet />
        </main>
      </div>
    </DialogProvider>
  );
}
