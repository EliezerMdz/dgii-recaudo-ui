export function toIso(input?: string | Date) {
  if (!input) return undefined;
  return input instanceof Date
    ? input.toISOString()
    : new Date(input).toISOString();
}

export function buildQuery(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    sp.set(k, v instanceof Date ? v.toISOString() : String(v));
  });
  return sp.toString();
}
