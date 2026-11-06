import { THRESHOLDS } from '@/lib/monitoring';

function toneFor(value: number): string {
  if (value >= THRESHOLDS.critical) return 'bg-rose-500';
  if (value >= THRESHOLDS.warning) return 'bg-amber-400';
  return 'bg-emerald-400';
}

export function UsageBar({ value }: { value: number }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800" role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${toneFor(value)}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
