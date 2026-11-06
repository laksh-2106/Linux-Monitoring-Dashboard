import { useEffect, useRef, useState } from 'react';
import {
  METRICS,
  severityFor,
  type Metric,
  type Severity,
  type Snapshot,
} from '@/lib/monitoring';
import {
  createSnapshot,
  HISTORY_LENGTH,
  nextSnapshot,
  TELEMETRY_INTERVAL_MS,
} from '@/lib/telemetry';

export interface ServerTelemetry {
  current: Snapshot;
  cpuHistory: number[];
  memoryHistory: number[];
}

export type FleetTelemetry = Record<string, ServerTelemetry>;

export type BreachHandler = (
  serverId: string,
  metric: Metric,
  severity: Severity,
  value: number,
) => void;

const SEVERITY_RANK: Record<Severity, number> = { warning: 1, critical: 2 };

function initialTelemetry(): ServerTelemetry {
  const current = createSnapshot();
  return { current, cpuHistory: [current.cpu], memoryHistory: [current.memory] };
}

function advance(previous: ServerTelemetry): ServerTelemetry {
  const current = nextSnapshot(previous.current);
  return {
    current,
    cpuHistory: [...previous.cpuHistory, current.cpu].slice(-HISTORY_LENGTH),
    memoryHistory: [...previous.memoryHistory, current.memory].slice(-HISTORY_LENGTH),
  };
}

export function useFleetTelemetry(serverIds: string[], onBreach: BreachHandler): FleetTelemetry {
  const [fleet, setFleet] = useState<FleetTelemetry>({});
  const idsKey = serverIds.join(',');
  const onBreachRef = useRef(onBreach);
  const breachRanksRef = useRef<Record<string, number>>({});

  useEffect(() => {
    onBreachRef.current = onBreach;
  });

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];

    setFleet((previous) => {
      const next: FleetTelemetry = {};
      for (const id of ids) next[id] = previous[id] ?? initialTelemetry();
      return next;
    });

    const timer = window.setInterval(() => {
      setFleet((previous) => {
        const next: FleetTelemetry = {};
        for (const id of ids) next[id] = advance(previous[id] ?? initialTelemetry());
        return next;
      });
    }, TELEMETRY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [idsKey]);

  useEffect(() => {
    for (const [serverId, telemetry] of Object.entries(fleet)) {
      for (const metric of METRICS) {
        const value = telemetry.current[metric];
        const severity = severityFor(value);
        const key = `${serverId}:${metric}`;
        const previousRank = breachRanksRef.current[key] ?? 0;
        const rank = severity ? SEVERITY_RANK[severity] : 0;

        if (severity && rank > previousRank) {
          onBreachRef.current(serverId, metric, severity, value);
        }
        breachRanksRef.current[key] = rank;
      }
    }
  }, [fleet]);

  return fleet;
}
