const API_BASE = new URL('/api/dgii/', import.meta.env.VITE_API_BASE_URL);

export async function apiFetch(path: string, init?: RequestInit) {
  const url = new URL(path, API_BASE);
  const res = await fetch(url.toString(), init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res;
}
