"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import type { Dict } from "@/lib/i18n/en";
import { btn, input, label } from "@/components/ui";

export default function AuthForm({
  mode,
  action,
  t,
}: {
  mode: "signup" | "login";
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  t: Dict;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const signup = mode === "signup";

  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor="email" className={label}>{t.auth.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={input} placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          {t.auth.password} {signup && <span className="font-normal text-muted">({t.auth.passwordHint})</span>}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={signup ? "new-password" : "current-password"}
          required
          className={input}
        />
      </div>
      <p role="alert" className="min-h-5 text-[13px] text-red-700">{state.error}</p>
      <button className={`${btn} w-full`} disabled={pending}>
        {signup ? t.common.signup : t.common.login}
      </button>
      <p className="text-center text-sm text-muted">
        {signup ? t.auth.haveAccount : t.auth.noAccount}{" "}
        <Link href={signup ? "/login" : "/signup"} className="font-semibold text-ink underline underline-offset-2">
          {signup ? t.common.login : t.common.signup}
        </Link>
      </p>
    </form>
  );
}
