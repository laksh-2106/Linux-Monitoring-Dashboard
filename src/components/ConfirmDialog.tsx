import { TriangleAlert } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-rose-500/15 p-2.5 text-rose-300">
            <TriangleAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="confirm-title" className="text-lg font-semibold text-slate-50">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
