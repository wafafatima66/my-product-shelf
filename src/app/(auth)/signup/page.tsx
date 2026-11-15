import type { Metadata } from "next";
import { signup } from "@/app/actions";
import { getDict } from "@/lib/i18n";
import AuthForm from "../AuthForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return { title: `${t.common.signup} · My Product Shelf` };
}

export default async function SignupPage() {
  const { t } = await getDict();
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{t.auth.signupTitle}</h1>
      <p className="mt-1 text-[15px] text-muted">{t.auth.signupSub}</p>
      <AuthForm mode="signup" action={signup} t={t} />
    </>
  );
}
