// frontend/lib/api.ts
const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

type Opts = RequestInit & { auth?: boolean };

export async function api(path: string, opts: Opts = {}) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    ...opts,
    credentials: 'include', // <- cookies HttpOnly
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

// Helpers alignés sur ton backend

// Inscription (ton endpoint existant côté back)
export function signupEmailPassword(data: { email: string; password: string; name?: string }) {
  return api(`/api/user/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Login email+password via le BACKEND JWT (pose les cookies HttpOnly)
export function loginEmailPassword(email: string, password: string) {
  return api(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Déconnexion (révoque refresh et efface les cookies)
export function logout() {
  return api(`/auth/logout`, { method: "POST" });
}

// “Qui suis-je ?” (protégé) — grâce aux cookies + credentials: 'include'
export function fetchMe() {
  return api(`/api/user/me`, { auth: true }); // auth:true => retry auto via /auth/refresh si 401
}

// Exemple d’appel protégé
export function fetchMyNfts() {
  return api(`/api/nft/mine`, { auth: true });
}
