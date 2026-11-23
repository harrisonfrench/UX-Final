// Hand-built SVG charts so they match the design system exactly.
// Rules (docs/design-system.md): one y-axis, 2px lines, bars <=28px with 4px
// rounded tops, hairline grid, dashed labeled target, direct label on the latest
// value only, hover tooltip on every chart, and a table view for screen readers.

import { useState, type ReactNode } from 'react';
import { useWidth } from '../hooks/useWidth';

const PAD = { top: 14, bottom: 26 };
const fmtDefault = (v: number) => String(v);

export interface LineSeries {
  name: string;
  values: number[];
  color: string;
  /** SVG dash pattern, e.g. "4 3". Dashed series are reference lines. */
  dash?: string;
  /** Text label next to the last point. */
  endLabel?: string;
  /** Put the end label right of the point instead of above-left. */
  endRight?: boolean;
  /** Put the end label below the point. */
  endBelow?: boolean;
}

interface Target { value: number; label: string }

interface LineChartProps {
  labels: string[];
  series: LineSeries[];
  min: number;
  max: number;
  ticks: number[];
  format?: (v: number) => string;
  target?: Target;
  height?: number;
  ariaLabel: string;
}

export function LineChart({ labels, series, min, max, ticks, format = fmtDefault, target, height = 230, ariaLabel }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const L = 44, R = target ? 92 : 24;
  const pw = Math.max(40, width - L - R), ph = height - PAD.top - PAD.bottom;
  const n = labels.length;
  const X = (i: number) => L + (n === 1 ? pw / 2 : (i * pw) / (n - 1));
  const Y = (v: number) => PAD.top + ph - ((v - min) / (max - min)) * ph;
  const step = n > 8 ? 2 : 1;

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const i = Math.round((x / box.width) * (n - 1));
    const idx = Math.max(0, Math.min(n - 1, i));
    setHover(series.some((s) => s.values[idx] != null) ? idx : null);
  };

  return (
    <div className="chart" ref={ref}>
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={L + pw} y1={Math.round(Y(t)) + 0.5} y2={Math.round(Y(t)) + 0.5} stroke={t === min ? 'var(--baseline)' : 'var(--grid)'} />
            <text x={L - 8} y={Y(t) + 4} textAnchor="end" fontSize={11} fill="var(--muted)">{format(t)}</text>
          </g>
        ))}
        {labels.map((lb, i) => ((n - 1 - i) % step ? null : (
          <text key={lb + i} x={X(i)} y={PAD.top + ph + 18} textAnchor="middle" fontSize={11} fill="var(--muted)">{lb}</text>
        )))}
        {target && (
          <g>
            <line x1={L} x2={L + pw} y1={Y(target.value)} y2={Y(target.value)} stroke="var(--target)" strokeDasharray="4 3" />
            <text x={L + pw + 8} y={Y(target.value) + 4} fontSize={11} fontWeight={500} fill="var(--target)">{target.label}</text>
          </g>
        )}
        {series.map((s) => {
          const pts = s.values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
          const li = s.values.length - 1;
          return (
            <g key={s.name}>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth={s.dash ? 1.5 : 2} strokeDasharray={s.dash} strokeLinejoin="round" strokeLinecap="round" />
              {!s.dash && <circle cx={X(li)} cy={Y(s.values[li])} r={4} fill={s.color} stroke="#fff" strokeWidth={2} />}
              {s.endLabel && <EndLabel x={X(li)} y={Y(s.values[li])} text={s.endLabel} right={s.endRight} below={s.endBelow} />}
            </g>
          );
        })}
        {hover != null && (
          <g pointerEvents="none">
            <line x1={X(hover)} x2={X(hover)} y1={PAD.top} y2={PAD.top + ph} stroke="var(--baseline)" />
            {series.map((s) => s.values[hover] != null && (
              <circle key={s.name} cx={X(hover)} cy={Y(s.values[hover])} r={4} fill={s.dash ? '#fff' : s.color} stroke={s.color} strokeWidth={2} />
            ))}
          </g>
        )}
        <rect x={L} y={PAD.top} width={pw} height={ph} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
      </svg>
      {hover != null && (
        <div className="tooltip" style={{ left: X(hover), top: PAD.top }}>
          <strong>{labels[hover]}</strong>
          {series.filter((s) => s.values[hover] != null).map((s) => (
            <div key={s.name}>{s.name}: {format(s.values[hover])}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function EndLabel({ x, y, text, right, below }: { x: number; y: number; text: string; right?: boolean; below?: boolean }) {
  const w = text.length * 7 + 8;
  const lx = right ? x + 8 : x - w - 6;
  const ly = right ? y - 9 : below ? y + 6 : y - 24;
  return (
    <g>
      <rect x={lx} y={ly} width={w} height={18} rx={3} fill="#fff" />
      <text x={lx + 4} y={ly + 13} fontSize={12} fontWeight={600} fill="var(--ink)">{text}</text>
    </g>
  );
}

interface BarChartProps {
  labels: string[];
  values: number[];
  max: number;
  ticks: number[];
  format?: (v: number) => string;
  target?: Target;
  height?: number;
  barMax?: number;
  ariaLabel: string;
}

export function BarChart({ labels, values, max, ticks, format = fmtDefault, target, height = 230, barMax = 28, ariaLabel }: BarChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const L = 44, R = target ? 92 : 24;
  const pw = Math.max(40, width - L - R), ph = height - PAD.top - PAD.bottom;
  const n = labels.length;
  const band = pw / n;
  const bw = Math.min(barMax, band * 0.62);
  const X = (i: number) => L + (i + 0.5) * band;
  const Y = (v: number) => PAD.top + ph - (v / max) * ph;
  const step = n > 8 ? 2 : 1;
  const last = values.length - 1;

  return (
    <div className="chart" ref={ref}>
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={L + pw} y1={Math.round(Y(t)) + 0.5} y2={Math.round(Y(t)) + 0.5} stroke={t === 0 ? 'var(--baseline)' : 'var(--grid)'} />
            <text x={L - 8} y={Y(t) + 4} textAnchor="end" fontSize={11} fill="var(--muted)">{format(t)}</text>
          </g>
        ))}
        {labels.map((lb, i) => ((n - 1 - i) % step ? null : (
          <text key={lb + i} x={X(i)} y={PAD.top + ph + 18} textAnchor="middle" fontSize={11} fill="var(--muted)">{lb}</text>
        )))}
        {values.map((v, i) => {
          const y = Y(v), h = Math.max(1, Y(0) - y), r = Math.min(4, h / 2);
          const x = X(i) - bw / 2;
          return (
            <path key={i} d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${y + h} Z`}
              fill="var(--series)" opacity={hover == null || hover === i ? 1 : 0.55} />
          );
        })}
        {target && (
          <g>
            <line x1={L} x2={L + pw} y1={Y(target.value)} y2={Y(target.value)} stroke="var(--target)" strokeDasharray="4 3" />
            <text x={L + pw + 8} y={Y(target.value) + 4} fontSize={11} fontWeight={500} fill="var(--target)">{target.label}</text>
          </g>
        )}
        <text x={X(last)} y={Y(values[last]) - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--ink)">{format(values[last])}</text>
        {values.map((_, i) => (
          <rect key={i} x={L + i * band} y={PAD.top} width={band} height={ph} fill="transparent"
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
      </svg>
      {hover != null && (
        <div className="tooltip" style={{ left: X(hover), top: Y(values[hover]) }}>
          <strong>{labels[hover]}</strong>{format(values[hover])}
        </div>
      )}
    </div>
  );
}

/** Horizontal bars for breakdowns. Values are always printed, so no tooltip needed. */
export function HBarChart({ items, max, format = fmtDefault, ariaLabel }: { items: { label: string; value: number }[]; max: number; format?: (v: number) => string; ariaLabel: string }) {
  return (
    <div className="chart" role="img" aria-label={ariaLabel} style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '8px 0' }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 56px', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--ink-2)', fontSize: 13 }}>{it.label}</span>
          <span style={{ background: 'var(--series-track)', borderRadius: 4, height: 16, overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.max(2, (it.value / max) * 100)}%`, background: 'var(--series)', borderRadius: 4 }} />
          </span>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{format(it.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ values, target, height = 36 }: { values: number[]; target?: number; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>(220);
  const all = target != null ? [...values, target] : values;
  const lo = Math.min(...all), hi = Math.max(...all), span = hi - lo || 1;
  const min = lo - span * 0.15, max = hi + span * 0.15;
  const X = (i: number) => (i * (width - 4)) / Math.max(1, values.length - 1);
  const Y = (v: number) => 2 + (height - 4) - ((v - min) / (max - min)) * (height - 4);
  const li = values.length - 1;
  return (
    <div ref={ref} aria-hidden>
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        {target != null && <line x1={0} x2={width} y1={Y(target)} y2={Y(target)} stroke="var(--baseline)" strokeDasharray="3 3" />}
        <polyline points={values.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke="var(--series)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={X(li)} cy={Y(values[li])} r={3} fill="var(--series)" />
      </svg>
    </div>
  );
}

export interface LegendItem { label: string; color: string; dashed?: boolean }

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="legend" aria-hidden>
      {items.map((l) => (
        <span className="legend-item" key={l.label}>
          <svg width={18} height={10}><line x1={1} x2={17} y1={5} y2={5} stroke={l.color} strokeWidth={l.dashed ? 1.5 : 2} strokeDasharray={l.dashed ? '4 3' : undefined} /></svg>
          {l.label}
        </span>
      ))}
    </div>
  );
}

/** Accessible data table behind a chart. */
export function DataTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <table className="table chart-table">
      <thead><tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row" style={{ background: 'none', fontWeight: 500 }}>{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody>
    </table>
  );
}

export function ChartSlot({ chart, table, showTable }: { chart: ReactNode; table?: ReactNode; showTable: boolean }) {
  return <>{showTable && table ? table : chart}</>;
}
