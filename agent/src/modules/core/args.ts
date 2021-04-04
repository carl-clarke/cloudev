import { logError } from "./log";
import { Lookup } from "./lookup";

/**
 * Produces a linear argument string guaranteed to be safe from
 * Bash injection techniques.
 * @returns 
 */
export function validateArgs(args: Lookup, supported: Lookup<'*'|string[]>) {
  const keys = Object.keys(args);
  const unknownArg = keys.find(p => !(p in supported))
  
  const badValueKey = keys
    // .filter(p => args[p] === null)
    // Test for unsafe characters
    .find(p => {
      const value = args[p];
      console.log({ p, value });
      const supportedValue = supported[p];
      const supportsAnyValue = supportedValue === '*';
      const isEmptyEnum = !supportsAnyValue && supportedValue.length === 0;
      const hasUnsafeChars = !/^[a-zA-Z0-9]+(?:\-[a-zA-Z0-9])*$/g.test(value);
      const hasOutOfBoundsValue = isEmptyEnum && value !== null || !isEmptyEnum && !supportsAnyValue && value !== null && !supportedValue.includes(value);

      // console.log({hasOutOfBoundsValue, isEmptyEnum})
      return hasUnsafeChars || hasOutOfBoundsValue;
    });

  if (unknownArg !== undefined) {
    logError(`Bad argument "${unknownArg}" ${args}`);
    throw new Error(`Bad argument "${unknownArg}.`);
  }

  if (badValueKey !== undefined) {
    const badValue = args[badValueKey];
    const supportedValue = supported[badValueKey];
    const valuesSet = Array.isArray(supportedValue) ? supportedValue.join(',') : supportedValue.toString();

    logError(`Bad value "${badValue}" in ${args}`);
    throw new Error(`Bad value "${badValue}". Only values in the set [${valuesSet||'<any>'}] with characters "a-zA-Z0-9" and "-" are allowed.`);
  }

  return true;
}

export function serializeArgs(args: Lookup) {
  return Object
    .keys(args)
    .reduce((result, p) => {
      result += `${p}${(args[p] ?? '')} `;

      return result;
    }, '');
}