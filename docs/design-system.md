# Design system

Same tokens as Figma page **3 · Design system** and `app/src/styles/tokens.css`. Built for quick reading on
laptop and desktop screens. References: GitLab Value Streams Dashboard, Azure DevOps dashboards, Swarmia.

## Type
IBM Plex Sans (UI), IBM Plex Mono (work item IDs). Tabular numbers.
| Style | Size / line height | Weight |
|---|---|---|
| Page title | 24 / 32 | SemiBold |
| KPI value | 28 / 36 | SemiBold |
| Card title | 15 / 20 | SemiBold |
| Body | 14 / 20 | Regular |
| Label | 12 / 16 | Medium |
| Axis | 11 / 14 | Regular |

## Color and contrast (WCAG 2.x ratios, computed)
| Token | Hex | On white | On page #F4F4F1 | Use |
|---|---|---|---|---|
| ink | #0B0B0B | 19.68 | 17.86 | Primary text, values |
| ink-2 | #52514E | 7.94 | 7.20 | Labels, target lines |
| muted | #6B6A65 | 5.42 | 4.92 | Axis text, captions, org median line |
| accent | #184F95 | 8.10 | 7.35 | Selected nav, links, primary button |
| delta-good | #006300 | 7.54 | 6.84 | Improving change text |
| delta-bad | #D03B3B | 4.80 | 4.36 | Worsening change text (white cards only) |
| series | #2A78D6 | 4.42 | 4.01 | Team data in charts (graphics only, never text) |
| good | #0CA30C | 3.35 | 3.04 | Status icon |
| warn | #FAB219 | 1.83 | 1.66 | Status, always with triangle icon + "Watch" |
| bad | #D03B3B | 4.80 | 4.36 | Status icon |
| baseline / grid | #C3C2B7 / #E1E0D9 | — | — | Decorative only |

Colorblind check (team blue vs org-median gray): ΔE 17.7 protan/deutan, 12.6 tritan (target ≥ 8).

## Rules
- Status = icon + word + color: On target (check), Watch (triangle), Off target (x). Colors reserved for status.
- One y-axis per chart. 2px lines. Bars ≤ 28px with 4px rounded tops. Hairline grid.
- Targets and org median are dashed and labeled. Only the latest value gets a direct label.
- Legend whenever a chart has 2+ series. Hover tooltip on every chart. "Show table" on trend charts.
- Team-level data only. No per-person series, no rankings. Teams always A–Z.
- Spacing 4 / 8 / 12 / 16 / 24 / 32. Card radius 8, dialog radius 12.
