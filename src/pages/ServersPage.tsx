import { useState } from 'react';
import { Pencil, Plus, Server as ServerIcon, Trash2 } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ServerFormModal } from '@/components/ServerFormModal';
import { StatusBadge } from '@/components/StatusBadge';
import { UsageBar } from '@/components/UsageBar';
import type { FleetTelemetry } from '@/hooks/useFleetTelemetry';
import type { ServerInput } from '@/hooks/useServers';
import { healthFor, type Server } from '@/lib/monitoring';

interface ServersPageProps {
  servers: Server[];
  fleet: FleetTelemetry;
  loading: boolean;
  error: string | null;
  onCreate: (input: ServerInput) => Promise<boolean>;
  onUpdate: (id: string, input: ServerInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

type FormTarget = Server | 'new' | null;

export function ServersPage({ servers, fleet, loading, error, onCreate, onUpdate, onDelete }: ServersPageProps) {
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [pendingDelete, setPendingDelete] = useState<Server | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSubmit = (input: ServerInput) => {
    if (formTarget === null) return Promise.resolve(false);
    return formTarget === 'new' ? onCreate(input) : onUpdate(formTarget.id, input);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const removed = await onDelete(pendingDelete.id);
    setDeleting(false);
    if (removed) {
      setPendingDelete(null);
    } else {
      setDeleteError('We could not remove this server. Please try again.');
    }
  };

  return (
    <PageShell title="Servers" subtitle="The Linux machines Sentinel watches. Changes are saved instantly.">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setFormTarget('new')}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add server
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      {loading && servers.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading servers...</p>
      ) : servers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
          <ServerIcon className="h-7 w-7 text-slate-500" aria-hidden="true" />
          <p className="text-sm text-slate-400">No servers yet. Add one to start monitoring it.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          {servers.map((server) => {
            const snapshot = fleet[server.id]?.current;
            return (
              <li key={server.id} className="flex flex-col gap-4 p-4 transition-colors hover:bg-slate-900 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-100">{server.name}</p>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs capitalize text-slate-300">{server.environment}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {server.host} · {server.os_label}
                  </p>
                </div>

                <div className="w-full sm:w-48">
                  {snapshot ? (
                    <div className="space-y-2">
                      <StatusBadge status={healthFor(snapshot)} />
                      <UsageBar value={snapshot.cpu} />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Waiting for first reading</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormTarget(server)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(server);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-2 text-sm text-rose-300 transition-colors hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {formTarget !== null && (
        <ServerFormModal
          key={formTarget === 'new' ? 'new' : formTarget.id}
          server={formTarget === 'new' ? null : formTarget}
          onSubmit={handleSubmit}
          onClose={() => setFormTarget(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Remove ${pendingDelete.name}?`}
          message="This stops monitoring the server and deletes its alert history. This cannot be undone."
          confirmLabel="Remove server"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
      {pendingDelete && deleteError && (
        <p role="alert" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-rose-500/30 bg-slate-900 px-4 py-3 text-sm text-rose-300 shadow-xl">
          {deleteError}
        </p>
      )}
    </PageShell>
  );
}
