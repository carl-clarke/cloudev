import { Lookup } from "./lookup";

const SUPPORTED_ARGS = {
  '-a': []
};

/**
 * Produces a linear argument string guaranteed to be safe from
 * Bash injection techniques.
 * @returns 
 */
export function sanitizeArgs(args: Lookup) {
  const keys = Object.keys(args);
  const hasUnknownArgs = keys.some(p => !(p in SUPPORTED_ARGS))

  const hasBadValues = Object
    .values(args)
    .filter(p => p === null)
    .some(p => !/^[a-zA-Z0-9]+(?:\-[a-zA-Z0-9])*$/g.test(p));

  if (hasUnknownArgs) {
    console.log(`[Command:PS] bad args ${args}`);
    throw new Error('[Command:PS] bad arguments.')
  }

  if (hasBadValues) {
    console.log(`[Command:PS] bad values ${args}`);
    throw new Error('[Command:PS] bad values. Only characters "a-zA-Z0-9" and "-" are allowed.')
  }

  return keys.reduce((result, p) => {
    result += `${p}${(args[p] ?? '')} `;

    return result;
  }, '');
}