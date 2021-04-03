import { ContainerMetadata, Context, Lookup, sanitizeArgs } from '@/modules/core';
import { exec } from 'shelljs';

export async function psCommand(context: Context, args: Lookup, payload: Lookup) {
  console.log('[Command:PS] invoked with args', args);
  const { username } = context;
  const safeArgs = sanitizeArgs(args);
  const command = `docker ps ${safeArgs} \
    --filter 'label=${ContainerMetadata.User}=${username}' \
    --format '{{.Label "${ContainerMetadata.Name}"}}|{{.State}}|{{.RunningFor}}|{{.Image}}'`;

  const raw = await new Promise<string>((accept, reject) =>
    exec(
      command,
      (exitCode, data, err) => exitCode !== 0 ? reject(err) : accept(data)
    ));

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
