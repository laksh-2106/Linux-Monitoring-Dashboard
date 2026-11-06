import type { Snapshot } from '@/lib/monitoring';

export const TELEMETRY_INTERVAL_MS = 2000;
export const HISTORY_LENGTH = 40;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const jitter = (amount: number) => (Math.random() * 2 - 1) * amount;

export function createSnapshot(): Snapshot {
  return {
    cpu: randomBetween(15, 55),
    memory: randomBetween(35, 70),
    disk: randomBetween(30, 70),
    netIn: randomBetween(50, 800),
    netOut: randomBetween(20, 400),
    uptimeSeconds: Math.floor(randomBetween(3 * 86400, 90 * 86400)),
    processes: Math.round(randomBetween(120, 320)),
    load: randomBetween(0.2, 2.5),
  };
}

export function nextSnapshot(previous: Snapshot): Snapshot {
  const spike = Math.random() < 0.04 ? randomBetween(15, 35) : 0;
  return {
    cpu: clamp(previous.cpu + jitter(6) + (35 - previous.cpu) * 0.05 + spike, 1, 99),
    memory: clamp(previous.memory + jitter(1.5) + (55 - previous.memory) * 0.02, 5, 99),
    disk: clamp(previous.disk + jitter(0.1), 5, 99),
    netIn: Math.max(0, previous.netIn + jitter(120)),
    netOut: Math.max(0, previous.netOut + jitter(80)),
    uptimeSeconds: previous.uptimeSeconds + TELEMETRY_INTERVAL_MS / 1000,
    processes: Math.round(clamp(previous.processes + jitter(3), 80, 400)),
    load: clamp(previous.load + jitter(0.15), 0, 8),
  };
}
