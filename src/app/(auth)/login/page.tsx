import type { Metadata } from "next";
import { login } from "@/app/actions";
import { getDict } from "@/lib/i18n";
import AuthForm from "../AuthForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: `${t.common.login} · My Product Shelf` };
}

export default async function LoginPage() {
  const { t } = await getDict();
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{t.auth.loginTitle}</h1>
      <p className="mt-1 text-[15px] text-muted">{t.auth.loginSub}</p>
      <AuthForm mode="login" action={login} t={t} />
    </>
  );
}
