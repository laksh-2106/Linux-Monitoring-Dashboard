import { useState } from 'react';
import { Sidebar, type Page } from '@/components/Sidebar';
import { useAlerts } from '@/hooks/useAlerts';
import { useFleetTelemetry } from '@/hooks/useFleetTelemetry';
import { useServers } from '@/hooks/useServers';
import { METRIC_LABELS, type Metric, type Severity } from '@/lib/monitoring';
import { AlertsPage } from '@/pages/AlertsPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { ServersPage } from '@/pages/ServersPage';

export default function App() {
  const [page, setPage] = useState<Page>('overview');
  const serversState = useServers();
  const alertsState = useAlerts();
  const { servers } = serversState;

  const handleBreach = (serverId: string, metric: Metric, severity: Severity, value: number) => {
    const serverName = servers.find((server) => server.id === serverId)?.name ?? 'Unknown server';
    void alertsState.raiseAlert({
      server_id: serverId,
      severity,
      metric,
      message: `${METRIC_LABELS[metric]} at ${Math.round(value)}% on ${serverName}`,
    });
  };

  const fleet = useFleetTelemetry(
    servers.map((server) => server.id),
    handleBreach,
  );

  const activeAlertCount = alertsState.alerts.filter((alert) => !alert.acknowledged).length;

  const handleDeleteServer = async (id: string) => {
    const removed = await serversState.deleteServer(id);
    if (removed) await alertsState.reload();
    return removed;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <Sidebar page={page} onNavigate={setPage} activeAlertCount={activeAlertCount} />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {page === 'overview' && (
          <OverviewPage
            servers={servers}
            fleet={fleet}
            activeAlertCount={activeAlertCount}
            onNavigate={setPage}
          />
        )}
        {page === 'servers' && (
          <ServersPage
            servers={servers}
            fleet={fleet}
            loading={serversState.loading}
            error={serversState.error}
            onCreate={serversState.createServer}
            onUpdate={serversState.updateServer}
            onDelete={handleDeleteServer}
          />
        )}
        {page === 'alerts' && (
          <AlertsPage
            alerts={alertsState.alerts}
            servers={servers}
            loading={alertsState.loading}
            error={alertsState.error}
            onAcknowledge={alertsState.acknowledgeAlert}
          />
        )}
      </main>
    </div>
  );
}
