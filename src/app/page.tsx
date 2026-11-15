import type { Metadata } from "next";
import Link from "next/link";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { Logo } from "@/components/Logo";
import ScaledFrame from "@/components/ScaledFrame";
import { Frame, Label, PillLink, Rainbow, Script, ScrollBadge, Stamp } from "@/components/home/parts";
import { getUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getDict } from "@/lib/i18n";
import { DEMO } from "@/templates/demo";
import { FacebookIcon, InstagramIcon, MessengerIcon, ShareIcon, WhatsAppIcon } from "@/templates/shared/Icons";
import { TEMPLATES } from "@/templates/registry";

const photo = (id: string) => DEMO.products.find((p) => p.id === id)!;

/** A phone frame around a live demo gallery. */
function Phone({ id, name, eager = false, className = "" }: { id: string; name: string; eager?: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[2.2rem] border-[7px] border-ink bg-ink shadow-[0_30px_60px_-20px_rgba(57,53,51,.45)] ${className}`}>
      <div className="overflow-hidden rounded-[1.7rem]">
        <ScaledFrame src={`/demo/${id}`} title={`${name} demo`} lazy={!eager} baseHeight={800} />
      </div>
    </div>
  );
}

/** "1  Customer asks": a numbered step heading. */
function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-ink text-[12px] font-black text-white">{n}</span>
      <span className="text-[14px] font-black">{label}</span>
    </div>
  );
}

const WHY_STYLE = ["bg-brand", "bg-blue", "bg-teal"];

const PAIN_STYLE = [
  { bg: "bg-blue", icon: <path d="M12 5v10m0 0l-3.5-3.5M12 15l3.5-3.5M7 19h10" /> },
  { bg: "bg-teal", icon: <><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><rect x="8" y="8" width="8" height="8" rx="1.5" /></> },
  { bg: "bg-brand", icon: <><path d="M3 12V4h8l9 9-8 8-9-9z" /><circle cx="7.5" cy="8.5" r="1.2" /></> },
];

const SITE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  const h = t.home;
  const image = { url: "/demo/card/d7", width: 1200, height: 630, alt: h.seoTitle };
  return {
    title: { absolute: h.seoTitle },
    description: h.seoDescription,
    keywords: h.seoKeywords,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", siteName: "My Product Shelf", title: h.seoTitle, description: h.seoDescription, images: [image] },
    twitter: { card: "summary_large_image", title: h.seoTitle, description: h.seoDescription, images: [image.url] },
  };
}

const WHO_ICON = ["💍", "👗", "🎂", "🧶", "🧺", "🕯️", "🛍️", "🌱"];

export default async function Home() {
  const { t, locale } = await getDict();
  const h = t.home;
  const user = await getUser();
  const go = user ? "/dashboard" : "/signup";
  const ruby = photo("d7");

  // Structured data so search engines understand what this is and can show the FAQ.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE}/#org`, name: "My Product Shelf", url: SITE },
      { "@type": "WebSite", "@id": `${SITE}/#site`, url: SITE, name: "My Product Shelf", description: h.seoDescription, inLanguage: locale, publisher: { "@id": `${SITE}/#org` } },
      {
        "@type": "SoftwareApplication",
        name: "My Product Shelf",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: h.seoDescription,
        url: SITE,
        featureList: h.features.map((f) => f.title),
      },
      {
        "@type": "FAQPage",
        mainEntity: h.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  // The camera roll "before": many half-readable screenshots.
  const roll = ["d1", "d8", "d4", "d7", "d2", "d6", "d3", "d9", "d5", "d1", "d4", "d8"].map((id, i) => ({
    src: photo(id).thumb,
    rot: [-3, 2, -1, 3, -2, 1, 2, -3, 1, -2, 3, -1][i],
    pos: ["20% 30%", "60% 50%", "40% 20%", "70% 60%"][i % 4],
  }));

  return (
    <div className="overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {/* ---------- floating header ---------- */}
      <header className="sticky top-3 z-40 mx-auto mt-3 max-w-6xl px-3">
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white/95 pl-4 pr-1.5 shadow-[0_8px_30px_rgba(57,53,51,.12)] backdrop-blur">
          <Logo />
          <nav className="hidden items-center gap-6 text-[13.5px] font-bold lg:flex">
            <a href="#why" className="hover:text-brand">{h.navWhy}</a>
            <a href="#card" className="hover:text-brand">{h.navCard}</a>
            <a href="#templates" className="hover:text-brand">{h.navTemplates}</a>
            <a href="#who" className="hover:text-brand">{h.navWho}</a>
            <a href="#faq" className="hover:text-brand">{h.navFaq}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LocaleSwitch />
            {!user && <Link href="/login" className="hidden px-2 text-[13.5px] font-bold hover:text-brand sm:block">{t.common.login}</Link>}
            <Link href={go} className="whitespace-nowrap rounded-xl bg-brand px-4 py-2.5 text-[13.5px] font-black text-white transition hover:bg-brand-dark">
              {user ? `${t.dash.open} →` : t.common.signup}
            </Link>
          </div>
        </div>
      </header>

      <main>
      {/* ---------- hero ---------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-12 md:grid-cols-[1fr_1.05fr] md:pt-16">
        <div>
          <p className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-[13px] font-bold text-ink/80 shadow-sm">{h.heroKicker}</p>
          <h1 className="font-display text-[clamp(36px,6vw,64px)] font-black leading-[1.12] tracking-tight">
            {h.heroBefore}
            <Rainbow text={h.heroWord} locale={locale} />
            {h.heroAfter}
          </h1>
          <p className="mt-6 max-w-xl text-[16.5px] leading-[1.9] text-ink/80">{h.heroSub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={go} className="whitespace-nowrap rounded-xl bg-brand px-7 py-3.5 text-base font-black text-white shadow-[0_4px_0_#b8571f] transition hover:bg-brand-dark active:translate-y-[2px] active:shadow-[0_2px_0_#b8571f]">
              {h.cta}
            </Link>
            <a href="#card" className="whitespace-nowrap rounded-xl border-2 border-ink/80 px-7 py-3.5 text-base font-black transition hover:bg-ink hover:text-white">
              {h.ctaSecondary}
            </a>
          </div>
          <p className="mt-5 text-sm text-muted">{h.heroNote}</p>
        </div>

        {/* a product being shared: photo, Share button, and the chat it lands in */}
        <div className="relative mx-auto h-[460px] w-full max-w-[540px] md:h-[520px]">
          <Frame rotate={-3} className="absolute left-0 top-[8%] z-10 w-[54%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ruby.image} alt={ruby.name} className="aspect-[4/5] w-full rounded-xl object-cover" />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[13px] font-black text-white shadow-[0_3px_0_#b8571f]">
              <ShareIcon className="h-4 w-4" /> {t.gallery.share}
            </span>
            <span className="absolute -bottom-3 left-4 rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white">{ruby.code} · {formatPrice(ruby.price, "BDT")}</span>
          </Frame>

          <div className="absolute right-0 top-0 z-20 w-[52%] rotate-2 overflow-hidden rounded-2xl rounded-tr-md bg-[#d9fdd3] shadow-[0_8px_26px_rgba(57,53,51,.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/card/d7" alt="" className="aspect-[1200/630] w-full object-cover" />
            <div className="flex items-center justify-between px-3 py-2 text-[12px] font-bold">
              <span>{h.heroSent}</span>
              <WhatsAppIcon className="h-4 w-4 text-[#1faa59]" />
            </div>
          </div>
          <div className="absolute right-[3%] top-[41%] z-20 -rotate-2 rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-[14px] font-bold shadow-[0_8px_26px_rgba(57,53,51,.18)]">
            {h.heroFriend}
          </div>
          <div className="absolute right-0 top-[56%] z-20 rotate-1 rounded-2xl rounded-tr-md bg-brand px-4 py-2.5 text-[15px] font-black text-white shadow-[0_8px_26px_rgba(57,53,51,.18)]">
            {h.chatWant} 😍
          </div>
          <Stamp className="absolute bottom-0 right-[14%] z-30"><span>{h.badge}</span></Stamp>
        </div>
      </section>

      <div className="mx-auto -mt-6 hidden max-w-6xl justify-center pb-6 md:flex">
        <ScrollBadge text={h.scroll} />
      </div>

      {/* ---------- the pain points ---------- */}
      <section id="problem" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Label label={h.problemLabel} sub={h.problemSub} />
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.problemTitle}</h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {h.problems.map((p, i) => (
              <div key={p.title} className="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgba(57,53,51,.07)]">
                <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl text-white ${PAIN_STYLE[i].bg}`}>
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {PAIN_STYLE[i].icon}
                  </svg>
                </div>
                <h3 className="font-display text-lg font-black">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.85] text-ink/75">{p.text}</p>
              </div>
            ))}
          </div>

          {/* the pain a DIY seller feels with every enquiry: a clear before -> after flow */}
          <div className="mt-6 overflow-hidden rounded-3xl bg-ink p-6 text-white md:p-10">
            <div className="max-w-3xl">
              <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-wider">4</span>
              <h3 className="mt-4 font-display text-[clamp(24px,3.4vw,34px)] font-black leading-tight">{h.digTitle}</h3>
              <p className="mt-3 text-[16px] leading-[1.9] text-white/80">{h.digText}</p>
            </div>

            <div className="mt-8 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
              {/* WITHOUT */}
              <div className="rounded-2xl bg-white p-5 text-ink">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-[12px] font-black text-red-700">✕ {h.digBeforeLabel}</span>
                  <span className="text-[12.5px] font-bold text-muted">{h.digSlow}</span>
                </div>
                <ol className="mt-5 space-y-5">
                  <li>
                    <Step n={1} label={h.digStepAsk} />
                    <div className="mt-2 w-fit max-w-full rounded-2xl rounded-tl-md bg-paper px-3.5 py-2 text-[13.5px] font-bold">{h.digCustomer}</div>
                  </li>
                  <li>
                    <Step n={2} label={h.digStepScroll} />
                    <div className="relative mt-2">
                      <div className="grid grid-cols-8 gap-1 pr-3">
                        {roll.concat(roll).slice(0, 16).map((r, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={r.src} alt="" className="aspect-square w-full rounded-[3px] object-cover" style={{ objectPosition: r.pos }} />
                        ))}
                      </div>
                      <span aria-hidden className="absolute right-0 top-0 h-full w-1.5 rounded-full bg-ink/10">
                        <span className="block h-4 w-full rounded-full bg-ink/50" />
                      </span>
                    </div>
                  </li>
                  <li>
                    <Step n={3} label={h.digStepWait} />
                    <p className="mt-2 text-[13.5px] font-bold text-red-700">{h.digWaiting}</p>
                  </li>
                </ol>
              </div>

              <div className="grid place-items-center" aria-hidden>
                <span className="grid h-12 w-12 rotate-90 place-items-center rounded-full bg-brand text-white shadow-lg md:rotate-0">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m0 0l-5-5m5 5l-5 5" />
                  </svg>
                </span>
              </div>

              {/* WITH PRODUCT RACK */}
              <div className="rounded-2xl bg-white p-5 text-ink ring-2 ring-brand">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#d6f1e0] px-3 py-1 text-[12px] font-black text-ok">✓ {h.digAfterLabel}</span>
                  <span className="text-[12.5px] font-bold text-muted">{h.digFast}</span>
                </div>
                <ol className="mt-5 space-y-5">
                  <li>
                    <Step n={1} label={h.digStepAsk} />
                    <div className="mt-2 w-fit max-w-full rounded-2xl rounded-tl-md bg-paper px-3.5 py-2 text-[13.5px] font-bold">{h.digCustomer}</div>
                  </li>
                  <li>
                    <Step n={2} label={h.digStepType} />
                    <div className="mt-2 flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-[14px] font-bold" dir="ltr">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                      </svg>
                      {h.digSearch}
                    </div>
                  </li>
                  <li>
                    <Step n={3} label={h.digStepShare} />
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-line p-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ruby.thumb} alt="" className="h-14 w-14 flex-none rounded-xl object-cover" />
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="truncate text-[14px] font-black">{ruby.name}</div>
                        <div className="text-[12.5px] text-muted">{ruby.code} · {formatPrice(ruby.price, "BDT")}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-[12.5px] font-black text-white">
                        <ShareIcon className="h-3.5 w-3.5" /> {t.gallery.share}
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] font-bold text-ok">{h.digSent}</p>
                  </li>
                </ol>
              </div>
            </div>

            <p className="mt-7 flex items-start gap-2 text-[16px] font-bold">
              <Script className="mt-0.5 text-[28px]">✓</Script>
              {h.digFix}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- why sharing ---------- */}
      <section id="why" className="scroll-mt-20 bg-white px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.15fr]">
          <div>
            <Label label={h.whyLabel} sub={h.whySub} />
            <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.whyTitle}</h2>
            <p className="mt-4 text-[16px] leading-[1.9] text-ink/80">{h.whyText}</p>
          </div>
          <ol className="space-y-4">
            {h.whyPoints.map((p, i) => (
              <li key={p.title} className="flex gap-4 rounded-2xl bg-paper p-5">
                <span className={`grid h-11 w-11 flex-none place-items-center rounded-2xl font-display text-lg font-black text-white ${WHY_STYLE[i]}`}>{i + 1}</span>
                <div>
                  <h3 className="font-display text-lg font-black">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.8] text-ink/75">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- the share card ---------- */}
      <section id="card" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Label label={h.cardLabel} sub={h.cardSub} />
            <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.cardTitle}</h2>
            <p className="mt-4 text-[16px] leading-[1.9] text-ink/80">{h.cardText}</p>
          </div>

          <div className="mt-12 grid items-start gap-8 md:grid-cols-[1.25fr_.75fr]">
            <div className="space-y-8">
              {/* before: a bare screenshot */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-black uppercase tracking-wider text-white">{h.beforeTitle}</span>
                  <span className="text-[14px] font-bold">{h.cardBefore}</span>
                  <span className="text-[13px] text-muted">· {h.cardBeforeNote}</span>
                </div>
                <div className="max-w-[420px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between bg-ink/85 px-3 py-1 text-[9px] font-bold text-white/80"><span>9:41</span><span>●●●</span></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo("d1").thumb} alt="" className="h-40 w-full object-cover" style={{ objectPosition: "30% 40%" }} />
                  <div className="space-y-1.5 px-3 py-3">
                    <i className="block h-2 w-3/4 rounded bg-ink/15" />
                    <i className="block h-2 w-1/2 rounded bg-ink/10" />
                  </div>
                </div>
              </div>
              {/* after: the card */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-wider text-white">{h.afterTitle}</span>
                  <span className="text-[14px] font-bold">{h.cardAfter}</span>
                  <span className="hidden text-[13px] text-muted sm:inline">· {h.cardAfterNote}</span>
                </div>
                <Frame className="max-w-[560px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demo/card/d2" alt={h.cardAfter} className="aspect-[1200/630] w-full rounded-xl object-cover" />
                </Frame>
              </div>
            </div>

            {/* the tall version for stories and status */}
            <div className="mx-auto w-full max-w-[320px] md:mt-8">
              <Frame rotate={2}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo/card/d8?f=story" alt="" className="aspect-[1080/1350] w-full rounded-xl object-cover" />
              </Frame>
              <p className="mt-5 flex items-start gap-2 text-[14px] font-bold leading-snug">
                <Script className="mt-0.5 text-[26px]">↑</Script>
                {h.cardSave}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- "I want this!" ---------- */}
      <section id="share" className="scroll-mt-20 bg-white px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-[#e9dfd3] shadow-[0_30px_60px_-25px_rgba(57,53,51,.45)]">
              <div className="flex items-center gap-3 bg-[#f7f2ec] px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-black text-white">NA</span>
                <div className="leading-tight">
                  <div className="text-[14px] font-black">{DEMO.shop.name}</div>
                  <div className="text-[11.5px] font-bold text-ok">● {h.chatShopOnline}</div>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="w-[86%] overflow-hidden rounded-2xl rounded-tl-md bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demo/card/d7" alt={ruby.name} className="aspect-[1200/630] w-full object-cover" />
                  <div className="px-3.5 py-2.5 text-[12px] text-muted">myproductshelf.com/noor-atelier/p/…</div>
                </div>
                <div className="w-fit rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-[14px] font-bold shadow-sm">{h.chatWant} 😍</div>
                <div className="ml-auto w-fit rounded-2xl rounded-tr-md bg-[#d9fdd3] px-3.5 py-2.5 text-[14px] shadow-sm">{h.chatReply}</div>
              </div>
            </div>
            <Stamp className="absolute -right-5 -top-6 z-10"><span>{h.chatWant}</span></Stamp>
          </div>

          <div>
            <Label label={h.askLabel} sub={h.askSub} />
            <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.askTitle}</h2>
            <p className="mt-4 text-[16px] leading-[1.9] text-ink/80">{h.askText}</p>
            <ol className="mt-6 space-y-3">
              {h.askSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl bg-paper p-4">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand font-display text-base font-black text-white">{i + 1}</span>
                  <div>
                    <div className="font-display font-black">{s.title}</div>
                    <div className="text-[14.5px] text-ink/70">{s.text}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1faa59] px-4 py-2 text-[13.5px] font-bold text-white"><WhatsAppIcon className="h-4 w-4" /> {h.channelWhatsApp}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0a7cff] px-4 py-2 text-[13.5px] font-bold text-white"><MessengerIcon className="h-4 w-4" /> {h.channelMessenger}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(45deg,#f09433,#dc2743,#bc1888)] px-4 py-2 text-[13.5px] font-bold text-white"><InstagramIcon className="h-4 w-4" /> {h.channelInstagram}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13.5px] font-bold text-white"><FacebookIcon className="h-4 w-4" /> + {locale === "bn" ? "পরিবার ও বন্ধু" : "family & friends"}</span>
            </div>
            <p className="mt-5 text-[14px] leading-[1.8] text-muted">{h.askNote}</p>
            <div className="mt-6 rounded-2xl bg-ink p-5 text-white">
              <div className="font-display text-lg font-black">{h.notShopTitle}</div>
              <p className="mt-1 text-[14.5px] leading-[1.8] text-white/80">{h.notShopText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- no more screenshots ---------- */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Label label={h.shotsLabel} sub={h.shotsSub} />
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(26px,4vw,40px)] font-black leading-tight tracking-tight">{h.shotsTitle}</h2>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-black uppercase tracking-wider text-white">{h.beforeTitle}</span>
                <span className="text-[14px] font-bold">{h.beforeText}</span>
              </div>
              <div className="rounded-[1.6rem] border border-black/5 bg-white p-3 shadow-[0_10px_30px_rgba(57,53,51,.12)]">
                <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-bold text-muted">
                  <span>Screenshots</span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-white">{h.beforeCount}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {roll.map((r, i) => (
                    <div key={i} className="relative aspect-[9/16] overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/10" style={{ transform: `rotate(${r.rot}deg)` }}>
                      <div className="h-2 bg-ink/80" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.src} alt="" className="h-[58%] w-full object-cover" style={{ objectPosition: r.pos }} />
                      <div className="space-y-0.5 p-1">
                        <i className="block h-1 w-4/5 rounded bg-ink/20" />
                        <i className="block h-1 w-3/5 rounded bg-ink/15" />
                      </div>
                      <span className="absolute bottom-1 right-1 rounded bg-[#d9fdd3] px-1 text-[6px] font-bold">{["price?", "which?", "code?", "send"][i % 4]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto grid h-14 w-14 rotate-90 place-items-center rounded-full bg-brand text-white shadow-lg md:rotate-0" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m0 0l-5-5m5 5l-5 5" />
              </svg>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-wider text-white">{h.afterTitle}</span>
                <span className="text-[14px] font-bold">{h.afterText}</span>
              </div>
              <div className="rounded-[1.6rem] border border-black/5 bg-white p-3 shadow-[0_10px_30px_rgba(57,53,51,.12)]">
                <div className="mb-3 truncate rounded-full bg-paper px-3.5 py-1.5 text-center text-[12.5px] font-bold text-ink/80" dir="ltr">
                  myproductshelf.com/<span className="text-brand">noor-atelier</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9"].map((id) => {
                    const p = photo(id);
                    return (
                      <div key={id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumb} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                        <div className="mt-1 truncate text-[10px] font-bold leading-tight">{p.name}</div>
                        <div className="flex justify-between text-[9.5px] text-muted">
                          <span className="font-bold text-brand">{formatPrice(p.price, "BDT")}</span>
                          <span>{p.code}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- templates ---------- */}
      <section id="templates" className="scroll-mt-20 bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Label label={h.templatesLabel} sub={h.templatesSub} />
            <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.templatesTitle}</h2>
            <p className="mt-3 text-[16px] text-muted">{h.templatesText}</p>
          </div>
          <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto px-5 pb-8 [scrollbar-width:thin]">
            {TEMPLATES.map((x) => (
              <div key={x.id} className="w-[270px] flex-none snap-center text-center">
                <Phone id={x.id} name={x.name} className="mx-auto max-w-[290px]" />
                <h3 className="mt-5 font-display text-xl font-black">
                  {x.name}
                </h3>
                <span className="mt-2 flex justify-center gap-1.5" aria-hidden>
                  {x.swatch.map((c) => (
                    <i key={c} className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ background: c }} />
                  ))}
                </span>
                <p className="mx-auto mt-2 max-w-[260px] text-sm text-muted">{x.blurb[locale]}</p>
                <a href={`/demo/${x.id}`} target="_blank" className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink/80 px-5 py-2 text-[13.5px] font-black transition hover:bg-ink hover:text-white">
                  {h.openDemo} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- who it's for ---------- */}
      <section id="who" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Label label={h.whoLabel} sub={h.whoSub} />
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.whoTitle}</h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.9] text-ink/80">{h.whoText}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {h.who.map((w, i) => (
              <li key={w.title} className="rounded-2xl bg-white p-5 shadow-[0_6px_24px_rgba(57,53,51,.07)]">
                <span className="text-3xl" aria-hidden>{WHO_ICON[i]}</span>
                <h3 className="mt-3 font-display text-[17px] font-black leading-snug">{w.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.8] text-ink/75">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- features ---------- */}
      <section id="features" className="scroll-mt-20 bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Label label={h.featuresLabel} sub={h.featuresSub} />
            <h2 className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.featuresTitle}</h2>
            <p className="mt-4 text-[16px] leading-[1.9] text-ink/80">{h.featuresText}</p>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {h.features.map((f, i) => (
              <li key={f.title} className="flex gap-4">
                <span className={`mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-full text-white ${WHY_STYLE[i % 3]}`} aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
                <div>
                  <h3 className="font-display text-[17px] font-black">{f.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-[1.8] text-ink/75">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section id="how" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Label label={h.howLabel} sub={h.howSub} />
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.howTitle}</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {h.steps.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-black/5 bg-white p-7 shadow-[0_6px_24px_rgba(57,53,51,.07)]">
                <span className="font-script text-[64px] font-bold leading-none" style={{ color: ["#e17738", "#4e608f", "#61aea9"][i] }}>{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-black">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.85] text-ink/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- compare ---------- */}
      <section id="compare" className="scroll-mt-20 bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Label label={h.compareLabel} sub={h.compareSub} />
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.compareTitle}</h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.9] text-ink/80">{h.compareText}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {h.compares.map((c, i) => (
              <article key={c.title} className="rounded-2xl bg-paper p-6">
                <span className={`inline-block h-1.5 w-12 rounded-full ${WHY_STYLE[i]}`} aria-hidden />
                <h3 className="mt-4 font-display text-lg font-black">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.85] text-ink/75">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- tips ---------- */}
      <section id="guides" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Label label={h.guidesLabel} sub={h.guidesSub} />
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.guidesTitle}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {h.guides.map((g) => (
              <article key={g.title} className="rounded-2xl border border-black/5 bg-white p-7 shadow-[0_6px_24px_rgba(57,53,51,.07)]">
                <h3 className="font-display text-lg font-black leading-snug">{g.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.9] text-ink/75">{g.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="scroll-mt-20 bg-white px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <Label label={h.faqLabel} sub={h.faqSub} />
            <h2 className="mt-6 font-display text-[clamp(26px,4vw,38px)] font-black leading-tight tracking-tight">{h.faqTitle}</h2>
          </div>
          <div className="space-y-3">
            {h.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-paper px-5 py-4 open:bg-brand-soft/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[16px] font-black [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ink text-white transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-[1.85] text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- final call ---------- */}
      <section className="px-5 py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-brand px-6 py-16 text-center text-white">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">{h.ctaTitle}</h2>
          <p className="mt-3 text-lg text-white/90">{h.ctaText}</p>
          <div className="mt-8 flex justify-center">
            <PillLink href={go} light>{h.cta}</PillLink>
          </div>
          <Script className="absolute left-8 top-6 hidden -rotate-6 !text-white/70 md:block">✦</Script>
          <Script className="absolute bottom-6 right-10 hidden rotate-6 !text-white/70 md:block">✦</Script>
        </div>
      </section>
      </main>

      <footer className="border-t border-black/10 px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 text-sm text-muted md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-md leading-[1.8]">{h.footerAbout}</p>
          </div>
          <nav aria-label={h.footerExplore}>
            <div className="font-display text-base font-black text-ink">{h.footerExplore}</div>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 font-bold">
              {[
                ["#why", h.navWhy],
                ["#card", h.navCard],
                ["#templates", h.navTemplates],
                ["#who", h.navWho],
                ["#features", h.navFeatures],
                ["#guides", h.navGuides],
                ["#faq", h.navFaq],
              ].map(([href, label]) => (
                <li key={href}><a href={href} className="hover:text-brand">{label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-sm text-muted">{h.footer}</p>
      </footer>
    </div>
  );
}
