import { Router } from "express";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { signToken, verifyToken } from "./jwt";
import { setAuthCookies, clearAuthCookies } from "./cookies";
import { issueRefreshToken, rotateRefreshToken, revokeRefreshToken, hashToken } from "./refresh";
import { deriveRoles } from "./roles";

const prisma = new PrismaClient();
export const authRouter = Router();

authRouter.post("/login",
  body("email").isEmail(),
  body("password").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.email) return res.status(401).json({ error: "invalid_credentials" });

    // TEMP dev: même logique que ton front
    const ok = (email === "admin@naim.com" && password === "7654321");
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    if (user.status === "BANNED" || user.status === "FROZEN") {
      return res.status(403).json({ error: "account_restricted", status: user.status });
    }

    const roles = await deriveRoles(user.id, user.isAdmin);
    const access = signToken({
      sub: user.id, email: user.email, isAdmin: user.isAdmin, status: user.status, roles,
      discord: { verified: user.discordVerified, roles: user.discordRoles }
    }, "15m");
    const refresh = await issueRefreshToken(user.id);

    setAuthCookies(res, access, refresh);
    res.json({ ok: true });
  }
);

authRouter.post("/refresh", async (req, res) => {
  const raw = req.cookies?.ag_refresh;
  if (!raw) return res.status(401).json({ error: "no_refresh" });

  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(raw) } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) return res.status(401).json({ error: "invalid_refresh" });

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) return res.status(401).json({ error: "invalid_user" });

  const newRaw = await rotateRefreshToken(raw, user.id);
  const roles = await deriveRoles(user.id, user.isAdmin);
  const access = signToken({
    sub: user.id, email: user.email, isAdmin: user.isAdmin, status: user.status, roles,
    discord: { verified: user.discordVerified, roles: user.discordRoles }
  }, "15m");

  setAuthCookies(res, access, newRaw);
  res.json({ ok: true });
});

authRouter.post("/logout", async (req, res) => {
  const raw = req.cookies?.ag_refresh;
  if (raw) await revokeRefreshToken(raw);
  clearAuthCookies(res);
  res.json({ ok: true });
});

authRouter.get("/me", async (req, res) => {
  const token = req.cookies?.ag_access;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: "unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: (payload as any).sub },
    select: {
      id: true, email: true, name: true, image: true,
      isAdmin: true, status: true, discordVerified: true, discordRoles: true
    }
  });
  if (!user) return res.status(404).json({ error: "not_found" });

  const roles = await deriveRoles(user.id, user.isAdmin);
  res.json({ ...user, roles });
});
