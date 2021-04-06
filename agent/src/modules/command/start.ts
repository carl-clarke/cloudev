import { Context, execAsync, log, Lookup, serializeArgs, validateArgs } from '@/modules/core';

const SUPPORTED_ARGS = {
};

const SUPPORTED_PAYLOAD = {
  name: '*' as '*'
};

export async function startCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[start] invoked with args', args);

  // Validate before going any further.
  validateArgs(args, SUPPORTED_ARGS);
  validateArgs(payload, SUPPORTED_PAYLOAD);

  const { handle } = context;
  const containerId = `${handle}.${payload.name}`;
  const serialArgs = serializeArgs(args);
  const command = `docker start ${serialArgs} ${containerId}`;
  const raw = await execAsync(command);

  if (raw.trim() !== containerId) {
    throw new Error('Container did not start.')
  }
}
