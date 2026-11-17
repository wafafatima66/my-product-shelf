"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/** Pages that are not real visits: the template demos are embedded in the home page, and the dashboard is private. */
const SKIP = ["/demo", "/preview", "/dashboard"];

/**
 * Google Analytics 4. Renders nothing until NEXT_PUBLIC_GA_ID is set, and only in production,
 * so local work never pollutes the reports.
 */
export default function Analytics({ id }: { id?: string }) {
  const path = usePathname();
  if (!id || process.env.NODE_ENV !== "production") return null;
  if (SKIP.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
