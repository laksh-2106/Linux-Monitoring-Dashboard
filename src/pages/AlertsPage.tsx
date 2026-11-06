import { useState } from 'react';
import { BellOff, Check, ShieldAlert, TriangleAlert } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import {
  METRIC_LABELS,
  formatRelativeTime,
  type Alert,
  type Server,
} from '@/lib/monitoring';

interface AlertsPageProps {
  alerts: Alert[];
  servers: Server[];
  loading: boolean;
  error: string | null;
  onAcknowledge: (id: string) => Promise<boolean>;
}

type Filter = 'active' | 'all';

export function AlertsPage({ alerts, servers, loading, error, onAcknowledge }: AlertsPageProps) {
  const [filter, setFilter] = useState<Filter>('active');
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const serverNames = new Map(servers.map((server) => [server.id, server.name]));
  const visible = filter === 'active' ? alerts.filter((alert) => !alert.acknowledged) : alerts;

  const handleAcknowledge = async (id: string) => {
    setAcknowledgingId(id);
    setActionError(null);
    const ok = await onAcknowledge(id);
    setAcknowledgingId(null);
    if (!ok) setActionError('We could not acknowledge that alert. Please try again.');
  };

  return (
    <PageShell title="Alerts" subtitle="Raised when CPU, memory, or disk usage crosses a threshold.">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filter alerts" className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
          {(['active', 'all'] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={filter === option}
              onClick={() => setFilter(option)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === option ? 'bg-slate-800 text-slate-50' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {option === 'active' ? 'Open' : 'All'}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          Warning at 75%, critical at 90%
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}
      {actionError && (
        <p role="alert" className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {actionError}
        </p>
      )}

      {loading && alerts.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading alerts...</p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
          <BellOff className="h-7 w-7 text-slate-500" aria-hidden="true" />
          <p className="text-sm text-slate-400">
            {filter === 'active' ? 'No open alerts. Everything is within thresholds.' : 'No alerts have been raised yet.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const Icon = isCritical ? ShieldAlert : TriangleAlert;
            return (
              <li
                key={alert.id}
                className={`flex flex-col gap-4 rounded-2xl border bg-slate-900/60 p-4 transition-opacity sm:flex-row sm:items-center sm:p-5 ${
                  alert.acknowledged ? 'border-slate-800 opacity-60' : 'border-slate-700'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className={`rounded-xl p-2.5 ${isCritical ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-500/15 text-amber-300'}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100">{alert.message}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {serverNames.get(alert.server_id) ?? 'Removed server'} · {METRIC_LABELS[alert.metric]} ·{' '}
                      {formatRelativeTime(alert.created_at)}
                    </p>
                  </div>
                </div>

                {alert.acknowledged ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={acknowledgingId === alert.id}
                    className="rounded-lg border border-slate-700 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
                  >
                    {acknowledgingId === alert.id ? 'Saving...' : 'Acknowledge'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
