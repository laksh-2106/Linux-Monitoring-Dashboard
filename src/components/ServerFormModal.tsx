import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { ENVIRONMENTS, type Environment, type Server } from '@/lib/monitoring';
import type { ServerInput } from '@/hooks/useServers';

interface ServerFormModalProps {
  server: Server | null;
  onSubmit: (input: ServerInput) => Promise<boolean>;
  onClose: () => void;
}

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

export function ServerFormModal({ server, onSubmit, onClose }: ServerFormModalProps) {
  const [name, setName] = useState(server?.name ?? '');
  const [host, setHost] = useState(server?.host ?? '');
  const [environment, setEnvironment] = useState<Environment>(server?.environment ?? 'production');
  const [osLabel, setOsLabel] = useState(server?.os_label ?? 'Ubuntu 22.04');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, submitting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = { name: name.trim(), host: host.trim(), environment, os_label: osLabel.trim() };

    if (!input.name || !input.host) {
      setFormError('Name and host are required.');
      return;
    }
    if (!input.os_label) {
      setFormError('Operating system is required.');
      return;
    }

    setFormError(null);
    setSubmitting(true);
    const saved = await onSubmit(input);
    setSubmitting(false);
    if (saved) {
      onClose();
    } else {
      setFormError('We could not save this server. Please try again.');
    }
  };

  const isEditing = server !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="server-form-title"
        className="w-full max-w-lg rounded-t-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="server-form-title" className="text-lg font-semibold text-slate-50">
              {isEditing ? 'Edit server' : 'Add server'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Servers appear on the overview once saved.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-medium text-slate-300">
              Name
              <input
                className={FIELD_CLASS}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="web-prod-01"
                maxLength={60}
              />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-slate-300">
              Host or IP
              <input
                className={FIELD_CLASS}
                value={host}
                onChange={(event) => setHost(event.target.value)}
                placeholder="10.0.2.14"
                maxLength={120}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-medium text-slate-300">
              Environment
              <select
                className={FIELD_CLASS}
                value={environment}
                onChange={(event) => setEnvironment(event.target.value as Environment)}
              >
                {ENVIRONMENTS.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-slate-300">
              Operating system
              <input
                className={FIELD_CLASS}
                value={osLabel}
                onChange={(event) => setOsLabel(event.target.value)}
                placeholder="Ubuntu 22.04"
                maxLength={60}
              />
            </label>
          </div>

          {formError && (
            <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
