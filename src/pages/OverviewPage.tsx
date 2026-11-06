import { useState } from 'react';
import { Clock, Cpu, HardDrive, MemoryStick, Network, Activity, Server as ServerIcon, ShieldCheck, ShieldAlert, type LucideIcon } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Sparkline } from '@/components/Sparkline';
import { UsageBar } from '@/components/UsageBar';
import type { FleetTelemetry } from '@/hooks/useFleetTelemetry';
import {
  formatRate,
  formatUptime,
  healthFor,
  type Server,
} from '@/lib/monitoring';
import type { Page } from '@/components/Sidebar';

interface OverviewPageProps {
  servers: Server[];
  fleet: FleetTelemetry;
  activeAlertCount: number;
  onNavigate: (page: Page) => void;
}

export function OverviewPage({ servers, fleet, activeAlertCount, onNavigate }: OverviewPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const monitored = servers.filter((server) => fleet[server.id]);
  const healths = monitored.map((server) => healthFor(fleet[server.id].current));
  const healthyCount = healths.filter((health) => health === 'healthy').length;
  const attentionCount = healths.length - healthyCount;

  if (servers.length === 0) {
    return (
      <PageShell title="Fleet overview" subtitle="Live telemetry from every server you monitor.">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
          <div className="rounded-2xl bg-slate-800/80 p-4 text-emerald-300">
            <ServerIcon className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-50">No servers yet</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-400">Add your first Linux server to start seeing live CPU, memory, and disk health here.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('servers')}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Add a server
          </button>
        </div>
      </PageShell>
    );
  }

  const selected = servers.find((server) => server.id === selectedId) ?? monitored[0] ?? servers[0];
  const telemetry = fleet[selected.id];

  return (
    <PageShell title="Fleet overview" subtitle="Live telemetry, refreshed every two seconds.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Servers monitored" value={String(servers.length)} icon={ServerIcon} />
        <StatCard label="Healthy" value={String(healthyCount)} icon={ShieldCheck} hint="All metrics under warning level" />
        <StatCard label="Needs attention" value={String(attentionCount)} icon={ShieldAlert} hint="Warning or critical right now" />
        <StatCard label="Open alerts" value={String(activeAlertCount)} icon={Activity} hint="Not yet acknowledged" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <section aria-label="Servers" className="space-y-3">
          {servers.map((server) => {
            const snapshot = fleet[server.id]?.current;
            const isSelected = server.id === selected.id;
            return (
              <button
                key={server.id}
                type="button"
                onClick={() => setSelectedId(server.id)}
                aria-pressed={isSelected}
                className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500/50 bg-slate-900 shadow-lg shadow-emerald-500/5'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-100">{server.name}</p>
                    <p className="truncate text-xs text-slate-500">{server.host}</p>
                  </div>
                  {snapshot && <StatusBadge status={healthFor(snapshot)} />}
                </div>
                {snapshot ? (
                  <div className="mt-4 space-y-3">
                    <MiniMeter label="CPU" value={snapshot.cpu} />
                    <MiniMeter label="Memory" value={snapshot.memory} />
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">Waiting for first reading</p>
                )}
              </button>
            );
          })}
        </section>

        {telemetry && (
          <section aria-label={`${selected.name} details`} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-slate-50">{selected.name}</h2>
                <p className="text-sm text-slate-400">
                  {selected.host} · {selected.os_label} · {selected.environment}
                </p>
              </div>
              <StatusBadge status={healthFor(telemetry.current)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <StatCard label="CPU usage" value={`${telemetry.current.cpu.toFixed(1)}%`} icon={Cpu} hint={`Load average ${telemetry.current.load.toFixed(2)}`}>
                <Sparkline values={telemetry.cpuHistory} />
              </StatCard>
              <StatCard label="Memory usage" value={`${telemetry.current.memory.toFixed(1)}%`} icon={MemoryStick}>
                <Sparkline values={telemetry.memoryHistory} stroke="#38bdf8" />
              </StatCard>
              <StatCard label="Disk usage" value={`${telemetry.current.disk.toFixed(1)}%`} icon={HardDrive}>
                <UsageBar value={telemetry.current.disk} />
              </StatCard>
              <StatCard
                label="Network"
                value={`${formatRate(telemetry.current.netIn)} in`}
                icon={Network}
                hint={`${formatRate(telemetry.current.netOut)} out`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-5 sm:grid-cols-3">
              <Detail label="Uptime" value={formatUptime(telemetry.current.uptimeSeconds)} icon={Clock} />
              <Detail label="Processes" value={String(telemetry.current.processes)} icon={Activity} />
              <Detail label="Operating system" value={selected.os_label} icon={ServerIcon} />
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

function MiniMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="tabular-nums text-slate-300">{value.toFixed(0)}%</span>
      </div>
      <UsageBar value={value} />
    </div>
  );
}

function Detail({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}
