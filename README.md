# My Product Shelf

A gallery for small businesses. Sellers turn the products scattered across Facebook and
Instagram into one clean, organised page and share it with a single link. It is a gallery,
not a shop: there is no cart, checkout or ordering. Customers can share a product (photo,
name, code, price and a link) to WhatsApp or Messenger.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma and `sharp`.
English and Bangla throughout.

## Run it

You need a PostgreSQL database. A free Neon project works for local work too.

```bash
npm install
cp .env.example .env    # then fill in DATABASE_URL and DIRECT_URL
npx prisma migrate deploy
npm run dev             # http://localhost:3000
```

`.env` settings are described in `.env.example`. Without `BLOB_READ_WRITE_TOKEN`, photos are
written to `./uploads` and served from `/media/<key>`.

## Deploy on Vercel

1. Push to GitHub and import the repo in Vercel (it runs `npm run vercel-build`, which applies
   the database migrations and builds).
2. In the Vercel project, add a **Neon** database (Storage tab) or paste `DATABASE_URL` and
   `DIRECT_URL`, and create a **Blob** store, which adds `BLOB_READ_WRITE_TOKEN`.
3. Add `SITE_URL=https://myproductshelf.com` and `NEXT_PUBLIC_GA_ID` (Google Analytics).
4. To get an email for each "more products" request, add `RESEND_API_KEY` (from resend.com) and
   `REQUESTS_NOTIFY_EMAIL` (where to send it). Optional: `RESEND_FROM`, a sender on a domain you
   verified in Resend. Without these the request is still saved in the `ProductLimitRequest` table.
5. Add the domain under Settings, Domains, and point the Namecheap DNS records at Vercel.

Photos in Blob are stored as `photos/<id>.jpg` (full size) and `photos/<id>-t.jpg` (thumbnail),
and a product keeps the full public address.

## Where things are

| Path | What it is |
| --- | --- |
| `src/app/page.tsx` | Home page (English/Bangla) with live template demos |
| `src/app/(auth)` | Sign up and log in |
| `src/app/dashboard` | Get started, Business, Products, Template |
| `src/app/preview/[template]` | A seller's own products in any template |
| `src/app/demo/[template]` | Sample gallery used on the home page |
| `src/app/[slug]`, `[slug]/p/[id]` | Public gallery and shared product link (with share previews) |
| `src/app/api/products` | Create, edit, delete products and photos |
| `src/lib/i18n` | English and Bangla text (`en.ts`, `bn.ts`) |
| `src/lib/card.tsx` | The share card picture used for link previews and "Save card as picture". Bangla text is drawn with `sharp` because Satori cannot join Bangla letters. Fonts are in `src/assets/fonts` |
| `src/app/[slug]/p/[id]/card` | Serves a product's card (`?f=story` for the tall version) |
| `src/lib/storage.ts` | Photo storage. Photo storage: Vercel Blob when a token is set, local disk otherwise |
| `src/templates` | Templates, shared dialogs and the registry |

## Add a template

1. Create `src/templates/<name>/<Name>.tsx`. Copy an existing one and change the layout and
   look. Keep the CSS variables at the top (the share dialogs use them) and keep using
   `useGallery`, `ProductSheet` and `ShareDialog`.
2. Add one entry to `TEMPLATES` in `src/templates/registry.ts`.

The template picker, preview, home page demos and public pages pick it up automatically.
