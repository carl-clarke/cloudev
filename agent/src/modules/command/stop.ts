import { Context, execAsync, log, Lookup, serializeArgs, validateArgs } from '@/modules/core';

const SUPPORTED_ARGS = {
};

const SUPPORTED_PAYLOAD = {
  name: '*' as '*'
};

export async function stopCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[stop] invoked with args', args);

  // Validate before going any further.
  validateArgs(args, SUPPORTED_ARGS);
  validateArgs(payload, SUPPORTED_PAYLOAD);

  const { username } = context;
  const containerId = `${username}.${payload.name}`;
  const serialArgs = serializeArgs(args);
  const command = `docker stop ${serialArgs} ${containerId}`;
  const raw = await execAsync(command);

  if (raw.trim() !== containerId) {
    throw new Error('Container did not stop.')
  }
}
