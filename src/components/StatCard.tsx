import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  children?: ReactNode;
}

export function StatCard({ label, value, icon: Icon, hint, children }: StatCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-50">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className="rounded-xl bg-slate-800/80 p-2.5 text-emerald-300">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {children}
    </div>
  );
}
