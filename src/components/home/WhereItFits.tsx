import Link from "next/link";
import { Label } from "@/components/home/parts";

/**
 * "Where to share" and "is a gallery right for you?". Added for search and to answer what
 * other catalog tools leave out: where the link actually goes, and when you need a store instead.
 * English only for now, like the other newer home sections.
 */
const PLACES = [
  { icon: "📸", title: "Instagram bio", text: "Put your gallery link in your profile. Followers tap once and see every product, not just your latest post." },
  { icon: "💬", title: "WhatsApp", text: "Send one product as a designed card in a chat, or share your gallery link on your Status." },
  { icon: "👥", title: "Facebook and Messenger", text: "Add the link to your page's About section and send product cards when people message you." },
  { icon: "🧺", title: "Craft fairs and markets", text: "Turn your link into a QR code (any free QR maker works) and put it on your table, so shoppers can browse items you didn't bring." },
  { icon: "📦", title: "Packaging and thank-you notes", text: "Add the link to boxes and cards so happy customers can find your other products and share their favorites." },
];

const FITS = [
  "You take orders by message or in person",
  "Customers keep asking “do you have…?”",
  "You want something live in minutes, with no setup",
];
const NEEDS_STORE = [
  "You need a cart and card payments on your own site",
  "You need shipping rates and stock counts",
  "You sell hundreds of products",
];

export default function WhereItFits({ href, cta }: { href: string; cta: string }) {
  return (
    <section id="where" className="scroll-mt-20 bg-brand-soft/40 px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <Label label="WHERE TO SHARE" sub="One link, every place" />
        <h2 className="mt-6 max-w-3xl font-display text-[clamp(28px,4.4vw,44px)] font-black leading-tight tracking-tight">
          Put one link in every place your customers already look.
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-[1.9] text-ink/80">
          A product catalog only helps if people can find it. Your My Product Shelf link works anywhere you can paste a link, and every product also has its own link and share card.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map((p) => (
            <li key={p.title} className="rounded-2xl bg-white p-5 shadow-[0_6px_24px_rgba(57,53,51,.07)]">
              <span className="text-3xl" aria-hidden>{p.icon}</span>
              <h3 className="mt-3 font-display text-[17px] font-black leading-snug">{p.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.8] text-ink/75">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 overflow-hidden rounded-3xl bg-ink p-6 text-white md:p-10">
          <h3 className="font-display text-[clamp(22px,3vw,30px)] font-black leading-tight">Is a gallery the right fit?</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-[1.8] text-white/75">
            We would rather you pick the right tool. A gallery is lighter than a store, and it is not a store.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 text-ink ring-2 ring-brand">
              <span className="rounded-full bg-[#d6f1e0] px-3 py-1 text-[12px] font-black text-ok">✓ A gallery fits if</span>
              <ul className="mt-4 space-y-2.5 text-[14.5px] font-bold leading-snug">
                {FITS.map((f) => (
                  <li key={f} className="flex gap-2.5"><span className="text-ok" aria-hidden>✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-black">You may need a store builder if</span>
              <ul className="mt-4 space-y-2.5 text-[14.5px] leading-snug text-white/85">
                {NEEDS_STORE.map((f) => (
                  <li key={f} className="flex gap-2.5"><span aria-hidden>•</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href={href}
            className="mt-7 inline-flex whitespace-nowrap rounded-xl bg-brand px-7 py-3.5 text-base font-black text-white shadow-[0_4px_0_#b8571f] transition hover:bg-brand-dark active:translate-y-[2px] active:shadow-[0_2px_0_#b8571f]"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
