// frontend/lib/api.ts
const API = process.env.NEXT_PUBLIC_API_BASE!;

type Opts = RequestInit & { auth?: boolean };

export async function api(path: string, opts: Opts = {}) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    ...opts,
    credentials: 'include',            // <- cookies HttpOnly
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });

  // Tentative de refresh automatique si 401 sur une route protégée
  if (res.status === 401 && opts.auth) {
    const r = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
    if (r.ok) {
      // rejoue la requête
      const retry = await fetch(url, {
        ...opts,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(opts.headers || {}),
        },
      });
      return handleJson(retry);
    }
  }
  return handleJson(res);
}

async function handleJson(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText) as any;
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
