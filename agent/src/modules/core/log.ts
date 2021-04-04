export function log(...data: unknown[]) {
  console.log(`[cloudev] `, ...data);
}

export function logError(...data: unknown[]) {
  console.error(`[cloudev] `, ...data); 
}