import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type P = SVGProps<SVGSVGElement>;

export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" />
  </svg>
);
export const FacebookIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" />
  </svg>
);
export const WhatsAppIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21z" />
    <path d="M9 8.5c0 3 3 6 6 6l1.2-1.4-2-1-1 .6c-.8-.3-1.6-1.1-1.9-1.9l.6-1-1-2L9 8.5z" />
  </svg>
);
export const MessengerIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3C7 3 3 6.8 3 11.5c0 2.6 1.2 4.9 3.1 6.4V21l3-1.7c.9.3 1.9.4 2.9.4 5 0 9-3.8 9-8.5S17 3 12 3z" />
    <path d="M7.5 13.5l3-3.2 2 2 3.5-2.8-3 3.2-2-2-3.5 2.8z" />
  </svg>
);
export const ShareIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
export const CopyIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
export const ImageIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M21 16l-5-5-8 9" />
  </svg>
);
