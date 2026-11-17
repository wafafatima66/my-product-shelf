-- New shops start on the Fresh template and in US dollars.
ALTER TABLE "Shop" ALTER COLUMN "template" SET DEFAULT 'fresh';
ALTER TABLE "Shop" ALTER COLUMN "currency" SET DEFAULT 'USD';

-- Products no longer have categories.
ALTER TABLE "Product" DROP COLUMN "category";
