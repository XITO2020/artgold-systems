import { Response } from "express";

const isProd = process.env.NODE_ENV === "production";
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);

export function setAuthCookies(res: Response, access: string, refresh: string) {
  res.cookie("ag_access", access, {
    httpOnly: true, secure: isProd, sameSite: "lax",
    maxAge: 15 * 60 * 1000, path: "/",
  });
  res.cookie("ag_refresh", refresh, {
    httpOnly: true, secure: isProd, sameSite: "lax",
    maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000, path: "/",
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("ag_access", { path: "/" });
  res.clearCookie("ag_refresh", { path: "/" });
}
