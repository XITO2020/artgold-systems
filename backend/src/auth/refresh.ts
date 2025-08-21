import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);

function base64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
export function generateOpaqueToken() {
  return base64url(crypto.randomBytes(32));
}
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function issueRefreshToken(userId: string): Promise<string> {
  const plain = generateOpaqueToken();
  const tokenHash = hashToken(plain);
  const expires = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt: expires } });
  return plain;
}

export async function rotateRefreshToken(oldPlain: string, userId: string) {
  const oldHash = hashToken(oldPlain);
  const prev = await prisma.refreshToken.findUnique({ where: { tokenHash: oldHash } });
  if (!prev || prev.userId !== userId || prev.revoked || prev.expiresAt < new Date()) {
    throw new Error("invalid_refresh");
  }
  await prisma.refreshToken.update({ where: { tokenHash: oldHash }, data: { revoked: true } });
  return issueRefreshToken(userId);
}

export async function revokeRefreshToken(plain: string) {
  const tokenHash = hashToken(plain);
  await prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
}
