"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkPassword, endSession, hashPassword, requireUser, startSession } from "@/lib/auth";
import { getDict, LOCALE_COOKIE } from "@/lib/i18n";
import { isCurrency } from "@/lib/format";
import { MORE_OPTIONS } from "@/lib/limits";
import { isValidSlug, slugify, uniqueSlug } from "@/lib/slug";
import { isTemplate } from "@/templates/registry";

export type FormState = { error?: string; ok?: boolean; slug?: string };

export async function setLocale(locale: string) {
  (await cookies()).set(LOCALE_COOKIE, locale === "bn" ? "bn" : "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export async function logout() {
  await endSession();
  redirect("/");
}

const text = (fd: FormData, key: string, max = 300) => String(fd.get(key) ?? "").trim().slice(0, max);

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const { t } = await getDict();
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: t.auth.errEmail };
  if (password.length < 6) return { error: t.auth.errPassword };
  if (await db.user.findUnique({ where: { email }, select: { id: true } })) return { error: t.auth.errExists };

  const user = await db.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      shop: { create: { slug: await uniqueSlug(slugify(email.split("@")[0])) } },
    },
  });
  await startSession(user.id);
  redirect("/dashboard");
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const { t } = await getDict();
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await checkPassword(password, user.passwordHash))) return { error: t.auth.errLogin };
  await startSession(user.id);
  redirect("/dashboard");
}

export async function saveBusiness(_: FormState, fd: FormData): Promise<FormState> {
  const { t } = await getDict();
  const { shop } = await requireUser();

  const name = text(fd, "name", 80);
  const data = {
    name,
    description: text(fd, "description", 600),
    instagram: text(fd, "instagram", 120),
    facebook: text(fd, "facebook", 120),
    whatsapp: text(fd, "whatsapp", 40),
    messenger: text(fd, "messenger", 120),
    currency: isCurrency(text(fd, "currency", 3)) ? text(fd, "currency", 3) : shop.currency,
  };

  // The address changes only when the seller edits it, because links may already be shared.
  let slug = shop.slug;
  const wanted = text(fd, "slug", 40).toLowerCase();
  if (wanted && wanted !== shop.slug) {
    if (wanted.length < 3) return { error: t.dash.business.errAddressShort };
    if (!isValidSlug(wanted)) return { error: t.dash.business.errAddress };
    if (await db.shop.findFirst({ where: { slug: wanted, NOT: { id: shop.id } }, select: { id: true } })) {
      return { error: t.dash.business.errAddress };
    }
    slug = wanted;
  } else if (name && !shop.slugCustom && (await db.product.count({ where: { shopId: shop.id } })) === 0) {
    // The address follows the business name while nothing has been shared yet. Once there
    // are products (so links may be out there) or the seller picks their own, it stays put.
    const auto = slugify(name);
    if (auto) slug = await uniqueSlug(auto, shop.id);
  }

  await db.shop.update({ where: { id: shop.id }, data: { ...data, slug, slugCustom: shop.slugCustom || slug !== shop.slug && !!wanted } });
  revalidatePath("/dashboard", "layout");
  return { ok: true, slug };
}

/** A seller who wants more than the product limit leaves their details here. */
export async function requestMoreProducts(_: FormState, fd: FormData): Promise<FormState> {
  const { t } = await getDict();
  const { user, shop } = await requireUser();
  const email = text(fd, "email", 200).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: t.dash.products.moreErr };
  const wanted = text(fd, "wanted", 40);
  await db.productLimitRequest.create({
    data: {
      userId: user.id,
      email,
      shopName: shop.name,
      shopSlug: shop.slug,
      wanted: MORE_OPTIONS.includes(wanted) ? wanted : "",
      note: text(fd, "note", 1000),
    },
  });
  return { ok: true };
}

export async function chooseTemplate(id: string) {
  const { shop } = await requireUser();
  if (!isTemplate(id)) return;
  await db.shop.update({ where: { id: shop.id }, data: { template: id } });
  revalidatePath("/dashboard", "layout");
}
