import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slug";

const COOKIE = "pr_session";
const SESSION_DAYS = 30;

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const checkPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.session.create({ data: { tokenHash: sha(token), userId, expiresAt } });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: sha(token) } });
  jar.delete(COOKIE);
}

/** The logged-in user with their shop, or null. */
export async function getUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: sha(token) },
    include: { user: { include: { shop: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

/** Pages and route handlers that need a logged-in user with a shop. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.shop) return { user, shop: user.shop };
  const shop = await db.shop.create({
    data: { userId: user.id, slug: await uniqueSlug(slugify(user.email.split("@")[0])) },
  });
  return { user, shop };
}
