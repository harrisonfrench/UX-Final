import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { KpiId } from '../data/kpis';
import type { Period } from '../data/metrics';
import { KpiDialog } from './KpiDialog';
import { ExportDialog } from './ExportDialog';

type Open = { kind: 'kpi'; kpi: KpiId } | { kind: 'export'; period: Period } | null;

interface Ctx {
  openKpi: (kpi: KpiId) => void;
  openExport: (period: Period) => void;
}

const DialogCtx = createContext<Ctx | null>(null);

export function useDialogs(): Ctx {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error('useDialogs must be inside DialogProvider');
  return ctx;
}

/** One native <dialog> for the whole app: Esc closes, focus is trapped, backdrop click closes. */
export function DialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Open>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = useCallback(() => setOpen(null), []);
  const value: Ctx = {
    openKpi: useCallback((kpi: KpiId) => setOpen({ kind: 'kpi', kpi }), []),
    openExport: useCallback((period: Period) => setOpen({ kind: 'export', period }), []),
  };

  return (
    <DialogCtx.Provider value={value}>
      {children}
      <dialog
        ref={ref}
        className={`dialog${open?.kind === 'export' ? ' wide' : ''}`}
        onClose={close}
        onClick={(e) => { if (e.target === ref.current) close(); }}
        aria-labelledby="dialog-title"
      >
        {open?.kind === 'kpi' && <KpiDialog kpi={open.kpi} onClose={close} />}
        {open?.kind === 'export' && <ExportDialog period={open.period} onClose={close} />}
      </dialog>
    </DialogCtx.Provider>
  );
}
