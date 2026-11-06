import { CheckCircle2, ShieldAlert, TriangleAlert } from 'lucide-react';
import type { HealthStatus } from '@/lib/monitoring';

const STATUS_STYLES: Record<HealthStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  healthy: {
    label: 'Healthy',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    Icon: CheckCircle2,
  },
  warning: {
    label: 'Warning',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    Icon: TriangleAlert,
  },
  critical: {
    label: 'Critical',
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    Icon: ShieldAlert,
  },
};

export function StatusBadge({ status }: { status: HealthStatus }) {
  const { label, className, Icon } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
