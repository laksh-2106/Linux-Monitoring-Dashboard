import { Activity, Bell, LayoutDashboard, Server, ShieldCheck, type LucideIcon } from 'lucide-react';

export type Page = 'overview' | 'servers' | 'alerts';

interface NavItem {
  id: Page;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'servers', label: 'Servers', icon: Server },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

interface SidebarProps {
  page: Page;
  onNavigate: (page: Page) => void;
  activeAlertCount: number;
}

export function Sidebar({ page, onNavigate, activeAlertCount }: SidebarProps) {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 px-5 py-4 md:py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight text-slate-50">Sentinel</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <Activity className="h-3 w-3 text-emerald-400" aria-hidden="true" />
            Linux fleet monitor
          </p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0" aria-label="Main">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = page === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : ''}`} aria-hidden="true" />
              <span>{label}</span>
              {id === 'alerts' && activeAlertCount > 0 && (
                <span className="ml-auto rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold tabular-nums text-rose-300">
                  {activeAlertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
