import { ContainerMetadata, Context, execAsync, log, Lookup, sanitizeArgs } from '@/modules/core';

export async function psCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[Command:PS] invoked with args', args);
  const { username } = context;
  const safeArgs = sanitizeArgs(args);
  const command = `docker ps ${safeArgs} \
    --filter 'label=${ContainerMetadata.User}=${username}' \
    --format '{{.Label "${ContainerMetadata.Name}"}}|{{.State}}|{{.RunningFor}}|{{.Image}}'`;

  const raw = await execAsync(command);

  const result = raw
    .split('\n')
    .filter(p=> p.trim().length > 0)
    .map(p => {
      const [name, state, uptime, image] = p.split('|');

      return {
        name,
        state,
        uptime,
        image
      }
    });

  return result;
}
