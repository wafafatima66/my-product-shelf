import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { LocaleSwitch } from "@/components/LocaleSwitch";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getUser()) redirect("/dashboard");
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <LocaleSwitch />
      </header>
      <main className="mx-auto grid w-full max-w-md flex-1 content-start px-5 pb-16 pt-6 md:pt-14">
        <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-[0_14px_44px_rgba(57,53,51,.1)] md:p-9">
          {children}
        </div>
      </main>
    </div>
  );
}
