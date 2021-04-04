import { ContainerMetadata, Context, execAsync, log, Lookup, serializeArgs, validateArgs } from '@/modules/core';

const SUPPORTED_ARGS = {
  '-a': []
};

export async function psCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[ps] invoked with args', args);

  // Validate before going any further.
  validateArgs(args, SUPPORTED_ARGS);
  
  const { username } = context;
  const serialArgs = serializeArgs(args);
  const command = `docker ps ${serialArgs} \
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
