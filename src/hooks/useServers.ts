import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Environment, Server } from '@/lib/monitoring';

export interface ServerInput {
  name: string;
  host: string;
  environment: Environment;
  os_label: string;
}

export function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error: queryError } = await supabase
      .from('servers')
      .select('id, name, host, environment, os_label, created_at')
      .order('created_at', { ascending: true });

    if (queryError || !Array.isArray(data)) {
      setError('Could not load your servers. Please refresh the page.');
    } else {
      setServers(data as Server[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createServer = useCallback(
    async (input: ServerInput): Promise<boolean> => {
      const { error: insertError } = await supabase.from('servers').insert(input);
      if (insertError) return false;
      await reload();
      return true;
    },
    [reload],
  );

  const updateServer = useCallback(
    async (id: string, input: ServerInput): Promise<boolean> => {
      const { error: updateError } = await supabase.from('servers').update(input).eq('id', id);
      if (updateError) return false;
      await reload();
      return true;
    },
    [reload],
  );

  const deleteServer = useCallback(
    async (id: string): Promise<boolean> => {
      const { error: deleteError } = await supabase.from('servers').delete().eq('id', id);
      if (deleteError) return false;
      await reload();
      return true;
    },
    [reload],
  );

  return { servers, loading, error, reload, createServer, updateServer, deleteServer };
}
