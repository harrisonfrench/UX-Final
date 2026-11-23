import { useState } from 'react';
import { KPIS, KPI_ORDER } from '../data/kpis';
import { lowerFirst, statusOf, valueParts, type Period, type Status } from '../data/metrics';
import { TEAMS } from '../data/teams';
import { Icon } from './Icon';
import { StatusChip } from './StatusChip';

function summaryFor(team: (typeof TEAMS)[number]) {
  const off = KPI_ORDER.filter((k) => statusOf(k, team.id) === 2);
  const watch = KPI_ORDER.filter((k) => statusOf(k, team.id) === 1);
  const status: Status = off.length ? 2 : watch.length ? 1 : 0;
  const offLine = off.length
    ? `Off target: ${off.map((k) => `${lowerFirst(KPIS[k].name)} ${valueParts(k, team.id).join(' ').trim()}`).join('; ')}.`
    : 'All KPIs on target or improving.';
  const watchLine = watch.length ? `Watch: ${watch.map((k) => lowerFirst(KPIS[k].name)).join(', ')}.` : '';
  return { status, offLine, watchLine };
}

export function ExportDialog({ period, onClose }: { period: Period; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const blocks = TEAMS.map((t) => ({ team: t, ...summaryFor(t) }));
  const plain = [
    `Leadership review summary · November 2026 · last ${period} sprints`,
    ...blocks.map((b) => [b.team.name, b.offLine, b.watchLine].filter(Boolean).join('\n')),
  ].join('\n\n');

  const copy = async () => {
    try { await navigator.clipboard.writeText(plain); setCopied(true); } catch { setCopied(false); }
  };

  return (
    <div className="dialog-body">
      <div className="dialog-head">
        <div style={{ flex: 1 }}>
          <h2 className="dialog-title" id="dialog-title">Leadership review summary</h2>
          <p className="card-sub" style={{ fontSize: 13 }}>November 2026 · last {period} sprints · ready to paste into the monthly report</p>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
      </div>
      {blocks.map((b) => (
        <div className="summary-block" key={b.team.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong>{b.team.name}</strong><StatusChip status={b.status} small />
          </div>
          <div style={{ fontSize: 13, lineHeight: '18px' }}>{b.offLine}</div>
          {b.watchLine && <div style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ink-2)' }}>{b.watchLine}</div>}
        </div>
      ))}
      <p className="footnote">Blockers, risks, funding and staffing come from the project lead and are added before sending.</p>
      <div className="dialog-foot">
        <span aria-live="polite" className="footnote" style={{ alignSelf: 'center', marginRight: 'auto' }}>{copied ? 'Copied to clipboard.' : ''}</span>
        <button className="btn" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={copy} autoFocus><Icon name="copy" />Copy summary</button>
      </div>
    </div>
  );
}
