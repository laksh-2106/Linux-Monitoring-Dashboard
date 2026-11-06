import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Alert, Metric, Severity } from '@/lib/monitoring';

export interface NewAlert {
  server_id: string;
  severity: Severity;
  metric: Metric;
  message: string;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error: queryError } = await supabase
      .from('alerts')
      .select('id, server_id, severity, metric, message, acknowledged, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (queryError || !Array.isArray(data)) {
      setError('Could not load alerts. Please refresh the page.');
    } else {
      setAlerts(data as Alert[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const raiseAlert = useCallback(
    async (input: NewAlert): Promise<boolean> => {
      const { error: insertError } = await supabase.from('alerts').insert(input);
      if (insertError) return false;
      await reload();
      return true;
    },
    [reload],
  );

  const acknowledgeAlert = useCallback(
    async (id: string): Promise<boolean> => {
      const { error: updateError } = await supabase
        .from('alerts')
        .update({ acknowledged: true })
        .eq('id', id);
      if (updateError) return false;
      await reload();
      return true;
    },
    [reload],
  );

  return { alerts, loading, error, reload, raiseAlert, acknowledgeAlert };
}
