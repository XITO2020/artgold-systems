import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";
import type { AuthUser } from "./types";

// Récupère un Bearer token dans l’en-tête Authorization (ou null)
function getBearer(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [scheme, ...rest] = h.trim().split(/\s+/);
  if (!scheme || scheme.toLowerCase() !== "bearer") return null;
  const token = rest.join(" ").trim();
  return token || null;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const fromHeader = getBearer(req);
    const fromCookie = (req as any).cookies?.ag_access as string | undefined;
    const raw = fromHeader || fromCookie;
    if (!raw) return next();

    const payload = verifyToken(raw);
    if (payload && typeof payload === "object" && (payload as any).sub) {
      // On “mappe” le payload JWT vers notre AuthUser
      const {
        sub, email, isAdmin, status, roles, discord, iat, exp, ...rest
      } = payload as Record<string, unknown>;

      // Sécurise les types en runtime (pour plaire à TS et éviter les surprises)
      const user: AuthUser = {
        sub: String(sub),
        email: typeof email === "string" ? email : undefined,
        isAdmin: typeof isAdmin === "boolean" ? isAdmin : undefined,
        status: typeof status === "string" ? status : undefined,
        roles: Array.isArray(roles) ? (roles as string[]) : [],
        discord: (discord && typeof discord === "object") ? (discord as any) : undefined,
        iat: typeof iat === "number" ? iat : undefined,
        exp: typeof exp === "number" ? exp : undefined,
        // rest: ignoré volontairement pour garder un shape maîtrisé
      };

      req.user = user;
    }
  } catch {
    // token invalide -> on laisse req.user undefined (route publique)
  } finally {
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "unauthorized" });
  next();
}

// (optionnel) petit type pratique pour éviter les cast dans les routes
export type AuthenticatedRequest = Request & { user: AuthUser };
