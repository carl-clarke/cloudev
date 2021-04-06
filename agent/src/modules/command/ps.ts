import { ContainerMetadata, Context, execAsync, log, Lookup, serializeArgs, validateArgs } from '@/modules/core';

const SUPPORTED_ARGS = {
  '-a': []
};

export async function psCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[ps] invoked with args', args);

  // Validate before going any further.
  validateArgs(args, SUPPORTED_ARGS);

  const { identity, handle } = context;
  const serialArgs = serializeArgs(args);
  const command = `docker ps ${serialArgs} \
    --filter 'label=${ContainerMetadata.User}=${handle}' \
    --format '{{.Label "${ContainerMetadata.Name}"}}|{{.State}}|{{.RunningFor}}|{{.Image}}|{{.Label "${ContainerMetadata.Port}"}}'`;

  const raw = await execAsync(command);

  const results = raw
    .split('\n')
    .filter(p => p.trim().length > 0)
    .map(p => {
      const [name, state, uptime, image, port] = p.split('|');

      return {
        name,
        state,
        uptime,
        image,
        port: Number.parseInt(port, 10),
        memory: {
          usage: '',
          percentage: ''
        },
      }
    });

  for (const item of results.filter(p => p.state === 'running')) {
    const rawStats = await execAsync(`docker stats ${handle}.${item.name} --no-stream --format '{{.MemUsage}}|{{.MemPerc}}'`);
    const stats = rawStats
      .split('\n')
      .filter(p => p.trim().length > 0)
      .reduce((_result, p) => {
        const [usage, percentage] = p.split('|');

        return { usage, percentage };
      }, {} as { usage: string; percentage: string; });
    
    item.memory = stats
  }

  return results;
}
