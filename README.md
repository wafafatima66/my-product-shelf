# My Product Shelf

A gallery for small businesses. Sellers turn the products scattered across Facebook and
Instagram into one clean, organised page and share it with a single link. It is a gallery,
not a shop: there is no cart, checkout or ordering. Customers can share a product (photo,
name, code, price and a link) to WhatsApp or Messenger.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma and `sharp`.
English and Bangla throughout.

## Run it

```bash
npm install
npx prisma db push      # creates prisma/dev.db and the Prisma client
npm run dev             # http://localhost:3000
```

`.env` holds `DATABASE_URL` (SQLite for now) and `SITE_URL` (used for share previews).
In production set `SITE_URL=https://myproductshelf.com`.
Uploaded photos are written to `./uploads` and served from `/media/<key>`.

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
| `src/lib/storage.ts` | Photo storage. The only file that changes when moving to Supabase Storage |
| `src/templates` | Templates, shared dialogs and the registry |

## Add a template

1. Create `src/templates/<name>/<Name>.tsx`. Copy an existing one and change the layout and
   look. Keep the CSS variables at the top (the share dialogs use them) and keep using
   `useGallery`, `ProductSheet` and `ShareDialog`.
2. Add one entry to `TEMPLATES` in `src/templates/registry.ts`.

The template picker, preview, home page demos and public pages pick it up automatically.

## Moving to Supabase later

1. In `prisma/schema.prisma` change the provider to `postgresql` and set `DATABASE_URL` to the
   Supabase connection string, then run `npx prisma migrate dev`.
2. Replace the file functions in `src/lib/storage.ts` with Supabase Storage uploads and make
   `mediaUrl` (`src/lib/media.ts`) return the bucket URL.
3. Accounts currently use email and password with hashed passwords and database sessions
   (`src/lib/auth.ts`). They can stay, or be swapped for Supabase Auth.
