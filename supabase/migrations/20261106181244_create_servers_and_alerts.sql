/*
# Create servers and alerts tables

1. New Tables
- `servers`: Linux hosts being monitored. Columns: id, name, host, environment (production, staging, development), os_label, created_at.
- `alerts`: Threshold events raised for a server. Columns: id, server_id (references servers, cascades on delete), severity (warning, critical), metric (cpu, memory, disk), message, acknowledged, created_at.

2. Security
- Row Level Security enabled on both tables.
- The app has no sign-in, so anon and authenticated roles get full CRUD on both tables (data is intentionally shared).

3. Notes
- Indexes on alerts(server_id) and alerts(created_at) to support per-server and recent-first queries.
*/

CREATE TABLE IF NOT EXISTS servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  host text NOT NULL,
  environment text NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'staging', 'development')),
  os_label text NOT NULL DEFAULT 'Ubuntu 22.04',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  severity text NOT NULL CHECK (severity IN ('warning', 'critical')),
  metric text NOT NULL CHECK (metric IN ('cpu', 'memory', 'disk')),
  message text NOT NULL,
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS alerts_server_id_idx ON alerts (server_id);
CREATE INDEX IF NOT EXISTS alerts_created_at_idx ON alerts (created_at DESC);

ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON servers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON alerts TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_servers" ON servers;
CREATE POLICY "anon_select_servers" ON servers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_servers" ON servers;
CREATE POLICY "anon_insert_servers" ON servers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_servers" ON servers;
CREATE POLICY "anon_update_servers" ON servers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_servers" ON servers;
CREATE POLICY "anon_delete_servers" ON servers FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_alerts" ON alerts;
CREATE POLICY "anon_select_alerts" ON alerts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alerts" ON alerts;
CREATE POLICY "anon_insert_alerts" ON alerts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alerts" ON alerts;
CREATE POLICY "anon_update_alerts" ON alerts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alerts" ON alerts;
CREATE POLICY "anon_delete_alerts" ON alerts FOR DELETE
  TO anon, authenticated USING (true);
