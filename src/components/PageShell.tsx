import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}
