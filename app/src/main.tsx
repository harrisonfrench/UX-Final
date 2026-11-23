import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, Navigate, RouterProvider, useParams } from 'react-router-dom';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import './styles/tokens.css';
import './styles/app.css';
import { Layout } from './components/Layout';
import { isTeamId, type TeamId } from './data/teams';
import { DeliveryView } from './views/DeliveryView';
import { GuideView } from './views/GuideView';
import { HealthView } from './views/HealthView';
import { LeadershipView } from './views/LeadershipView';
import { QualityView } from './views/QualityView';
import { TeamOverview } from './views/TeamOverview';

/** Validates :team in the URL; unknown teams go back to the leadership view. */
function WithTeam({ render }: { render: (team: TeamId) => JSX.Element }) {
  const { team } = useParams();
  return isTeamId(team) ? render(team) : <Navigate to="/" replace />;
}

// Hash routing so the built site works from a file path or GitHub Pages without server config.
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LeadershipView /> },
      { path: 'team/:team', element: <WithTeam render={(t) => <TeamOverview key={t} team={t} />} /> },
      { path: 'team/:team/delivery', element: <WithTeam render={(t) => <DeliveryView key={t} team={t} />} /> },
      { path: 'team/:team/quality', element: <WithTeam render={(t) => <QualityView key={t} team={t} />} /> },
      { path: 'team/:team/health', element: <WithTeam render={(t) => <HealthView key={t} team={t} />} /> },
      { path: 'guide', element: <GuideView /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
