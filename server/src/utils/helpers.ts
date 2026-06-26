/**
 * Safely parse a route param to number.
 * Express 5 types params as `string | string[]` — this handles both.
 */
export function paramId(value: any): number {
  return parseInt(Array.isArray(value) ? value[0] : value, 10);
}

/**
 * Safely parse a query param to number with default.
 */
export function queryInt(value: any, defaultValue: number): number {
  if (value === undefined || value === null) return defaultValue;
  const v = parseInt(Array.isArray(value) ? value[0] : value, 10);
  return isNaN(v) ? defaultValue : v;
}

/**
 * Safely parse a query param to string.
 */
export function queryStr(value: any): string | undefined {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? value[0] : String(value);
}
