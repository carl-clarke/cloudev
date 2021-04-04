import { Context, execAsync, log, Lookup, serializeArgs, validateArgs } from '@/modules/core';

const SUPPORTED_ARGS = {
};

const SUPPORTED_PAYLOAD = {
  name: '*' as '*'
};

export async function rmCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[start] invoked with args', args);

  // Validate before going any further.
  validateArgs(args, SUPPORTED_ARGS);
  validateArgs(payload, SUPPORTED_PAYLOAD);

  const { username } = context;
  const serialArgs = serializeArgs(args);
  const command = `docker start ${serialArgs} ${username}.${payload.name}`;
  const raw = await execAsync(command);

  return {
    success: raw !== ''
  };
}
