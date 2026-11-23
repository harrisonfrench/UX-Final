import { STATUS_LABEL, type Status } from '../data/metrics';
import { Icon } from './Icon';

const ICON = { 0: 'check', 1: 'warn', 2: 'x' } as const;

/** Status is always icon + word + color, never color alone (WCAG 1.4.1). */
export function StatusChip({ status, small = false }: { status: Status; small?: boolean }) {
  return (
    <span className={`chip s${status}${small ? ' small' : ''}`}>
      <Icon name={ICON[status]} size={small ? 12 : 14} />
      {STATUS_LABEL[status]}
    </span>
  );
}
