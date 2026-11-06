export type Environment = 'production' | 'staging' | 'development';
export type Severity = 'warning' | 'critical';
export type Metric = 'cpu' | 'memory' | 'disk';
export type HealthStatus = 'healthy' | Severity;

export const ENVIRONMENTS: Environment[] = ['production', 'staging', 'development'];
export const METRICS: Metric[] = ['cpu', 'memory', 'disk'];

export const METRIC_LABELS: Record<Metric, string> = {
  cpu: 'CPU',
  memory: 'Memory',
  disk: 'Disk',
};

export const THRESHOLDS: Record<Severity, number> = {
  warning: 75,
  critical: 90,
};

export interface Server {
  id: string;
  name: string;
  host: string;
  environment: Environment;
  os_label: string;
  created_at: string;
}

export interface Alert {
  id: string;
  server_id: string;
  severity: Severity;
  metric: Metric;
  message: string;
  acknowledged: boolean;
  created_at: string;
}

export interface Snapshot {
  cpu: number;
  memory: number;
  disk: number;
  netIn: number;
  netOut: number;
  uptimeSeconds: number;
  processes: number;
  load: number;
}

export function severityFor(value: number): Severity | null {
  if (value >= THRESHOLDS.critical) return 'critical';
  if (value >= THRESHOLDS.warning) return 'warning';
  return null;
}

export function healthFor(snapshot: Snapshot): HealthStatus {
  const severities = METRICS.map((metric) => severityFor(snapshot[metric]));
  if (severities.includes('critical')) return 'critical';
  if (severities.includes('warning')) return 'warning';
  return 'healthy';
}

export function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatRate(kbps: number): string {
  return kbps >= 1024 ? `${(kbps / 1024).toFixed(1)} MB/s` : `${Math.round(kbps)} KB/s`;
}

export function formatRelativeTime(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
